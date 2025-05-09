import FalloutPerkManager from "../system/FalloutPerkManager.mjs";

export default class FalloutActor extends Actor {

	isSleeping = false;

	constructor(object, options = {}) {
		super(object, options);
	}


	/**
	 * Update any settlement sheets that may be linked to the deleted Actor
	 *
	 * @static
	 * @param {*} actor
	 * @param {*} options
	 * @param {*} userId
	 */
	static async updateLinkedSettlementSheets(actor, options, userId) {
		if (!game.user.isGM) {
			return;
		}
		if (actor.type !== "npc") {
			return;
		}

		const settlementUuid = actor.system.settlement.uuid;

		if (settlementUuid === "") {
			return;
		}

		const settlement = await fromUuid(settlementUuid);
		if (settlement) {
			if (settlement.system.leader === actor.uuid) {
				await settlement.update({ "system.leader": "" });
				settlement.sheet.render(false);
			}
		}
	}


	get attributeTotals() {
		const totals = {
			bonus: 0,
			max: CONFIG.FALLOUT.DEFAULT_ATTRIBUTES_TOTAL,
			total: 0,
		};

		for (const key in this.system.attributes) {
			const attribute = this.system.attributes[key];

			totals.bonus += attribute.bonus;
			totals.max += attribute.bonus;
			totals.total += attribute.value + attribute.bonus;
		}

		totals.diff = totals.max - totals.total;

		return totals;
	}


	get deleteExhaustedConsumables() {
		return game.settings.get("fallout", "deleteExhaustedConsumables");
	}


	get isAlcoholic() {
		return this.system.conditions.alcoholic;
	}


	get isCreature() {
		return this.type === "creature";
	}


	get isNotCreature() {
		return !this.isCreature;
	}

	get isVehicle() {
		return this.type === "vehicle";
	}

	get isNotVehicle() {
		return !this.isVehicle;
	}

	get isNotRobot() {
		return !this.isRobot;
	}

	get isNotWellRested() {
		return !this.isWellRested;
	}

	get isPlayerCharacter() {
		return ["character", "robot"].includes(this.type);
	}

	get isRobot() {
		return this.type === "robot";
	}

	get isWellRested() {
		return this.type === "character" && this.system.conditions.wellRested;
	}

	get overriddenFields() {
		return Object.keys(
			foundry.utils.flattenObject(this.overrides)
		);
	}

	get ownerIsOffline() {
		return !this.ownerIsOnline;
	}

	get ownerIsOnline() {
		const onlineUsers = game.users.filter(
			user => !user.isGM && user.active
		);

		let hasActiveOwner = false;

		for (const user of onlineUsers) {
			if (this.ownership[user._id] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
				|| this.ownership.default === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
			) {
				hasActiveOwner = true;
				break;
			}
		}

		return hasActiveOwner;
	}

	get shouldHaveSkillsAdded() {
		return ["character", "npc", "robot"].includes(this.type);
	}

	get useKgs() {
		return game.settings.get("fallout", "carryUnit") === "kgs";
	}

	// _initializeSource(source, options={}) {
	// 	source = super._initializeSource(source, options);
	// }

	incrementJunk() {
		const newJunk = this.system.materials.junk + 1;
		this.update({ "system.materials.junk": newJunk });
	}

	isFieldOverridden(fieldName) {
		return this.overriddenFields.includes(fieldName);
	}

	// Returns the current perk level, or zero if the player doesn't have the
	// perk (or can't have perks)
	//
	perkLevel(perkName) {
		if (!["character", "robot", "npc"].includes(this.type)) {
			return 0;
		}

		const perk = this.items.find(i => {
			const hasBabeleTranslation = i.flags?.babele?.hasTranslation === true;
			const nameToCompare = hasBabeleTranslation ? i.flags.babele.originalName : i.name;
			return i.type === "perk" && nameToCompare.toLowerCase() === perkName.toLowerCase();
		});

		return perk?.system?.rank?.value ?? 0;
	}

	prepareData() {
		super.prepareData();

		if (this.isPlayerCharacter) {
			this._preparePerkManager();
		}

		this.system.currency.caps = Math.round(this.system.currency.caps);
	}

	/**
	* @override
	* Augment the basic actor data with additional dynamic data. Typically,
	* you'll want to handle most of your calculated/derived data in this step.
	* Data calculated in this step should generally not exist in template.json
	* (such as ability modifiers rather than ability scores) and should be
	* available both inside and outside of character sheets (such as if an actor
	* is queried and has a roll executed directly from it).
	*/
	prepareDerivedData() {
		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		const disableAutoDerivedStats = game.settings.get(
			SYSTEM_ID, "disableAutoDerivedStats"
		);

		if (!disableAutoDerivedStats && (this.type === "character" || this.type === "robot")) {
			this._calculateDefense();
			this._calculateInitiative();
			this._calculateMaxHp();
			this._calculateMeleeDamage();
			this._calculateNextLevelXp();
		}

		this._prepareCharacterData();
		this._prepareNpcData();
		this._prepareRobotData();
		this._prepareSettlementData();

		if (["character", "npc", "robot"].includes(this.type)) {
			const athletics = this.items.find(
				i => i.name.toLowerCase() === "athletics" && i.type === "skill"
			);

			const athleticsValue = athletics !== undefined
				? athletics.system.value
				: 0;

			this.system.unofficalSpeed =
				this.system.attributes.agi.value + athleticsValue;
		}
		else if (this.type === "creature") {
			this.system.unofficalSpeed =
				this.system.body.value + this.system.body.mod;
		}
	}

	/**
   * Prepare Character type specific data
   */

	// CHARACTER
	_prepareCharacterData() {
		if (!["character"].includes(this.type)) {
			return;
		}

		this._calculateCharacterBodyResistance();
		this._calculateEncumbrance();
	}

	_calculateEncumbrance() {
		let strWeight = parseInt(this.system.attributes.str.value) * 10;
		if (this.useKgs) {
			strWeight = Math.round(fallout.utils.lbsToKgs(strWeight));
		}

		this.system.carryWeight.base = strWeight + parseInt(
			game.settings.get("fallout", "carryBase")
		);

		this.system.carryWeight.value =
			this.system.carryWeight.base + parseInt(this.system.carryWeight.mod);

		this.system.carryWeight.total = this._getItemsTotalWeight();

		this.system.encumbranceLevel = 0;
		if (this.system.carryWeight.total > this.system.carryWeight.value) {
			let dif = this.system.carryWeight.total - this.system.carryWeight.value;
			this.system.encumbranceLevel = Math.ceil(dif / 50);
		}
	}

	_calculateCharacterBodyResistance() {
		//  ! CHECK for the OUTFIT
		// Prep Body Locations
		let outfittedLocations = {};
		for (let [k] of Object.entries(
			this.system.body_parts
		)) {
			outfittedLocations[k] = false;
		}

		// ! CHECK POWER ARMOR PIECES
		for (let [k, v] of Object.entries(outfittedLocations)) {
			if (!v) {
				let pow = this.items.find(
					i => i.type === "apparel"
						&& i.system.apparelType === "powerArmor"
						&& i.system.equipped
						&& i.system.powerArmor.powered
						&& i.system.powerArmor.isFrame === false
						&& i.system.location[k] === true
						&& i.system.stashed === false
				);
				if (pow && !outfittedLocations[k]) {
					outfittedLocations[k] = foundry.utils.duplicate(pow.toObject());
				}
			}
		}

		// ! CHECK ARMOR PIECES
		for (let [k, v] of Object.entries(outfittedLocations)) {
			if (!v) {
				let armor = this.items.find(
					i => i.type === "apparel"
						&& i.system.apparelType === "armor"
						&& i.system.equipped
						&& i.system.location[k] === true
						&& i.system.stashed === false
				);
				if (armor && !outfittedLocations[k]) {
					outfittedLocations[k] = foundry.utils.duplicate(armor.toObject());
				}
			}
		}

		// ! CHECK OUTFIT
		if (!outfittedLocations.torso
			&& !outfittedLocations.armR
			&& !outfittedLocations.armL
			&& !outfittedLocations.legL
			&& !outfittedLocations.legR
		) {
			let outfit = this.items.find(
				i =>
					i.type === "apparel"
					&& i.system.apparelType === "outfit"
					&& i.system.equipped
			);
			if (outfit) {
				for (let [k, v] of Object.entries(outfit.system.location)) {
					if (v) {
						outfittedLocations[k] = foundry.utils.duplicate(outfit.toObject());
					}
				}
			}
		}

		// ! CHECK HEADGEAR
		if (!outfittedLocations.head) {
			let headgear = this.items.find(i => i.type === "apparel"
				&& i.system.apparelType === "headgear"
				&& i.system.equipped
			);

			if (headgear) {
				outfittedLocations.head = foundry.utils.duplicate(headgear.toObject());
			}
		}

		// ! ADD CLOTHING VALUES
		let clothing = this.items.find(
			i =>
				i.type === "apparel"
				&& i.system.apparelType === "clothing"
				&& i.system.equipped
		);

		if (clothing) {
			for (let [k, v] of Object.entries(clothing.system.location)) {
				if (outfittedLocations[k] && v) {
					outfittedLocations[k].name += ` over ${clothing.name}`;
					outfittedLocations[k].system.resistance.physical = Math.max(
						parseInt(outfittedLocations[k].system.resistance.physical),
						parseInt(clothing.system.resistance.physical)
					);
					outfittedLocations[k].system.resistance.energy = Math.max(
						parseInt(outfittedLocations[k].system.resistance.energy),
						parseInt(clothing.system.resistance.energy)
					);
					outfittedLocations[k].system.resistance.radiation = Math.max(
						parseInt(outfittedLocations[k].system.resistance.radiation),
						parseInt(clothing.system.resistance.radiation)
					);
				}
				else if (!outfittedLocations[k] && v) {
					outfittedLocations[k] = foundry.utils.duplicate(clothing.toObject());
				}
			}
		}

		// ! SET BODY PARTS TO OUTFIT ADD CHARACTER BONUSES
		for (let [k, bodyPart] of Object.entries(this.system.body_parts)) {
			// Armor can't provide poison resistance, so this should always be
			// set to the base character resistance
			//
			bodyPart.resistance.poison = parseInt(this.system.resistance.poison);

			if (outfittedLocations[k]) {
				bodyPart.resistance.physical =
					parseInt(outfittedLocations[k].system.resistance.physical)
					+ parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy =
					parseInt(outfittedLocations[k].system.resistance.energy)
					+ parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation =
					parseInt(outfittedLocations[k].system.resistance.radiation)
					+ parseInt(this.system.resistance.radiation);
			}
			else {
				bodyPart.resistance.physical = parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy = parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation = parseInt(this.system.resistance.radiation);
			}
		}
		// ADD OUTFITED LIST FOR DISPLAY
		this.system.outfittedLocations = outfittedLocations;
	}

	_calculateDefense() {
		const defense = this.system.attributes.agi.value <= 8 ? 1 : 2;

		this.system.defense.value = defense + this.system.defense.bonus;
	}

	_calculateInitiative() {
		this.system.initiative.value = this.system.attributes.per.value
			+ this.system.attributes.agi.value
			+ this.system.initiative.bonus;
	}

	_calculateMaxHp() {
		const currentLevel = parseInt(this.system.level.value);

		this.system.health.max = this.system.attributes.end.value
			+ this.system.attributes.luc.value
			+ currentLevel - 1
			- this.system.radiation
			+ this.system.health.bonus;

		if (this.isWellRested) {
			this.system.health.max += 2;
		}

		this.system.health.value = Math.min(
			this.system.health.value,
			this.system.health.max
		);
	}

	_calculateMeleeDamage() {
		const strength = this.system.attributes.str.value;

		let meleeDamage = 0;

		if (strength <= 8 && strength >= 7) {
			meleeDamage = 1;
		}
		else if (strength <= 10 && strength >= 9) {
			meleeDamage = 2;
		}
		else if (strength >= 11) {
			meleeDamage = 3;
		}

		this.system.meleeDamage.value =
			meleeDamage + this.system.meleeDamage.bonus;
	}

	_calculateNextLevelXp() {
		const disableAutoXpTarget = game.settings.get(
			SYSTEM_ID, "disableAutoXpTarget"
		);

		if (disableAutoXpTarget) {
			return;
		}

		const currentLevel = parseInt(this.system.level.value);

		let nextLevelXp = 0;
		if (currentLevel > 0) {
			const nextLevel = currentLevel + 1;

			nextLevelXp = nextLevel * currentLevel / 2 * 100;
		}

		this.system.level.nextLevelXP = nextLevelXp;
	}

	_prepareRobotData() {
		if (this.type !== "robot") {
			return;
		}

		this._calculateRobotBodyResistance();

		this.system.favoriteWeapons = this.items.filter(
			i => i.type === "weapon" && i.system.favorite
		);

		this.system.equippedRobotMods = this.items.filter(
			i => i.type === "robot_mod" && i.system.equipped
		).slice(0, 3);

		let robotArmors = this.items.filter(i => {
			return i.type === "robot_armor";
		});

		let _robotArmorsCarryModifier = 0;
		for (let i of robotArmors) {
			if (i.system.equipped && !i.system.stashed) {
				_robotArmorsCarryModifier += parseInt(i.system.carry);
			}
		}
		this.system.carryWeight.base +=
			parseInt(game.settings.get("fallout", "carryBaseRobot")) + _robotArmorsCarryModifier;

		this.system.carryWeight.value =
			parseInt(this.system.carryWeight.base) + parseInt(this.system.carryWeight.mod);

		this.system.carryWeight.total = this._getItemsTotalWeight();
		this.system.encumbranceLevel = 0;
		if (this.system.carryWeight.total > this.system.carryWeight.value) {
			let diff = this.system.carryWeight.total - this.system.carryWeight.value;
			this.system.encumbranceLevel = Math.ceil(diff / 50);
		}
	}

	_prepareSettlementData() {
		if (this.type !== "settlement") {
			return;
		}

		this.system.storage.base =
			parseInt(game.settings.get("fallout", "baseSettlementStorage"));

		this.system.storage.value =
			parseInt(this.system.storage.base) + parseInt(this.system.storage.mod);

		this.system.people.max = 0;
		if (this.system.leader !== "") {
			const leader = fromUuidSync(this.system.leader);

			this.system.people.max = parseInt(leader.system.attributes.cha.value) + 10;
		}

		const settlers = game.actors.filter(a => a.type === "npc"
			&& a.system.settlement.uuid === this.uuid
		);

		const people = this.system.people.value =
			settlers.length + this.system.people.mod;

		let happiness = 10;
		for (const attribute of ["beds", "defense", "food", "water"]) {
			this.system[attribute].min = people;
			if (this.system[attribute].value < people) {
				happiness--;
			}
		}

		this.system.happiness.value = happiness;
		this.system.happiness.total = this.system.happiness.value + this.system.happiness.mod;

		if (this.system.happiness.total < 1) {
			this.system.happiness.total = 1;
		}
		if (this.system.happiness.total > 20) {
			this.system.happiness.total = 20;
		}

		this.system.storage.total = this._getItemsTotalWeight();
	}

	_calculateRobotBodyResistance() {
		let outfittedLocations = {};
		for (let [k] of Object.entries(
			this.system.body_parts
		)) {
			outfittedLocations[k] = false;
		}

		// ADD ROBOT ARMOR
		for (let [k, v] of Object.entries(outfittedLocations)) {
			if (!v) {
				let armor = this.items.find(i => i.type === "robot_armor"
					&& i.system.apparelType === "armor"
					&& i.system.equipped
					&& i.system.location[k] === true
				);

				if (armor && !outfittedLocations[k]) {
					outfittedLocations[k] = foundry.utils.duplicate(armor.toObject());
				}
			}
		}
		// ADD PLATING AND RESISTANCE BONUSES
		let plating = this.items.find(i => i.type === "robot_armor"
			&& i.system.apparelType === "plating"
			&& i.system.equipped
		);

		if (plating) {
			for (let [k, v] of Object.entries(plating.system.location)) {
				if (outfittedLocations[k] && v) {
					outfittedLocations[k].name += ` over ${plating.name}`;
					outfittedLocations[k].system.resistance.physical =
						parseInt(outfittedLocations[k].system.resistance.physical)
						+ parseInt(plating.system.resistance.physical);
					outfittedLocations[k].system.resistance.energy =
						parseInt(outfittedLocations[k].system.resistance.energy)
						+ parseInt(plating.system.resistance.energy);
					outfittedLocations[k].system.resistance.radiation =
						parseInt(outfittedLocations[k].system.resistance.radiation)
						+ parseInt(plating.system.resistance.radiation);
				}
				else if (!outfittedLocations[k] && v) {
					outfittedLocations[k] = foundry.utils.duplicate(plating.toObject());
				}
			}
		}

		// ! SET BODY PARTS TO OUTFIT AND ADD CHARACTER BONUSES
		for (let [k, bodyPart] of Object.entries(this.system.body_parts)) {
			if (outfittedLocations[k]) {
				bodyPart.resistance.physical =
					parseInt(outfittedLocations[k].system.resistance.physical)
					+ parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy =
					parseInt(outfittedLocations[k].system.resistance.energy)
					+ parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation =
					parseInt(outfittedLocations[k].system.resistance.radiation)
					+ parseInt(this.system.resistance.radiation);
			}
			else {
				bodyPart.resistance.physical = parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy = parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation = parseInt(this.system.resistance.radiation);
			}
		}
		// ADD OUTFITED LIST FOR DISPLAY
		this.system.outfittedLocations = outfittedLocations;
	}

	_getAvailableAmmoType(name) {
		const ammoItems = this.items.filter(
			i => i.name === name && i.type === "ammo"
		);

		// Ensure we always use the ammo item with the least amount of shots
		// remaining first.
		ammoItems.sort((a, b) => {
			const aTotalShots =
				((a.system.quantity - 1) * a.system.shots.max) + a.system.shots.current;

			const bTotalShots =
				((b.system.quantity - 1) * b.system.shots.max) + b.system.shots.current;

			if (aTotalShots > bTotalShots) {
				return 1;
			}
			else if (bTotalShots > aTotalShots) {
				return -1;
			}
			else {
				return 0;
			}
		});

		let shotsAvailable = 0;

		if (ammoItems) {
			shotsAvailable = ammoItems.reduce(
				(accumulator, ammoItem) => {
					const maxShots = ammoItem.system.shots.max;
					const currentShots = ammoItem.system.shots.current;
					const reserveQuantity = ammoItem.system.quantity - 1;

					const shots = currentShots + (reserveQuantity * maxShots);

					return accumulator + shots;
				},
				0
			);
		}

		return [ammoItems, shotsAvailable];
	}

	// Calculate Total Weight Of Items
	_getItemsTotalWeight() {
		let physicalItems = this.items.filter(i => {
			return !i.system.stashed && i.system.weight != null;
		});
		// remove powered powerArmor pieces for characters
		if (this.type === "character") {
			physicalItems = physicalItems.filter(i => {
				if (i.system.apparelType === "powerArmor") {
					return !i.system.powerArmor.powered;
				}
				else {
					return true;
				}
			});
		}
		else if (this.isCreature) {
			// remove butchery items from calculation
			physicalItems = physicalItems.filter(i => {
				if (i.type === "consumable") {
					return !i.system.butchery;
				}
				else {
					return true;
				}
			});
		}

		let physicalItemsMap = physicalItems.map(i => i.toObject());

		let junkWeight = this.system.materials.junk * 2;
		let materialWeight = 0;
		for (const material of ["common", "uncommon", "rare"]) {
			materialWeight += this.system.materials[material] ?? 0;
		}

		if (this.useKgs) {
			junkWeight = fallout.utils.lbsToKgs(junkWeight);
			materialWeight = fallout.utils.lbsToKgs(materialWeight);
		}

		let itemsWeight = 0;

		for (let i of physicalItemsMap) {
			let itemWeight = parseFloat(i.system.weight);
			itemWeight = isNaN(itemWeight) ? 0 : itemWeight;

			let itemQuantity = parseFloat(i.system.quantity);
			itemQuantity = isNaN(itemQuantity) ? 0 : itemQuantity;

			if (i.system.isJunk) {
				junkWeight += itemWeight * itemQuantity;
			}
			else {
				itemsWeight += itemWeight * itemQuantity;
			}
		}

		if (this.perkLevel("Pack Rat") > 0) {
			// Junk counts as half weight for players with the "Pack Rat"
			// perk
			junkWeight /= 2;
		}

		const totalWeight = itemsWeight + junkWeight + materialWeight;

		return parseFloat(totalWeight.toFixed(2));
	}

	/**
   * Prepare NPC type specific data.
   */
	_prepareNpcData() {
		if (!["creature", "npc", "vehicle"].includes(this.type)) {
			return;
		}

		const disableAutoXpReward = game.settings.get(
			SYSTEM_ID, "disableAutoXpReward"
		);

		if (disableAutoXpReward) {
			return;
		}

		this.system.level.rewardXP = fallout.utils.calculateXpReward(
			this.system.level.value,
			this.system.category
		);

		if (this.isCreature || this.isVehicle) {
			this.system.carryWeight.total = this._getItemsTotalWeight();
		}
		else {
			this._calculateEncumbrance();
		}

		if (this.isVehicle) {
			if (this.system.vehicleQuality.cargo_x.value) {
				this.system.carryWeight.base = this.system.vehicleQuality.cargo_x.rank;
			}
			else {
				this.system.carryWeight.base = 0;
			}
		}

	}

	getLastConditionChanges() {
		return {
			hunger: this.system.conditions.lastChange.hunger,
			sleep: this.system.conditions.lastChange.sleep,
			thirst: this.system.conditions.lastChange.thirst,
		};
	}

	setLastConditionChanges(lastChanges) {
		this.updateSource({
			"system.conditions.lastChange.hunger": lastChanges.hunger,
			"system.conditions.lastChange.sleep": lastChanges.sleep,
			"system.conditions.lastChange.thirst": lastChanges.thirst,
		});
	}

	/**
   * Override getRollData() that's supplied to rolls.
   */
	getRollData() {
		const data = super.getRollData();

		if (this.type === "character" || this.type === "robot") {
			this._getCharacterRollData(data);
		}

		if (this.type === "npc") {
			this._getNpcRollData(data);
		}

		return data;
	}

	/**
   * Prepare character roll data.
   */
	_getCharacterRollData(data) {
		// Copy the ability scores to the top level, so that rolls can use
		// formulas like `@str.mod + 4`.
		if (data.attributes) {
			for (let [k, v] of Object.entries(data.attributes)) {
				data[k] = foundry.utils.deepClone(v);
			}
		}

		// Add level for easier access, or fall back to 0.
		if (data.level) {
			data.lvl = data.level.value ?? 0;
		}
	}

	/**
   * Prepare NPC roll data.
   */
	_getNpcRollData(data) { }

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		// If prototypeToken already exists in data then we are copying an
		// actor and really shouldn't mess with any values
		//
		if (data.prototypeToken) {
			return;
		}

		const update = {};

		const prototypeToken = {
			actorLink: false,
			disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
			name: data.name, // Set token name to actor name
			sight: {
				enabled: true,
			},
			texture: foundry.utils.duplicate(this.prototypeToken.texture),
		};

		if (["character", "robot", "settlement"].includes(data.type)) {
			prototypeToken.actorLink = true;
			prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
		}

		if (data.type === "scavenging_location") {
			prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.NEUTRAL;
		}

		update.prototypeToken = prototypeToken;

		if (!data.img) {
			const image = CONFIG.FALLOUT.DEFAULT_TOKENS[data.type] ?? undefined;

			if (image) {
				update.img = image;
				update.prototypeToken.texture = {
					src: image,
				};
			}
		}

		// Add Skills to Characters, NPCs and Robots
		if (this.shouldHaveSkillsAdded) {
			// If the Actor data already contains skill items then this is an
			// Actor being duplicated and we don't want to touch their
			// items at all
			//
			const alreadyHasSkills = Array.isArray(data.items)
				&& data.items.filter(i => i.type === "skill").length > 0;

			if (!alreadyHasSkills) {
				let packSkills =
					await game.packs.get("fallout.skills").getDocuments();

				update.items = this.items.map(i => i.toObject());

				packSkills.forEach(s => {
					update.items.push(s.toObject());
				});
			}
		}

		await this.updateSource(update);

		// Seed the lastUsed timestamp for consumables
		if (this.type === "character") {
			const currentWorldTime = game.time.worldTime;

			await this.updateSource({
				"system.conditions.lastChanged.hunger": currentWorldTime,
				"system.conditions.lastChanged.sleep": currentWorldTime,
				"system.conditions.lastChanged.thirst": currentWorldTime,
			});
		}

		if (this.type === "scavenging_location") {
			const categoryTableDefaults = game.settings.get(
				SYSTEM_ID, "scavengingCategoryTables"
			) ?? {};

			const scavengingLocationUpdate = {};

			for (const category of Object.keys(categoryTableDefaults)) {
				const key = `system.item_types.${category}.table`;
				scavengingLocationUpdate[key] = categoryTableDefaults[category];
			}

			await this.updateSource(scavengingLocationUpdate);
		}

	}

	_preparePerkManager() {
		this.perkManager = new FalloutPerkManager(this);

		// this.perkManager.setActorAttributes(
		// 	foundry.utils.duplicate(this.system.attributes)
		// );

		// const knownPerks = [];

		// for (const item of this.items) {
		// 	if (item.type === "perk") {
		// 		knownPerks.push({
		// 			identifier: item.name.slugify(),
		// 			rank: item.system.rank.value,
		// 		});
		// 	}
		// }

		// this.perkManager.setKnownPerks(knownPerks);

		// this.perkManager.setActorReadMagazines(
		// 	foundry.utils.duplicate(this.system.readMagazines)
		// );
	}

	async _toggleImmunity(type) {
		if (!["poison", "radiation"].includes(type)) {
			return;
		}

		const currentValue = this.system.immunities[type];
		const updateData = {};
		updateData[`system.immunities.${type}`] = !currentValue;
		this.update(updateData);
	}

	async _updateHunger(currentWorldTime) {
		let lastChange = this.system.conditions?.lastChanged?.hunger;

		let timeElapsed = currentWorldTime - Math.abs(lastChange);
		let changed = false;

		if (lastChange < 0 || timeElapsed <= 0) {
			return changed;
		}

		let hunger = this.system.conditions.hunger;
		let fatigue = this.system.conditions.fatigue;

		let keepChecking = true;
		while (keepChecking) {
			switch (hunger) {
				case CONFIG.FALLOUT.CONDITIONS.hunger.full:
					if (timeElapsed >= CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Hunger] ${this.name} Full > Sated`);
						hunger = CONFIG.FALLOUT.CONDITIONS.hunger.sated;
						lastChange += CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.hunger.sated:
					if (timeElapsed >= CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Hunger] ${this.name} Sated > Peckish`);
						hunger = CONFIG.FALLOUT.CONDITIONS.hunger.peckish;
						lastChange += CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.hunger.peckish:
					if (timeElapsed >= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Hunger] ${this.name} Peckish > Hungry`);
						hunger = CONFIG.FALLOUT.CONDITIONS.hunger.hungry;
						lastChange += CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.hunger.hungry:
					if (timeElapsed >= CONFIG.FALLOUT.SIXTEEN_HOURS_IN_SECONDS) {
						hunger = CONFIG.FALLOUT.CONDITIONS.hunger.starving;
						fallout.debug(`Condition Tracker: [Hunger] ${this.name} Hungry > Starving`);
						if (!this.isSleeping) {
							fallout.debug(
								`Condition Tracker: [Hunger] ${this.name} Fatigue ${fatigue} > ${fatigue + 1}`
							);
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.SIXTEEN_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.SIXTEEN_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.hunger.starving:
					if (timeElapsed >= CONFIG.FALLOUT.ONE_DAY_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Hunger] ${this.name} Starving`);
						if (!this.isSleeping) {
							fallout.debug(
								`Condition Tracker: [Hunger] ${this.name} Fatigue ${fatigue} > ${fatigue + 1}`
							);
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.ONE_DAY_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.ONE_DAY_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				default:
					keepChecking = false;
			}
		}

		if (changed) {
			await this.update({
				"system.conditions.lastChanged.hunger": lastChange,
				"system.conditions.hunger": hunger,
				"system.conditions.fatigue": fatigue,

			});
		}

		return changed;
	}

	async _updateThirst(currentWorldTime) {
		let lastChange = this.system.conditions?.lastChanged?.thirst;

		let timeElapsed = currentWorldTime - Math.abs(lastChange);
		let changed = false;

		if (timeElapsed <= 0) {
			return changed;
		}

		let thirst = this.system.conditions.thirst;
		let fatigue = this.system.conditions.fatigue;

		let keepChecking = true;
		while (keepChecking) {
			switch (thirst) {
				case CONFIG.FALLOUT.CONDITIONS.thirst.quenched:
					if (timeElapsed >= CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Thirst] ${this.name} Quenched > Hydrated`);
						thirst = CONFIG.FALLOUT.CONDITIONS.thirst.hydrated;
						lastChange += CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.thirst.hydrated:
					if (timeElapsed >= CONFIG.FALLOUT.TWO_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Thirst] ${this.name} Hydrated > Thirsty`);
						thirst = CONFIG.FALLOUT.CONDITIONS.thirst.thirsty;
						lastChange += CONFIG.FALLOUT.TWO_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.TWO_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.thirst.thirsty:
					if (timeElapsed >= CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Thirst] ${this.name} Thirsty > Dehydrated`);
						thirst = CONFIG.FALLOUT.CONDITIONS.thirst.dehydrated;
						if (!this.isSleeping) {
							fallout.debug(
								`Condition Tracker: [Thirst] ${this.name} Fatigue ${fatigue} > ${fatigue + 1}`
							);
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.thirst.dehydrated:
					if (timeElapsed >= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Thirst] ${this.name} Dehydrated`);
						if (!this.isSleeping) {
							fallout.debug(
								`Condition Tracker: [Thirst] ${this.name} Fatigue ${fatigue} > ${fatigue + 1}`
							);
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				default:
					keepChecking = false;
			}
		}

		if (changed) {
			await this.update({
				"system.conditions.lastChanged.thirst": lastChange,
				"system.conditions.thirst": thirst,
				"system.conditions.fatigue": fatigue,

			});
		}

		return changed;
	}

	async _updateSleep(currentWorldTime) {
		let lastChange = this.system.conditions?.lastChanged?.sleep;

		let timeElapsed = currentWorldTime - Math.abs(lastChange);
		let changed = false;

		if (timeElapsed <= 0) {
			return changed;
		}

		let sleep = this.system.conditions.sleep;
		let fatigue = this.system.conditions.fatigue;

		let keepChecking = true;
		const maxIterations = 10;
		let iterations = 0;
		while (keepChecking) {
			iterations++;
			if (iterations > maxIterations) {
				fallout.error(`Condition Tracker: [Sleep] Actor ${this.name} exceeded maximum iterations.`);
				console.log(`currentWorldTime: ${currentWorldTime}`);
				console.log(`timeElapsed: ${timeElapsed}`);
				fallout.error(this.system.conditions);
				break;
			}
			switch (sleep) {
				case CONFIG.FALLOUT.CONDITIONS.sleep.rested:
					if (timeElapsed >= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Sleep] ${this.name} Rested > Tired`);
						sleep = CONFIG.FALLOUT.CONDITIONS.sleep.tired;
						lastChange += CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.sleep.tired:
					if (timeElapsed >= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Sleep] ${this.name} Tired > Weary`);
						sleep = CONFIG.FALLOUT.CONDITIONS.sleep.weary;
						if (!this.isSleeping) {
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.sleep.weary:
					if (timeElapsed >= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Sleep] ${this.name} Weary > Exhausted`);
						sleep = CONFIG.FALLOUT.CONDITIONS.sleep.exhausted;
						if (!this.isSleeping) {
							fallout.debug(
								`Condition Tracker: [Sleep] ${this.name} Fatigue ${fatigue} > ${fatigue + 1}`
							);
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.EIGHT_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				case CONFIG.FALLOUT.CONDITIONS.sleep.exhausted:
					if (timeElapsed >= CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS) {
						fallout.debug(`Condition Tracker: [Sleep] ${this.name} Exhausted`);
						if (!this.isSleeping) {
							fallout.debug(
								`Condition Tracker: [Sleep] ${this.name} Fatigue ${fatigue} > ${fatigue + 1}`
							);
							fatigue++;
						}
						lastChange += CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS;
						changed = true;
						timeElapsed -= CONFIG.FALLOUT.FOUR_HOURS_IN_SECONDS;
					}
					else {
						keepChecking = false;
					}
					break;
				default:
					keepChecking = false;
			}
		}

		if (changed) {
			await this.update({
				"system.conditions.lastChanged.sleep": lastChange,
				"system.conditions.sleep": sleep,
				"system.conditions.fatigue": fatigue,

			});
		}

		return changed;
	}

	async checkConditions(currentWorldTime) {
		await this._checkForConditionTimeJumps(currentWorldTime);

		let currentFatigue = this.system.conditions.fatigue;
		const hungerChanged = await this._updateHunger(currentWorldTime);
		const hungerFatigueChange = this.system.conditions.fatigue - currentFatigue;

		currentFatigue = this.system.conditions.fatigue;
		const thirstChanged = await this._updateThirst(currentWorldTime);
		const thirstFatigueChange = this.system.conditions.fatigue - currentFatigue;

		let sleepChanged = false;
		currentFatigue = this.system.conditions.fatigue;
		if (!this.isSleeping) {
			sleepChanged = await this._updateSleep(currentWorldTime);
		}
		const sleepFatigueChange = this.system.conditions.fatigue - currentFatigue;

		const fatigueChanged = hungerFatigueChange > 0 || thirstFatigueChange > 0;

		if (hungerChanged || thirstChanged || sleepChanged) {
			const chatData = {
				title: game.i18n.localize(
					"FALLOUT.CHAT_MESSAGE.condition-change.title"
				),
				body: game.i18n.format("FALLOUT.CHAT_MESSAGE.condition-change.body",
					{
						actorName: this.name,
						hungerLevel: CONFIG.FALLOUT.HUNGER_BY_NUMBER[this.system.conditions.hunger],
						thirstLevel: CONFIG.FALLOUT.THIRST_BY_NUMBER[this.system.conditions.thirst],
						sleepLevel: CONFIG.FALLOUT.SLEEP_BY_NUMBER[this.system.conditions.sleep],
					}
				),
				fatigue: this.system.conditions.fatigue,
				fatigueChanged,
				hungerFatigueChange,
				sleepFatigueChange,
				thirstFatigueChange,
			};

			fallout.chat.renderConditionChangeMessage(this, chatData);
		}
	}

	async _checkForConditionTimeJumps(currentWorldTime) {
		const updateData = {};
		for (const condition of ["hunger", "sleep", "thirst"]) {
			const wasTimeJump = fallout.utils.checkForTimeJump(
				this.system.conditions.lastChanged[condition]
			);

			if (wasTimeJump) {
				fallout.log(`Condition Tracker: ${this.name} max time jump exceeded for ${condition}, updating lastChange value`);
				const key = `system.conditions.lastChanged.${condition}`;
				updateData[key] = currentWorldTime;
			}
		}
		if (!foundry.utils.isEmpty(updateData)) {
			await this.updateSource(updateData);
		}
	}

	async consumeItem(item) {
		if (this.type !== "character") {
			return false;
		}

		if (item.system.quantity <= 0) {
			ui.notifications.warn(
				game.i18n.format(
					"FALLOUT.CHAT_MESSAGE.consumed.warn_none_available",
					{ itemName: item.name }
				)
			);

			return false;
		}

		let consumed = true;

		const consumableType = item.system.consumableType;

		const newQuantity = item.system.quantity - 1;

		const allUsed = newQuantity <= 0 ? true : false;

		const isFull = this.system.conditions.hunger === 0;

		if (consumableType === "food" && isFull) {
			ui.notifications.warn(
				game.i18n.localize("FALLOUT.CHAT_MESSAGE.consumed.food.warn_full")
			);

			return false;
		}

		const currentWorldTime = game.time.worldTime;

		const actorUpdateData = {};

		if (consumableType !== "other") {
			// Heal HP
			const hpHeal = item.system.hp ?? 0;

			if (hpHeal > 0) {
				let newHp = this.system.health.value + hpHeal;
				const cappedHp = Math.min(newHp, this.system.health.max);

				actorUpdateData["system.health.value"] = cappedHp;
			}

			// Heal Radiation
			const radiationHeal = item.system.radiation ?? 0;

			if (radiationHeal > 0) {
				let newRadiation = this.system.radiation - radiationHeal;
				const cappedRadiation = Math.max(newRadiation, 0);

				actorUpdateData["system.radiation"] = cappedRadiation;
			}

			if (consumableType === "beverage" && item.system.alcoholic) {

				let newIntoxication = this.system.conditions.intoxication + 1;
				actorUpdateData["system.conditions.intoxication"] = newIntoxication;

				// We don't need to roll for alcoholism if we are already an
				// alcoholic.
				//
				// Also, no need to roll a check unless we've had at least two
				// drinks this session, as that's the minimum possible dice that
				// can roll the required 2 effects.
				//
				if (!this.system.conditions.alcoholic && newIntoxication >= 2) {
					let formula = `${newIntoxication}dccs>=5`;
					let roll = new Roll(formula);

					let alcoholicRoll = await roll.evaluate();

					fallout.Roller2D20.showDiceSoNice(alcoholicRoll);

					if (parseInt(roll.result) >= 2) {
						actorUpdateData["system.conditions.alcoholic"] = true;
						actorUpdateData["system.conditions.intoxication"] = 1;

						fallout.chat.renderGeneralMessage(
							this,
							{
								title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.alcoholic.title"),
								body: game.i18n.format("FALLOUT.CHAT_MESSAGE.alcoholic.body",
									{
										actorName: this.name,
										itemName: item.name,
									}
								),
							},
							CONST.DICE_ROLL_MODES.PRIVATE
						);
					}
				}
			}

			if (consumableType !== "chem" && item.system.irradiated) {
				if (!(consumableType === "food" && isFull)) {
					const radDice = item.system.radiationDamage
						?? CONFIG.FALLOUT.DEFAULT_CONSUMABLE_RAD_DICE;

					let formula = `${radDice}dccs>=5`;
					let roll = new Roll(formula);

					let radiationDamageRoll = await roll.evaluate();

					fallout.Roller2D20.showDiceSoNice(radiationDamageRoll);

					const baseRadDamage = parseInt(roll.result);
					if (baseRadDamage > 0) {
						const radResistance = this.system.resistance?.radiation ?? 0;
						const radsTaken = Math.max(0, baseRadDamage - radResistance);

						const newRadiation = this.system.immunities.radiation
							? 0
							: this.system.radiation + radsTaken;

						if (newRadiation > 0) {
							actorUpdateData["system.radiation"] = newRadiation;

							fallout.chat.renderGeneralMessage(
								this,
								{
									title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.radiation_from_consumable.title"),
									body: game.i18n.format("FALLOUT.CHAT_MESSAGE.radiation_from_consumable.body",
										{
											actorName: this.name,
											itemName: item.name,
											radsTaken,
										}
									),
								},
								CONST.DICE_ROLL_MODES.PRIVATE
							);
						}
						else {
							fallout.chat.renderGeneralMessage(
								this,
								{
									title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.radiation_from_consumable_resisted.title"),
									body: game.i18n.format("FALLOUT.CHAT_MESSAGE.radiation_from_consumable_resisted.body",
										{
											actorName: this.name,
											baseRadDamage,
											itemName: item.name,
										}
									),
								},
								CONST.DICE_ROLL_MODES.PRIVATE
							);
						}
					}
				}
			}

			if (consumableType === "chem" && item.system.addictive) {
				const addictionName = item.system.consumableGroup !== ""
					? item.system.consumableGroup
					: item.name;

				const alreadyAddicted = await this.isAddictedToChem(addictionName);

				const chemId = item.name.slugify();
				const dosageKey = `system.chemDoses.${chemId}`;

				let scenes = item.system.duration === "lasting" ? 2 : 1;

				let newDosage = this.system.chemDoses[chemId]?.doses ?? 0;
				newDosage = alreadyAddicted ? 1 : newDosage + 1;

				const addictionNumberExceeded =
					newDosage >= item.system.addiction;

				if (addictionNumberExceeded && !alreadyAddicted) {
					let formula = `${newDosage}dccs>=5`;
					let roll = new Roll(formula);

					let addictedRoll = await roll.evaluate();

					fallout.Roller2D20.showDiceSoNice(addictedRoll);

					if (parseInt(roll.result) >= item.system.addiction) {
						newDosage = 1;

						// Automatically add Addiction item of the correct type
						// to the character
						//
						const addiction = (
							await fallout.compendiums.addictions()
						).find(
							a => a.name === addictionName
						);

						if (addiction) {
							this.createEmbeddedDocuments("Item", [addiction]);
						}
						else {
							fallout.warn(`Unable to fund addiction with the name ${addictionName}`);
						}

						fallout.chat.renderGeneralMessage(
							this,
							{
								title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.addiction.title"),
								body: game.i18n.format(
									"FALLOUT.CHAT_MESSAGE.addiction.body",
									{
										actorName: this.name,
										itemName: addictionName,
									}
								),
							},
							CONST.DICE_ROLL_MODES.PRIVATE
						);
					}
				}

				actorUpdateData[dosageKey] = {
					addiction: item.system.addiction,
					addictionName,
					doses: newDosage,
					id: chemId,
					name: item.name,
					scenes,
				};

			}
		}

		if (["beverage", "food"].includes(consumableType)) {
			if (!(consumableType === "food" && isFull)) {
				const currentThirst = parseInt(this.system.conditions.thirst) ?? 0;
				const thirstReduction = item.system.thirstReduction ?? 0;

				if (thirstReduction > 0) {
					actorUpdateData["system.conditions.lastChanged.thirst"] =
						currentWorldTime;
				}

				actorUpdateData["system.conditions.thirst"] =
					Math.max(currentThirst - thirstReduction, 0);

				if (item.system.providesCap) {
					actorUpdateData["system.currency.caps"] =
						this.system.currency.caps + 1;
				}
			}
		}

		if (consumableType === "food") {
			const currentHunger = parseInt(this.system.conditions.hunger) ?? 0;
			const hungerReduction = item.system.prepared ? 2 : 1;

			actorUpdateData["system.conditions.lastChanged.hunger"] =
				currentWorldTime;

			actorUpdateData["system.conditions.hunger"] =
				Math.max(currentHunger - hungerReduction, 0);
		}

		await this.update(actorUpdateData);

		if (consumed) {
			fallout.chat.renderConsumptionMessage(
				this,
				{
					title: game.i18n.localize(
						`FALLOUT.CHAT_MESSAGE.consumed.${consumableType}.title`
					),
					body: game.i18n.format("FALLOUT.CHAT_MESSAGE.consumed.body",
						{
							actorName: this.name,
							itemName: item.name,
						}
					),
					effect: item.system.effect,
					gainedCap: item.system.providesCap,
					showHungerAndThirst: ["beverage", "food"].includes(consumableType),
					hunger: this.system.conditions.hunger,
					thirst: this.system.conditions.thirst,
				}
			);

			if (allUsed && this.deleteExhaustedConsumables) {
				await item.delete();
			}
			else {
				await item.update({
					"system.quantity": Math.max(0, newQuantity),
				});
			}

			return allUsed;
		}
		else {
			return false;
		}
	}

	async drinkDirtyWater() {
		if (this.type !== "character") {
			return false;
		}

		const currentWorldTime = game.time.worldTime;

		const actorUpdateData = {};

		let newHp = this.system.health.value + 2;
		const cappedHp = Math.min(newHp, this.system.health.max);

		actorUpdateData["system.health.value"] = cappedHp;

		const currentThirst = parseInt(this.system.conditions.thirst) ?? 0;
		const thirstReduction = 1;

		actorUpdateData["system.conditions.lastChanged.thirst"] =
			currentWorldTime;

		actorUpdateData["system.conditions.thirst"] =
			Math.max(currentThirst - thirstReduction, 0);

		let formula = "1dccs>=5";
		let roll = new Roll(formula);

		let radiationDamageRoll = await roll.evaluate();

		fallout.Roller2D20.showDiceSoNice(radiationDamageRoll);

		const baseRadDamage = parseInt(roll.result);
		if (baseRadDamage > 0) {
			const radResistance = this.system.resistance?.radiation ?? 0;
			const radsTaken = Math.max(0, baseRadDamage - radResistance);

			const newRadiation = this.system.immunities.radiation
				? 0
				: this.system.radiation + radsTaken;

			if (newRadiation > 0) {
				actorUpdateData["system.radiation"] = newRadiation;

				fallout.chat.renderGeneralMessage(
					this,
					{
						title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.radiation_from_consumable.title"),
						body: game.i18n.format("FALLOUT.CHAT_MESSAGE.radiation_from_dirty_water.body",
							{
								actorName: this.name,
								radsTaken,
							}
						),
					},
					CONST.DICE_ROLL_MODES.PRIVATE
				);
			}
			else {
				fallout.chat.renderGeneralMessage(
					this,
					{
						title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.radiation_from_consumable_resisted.title"),
						body: game.i18n.format("FALLOUT.CHAT_MESSAGE.radiation_from_dirty_water_resisted.body",
							{
								actorName: this.name,
								baseRadDamage,
								itemName: item.name,
							}
						),
					},
					CONST.DICE_ROLL_MODES.PRIVATE
				);
			}
		}

		await this.update(actorUpdateData);

		fallout.chat.renderConsumptionMessage(
			this,
			{
				title: game.i18n.localize(
					"FALLOUT.CHAT_MESSAGE.consumed.beverage.title"
				),
				body: game.i18n.format("FALLOUT.CHAT_MESSAGE.consumed_dirty_water.body",
					{
						actorName: this.name,
					}
				),
				showHungerAndThirst: true,
				hunger: this.system.conditions.hunger,
				thirst: this.system.conditions.thirst,
			}
		);
	}

	async isAddictedToChem(addictionName) {
		const addiction = this.items.filter(
			i => i.type === "addiction"
		).find(
			i => i.name === addictionName
		);

		return addiction ? true : false;
	}


	async readMagazine(item) {
		if (!this.isPlayerCharacter) {
			return;
		}

		const compendiumVersion =
			(await fallout.compendiums.books_and_magz(false)).find(
				i => i.name.slugify() === item.name.slugify()
			);

		if (!compendiumVersion) {
			return ui.notifications.error(
				game.i18n.format(
					"FALLOUT.ERRORS.UnableToFindCompendiumVersionOfItem",
					{
						itemType: item.type,
						name: item.name,
					}
				)
			);
		}

		if (item.system.uses.value >= item.system.uses.max) {
			return ui.notifications.warn(
				game.i18n.localize("FALLOUT.ERRORS.MagazineUsedMaximumTimes")
			);
		}

		const itemUpdate = {
			"system.uses.value": item.system.uses.value + 1,
			"system.read": true,
		};

		// Roll to see if this benefit can be used one extra time if the
		// character has the Comprehension perk
		//
		const comprehensionLevel = this.perkLevel("comprehension");
		let comprehensionSuccess = false;
		if (comprehensionLevel > 0
			&& item.system.uses.max < CONFIG.FALLOUT.DEFAULT_MAX_MAGAZINE_USES
		) {
			const comprehensionDice = CONFIG.FALLOUT.DEFAULT_COMPREHENSION_DICE;

			let formula = `${comprehensionDice}dccs>=5`;
			let roll = new Roll(formula);

			let comprehensionRoll = await roll.evaluate();

			fallout.Roller2D20.showDiceSoNice(comprehensionRoll);

			const result = parseInt(roll.result);
			if (result > 0) {
				comprehensionSuccess = true;
				itemUpdate["system.uses.max"] = item.system.uses.max + 1;
			}
		}

		item.update(itemUpdate);

		const readMagazines = this.system.readMagazines ?? [];

		if (!readMagazines.includes(compendiumVersion.uuid)) {
			readMagazines.push(compendiumVersion.uuid);
		}

		fallout.chat.renderReadMagazineMessage(
			this,
			{
				title: game.i18n.localize(
					"FALLOUT.CHAT_MESSAGE.readMagazine.title"
				),
				body: game.i18n.format("FALLOUT.CHAT_MESSAGE.readMagazine.body",
					{
						actorName: this.name,
						itemName: item.name,
					}
				),
				benefit: item.system.effect,
				comprehensionSuccess,
			}
		);

		this.update({"system.readMagazines": readMagazines});
	}

	// Reduce Ammo
	async reduceAmmo(ammoName = "", roundsToUse = 0) {
		const [ammoItems, shotsAvailable] = this._getAvailableAmmoType(ammoName);

		if (shotsAvailable <= 0) {
			return;
		}

		for (const ammoItem of ammoItems) {
			if (roundsToUse === 0) {
				break;
			}

			const currentShots = ammoItem.system.shots.current;
			const currentCharges = ammoItem.system.charges.current;
			const quantity = ammoItem.system.quantity;

			const max = ammoItem.system.shots.max > 0
				? ammoItem.system.shots.max
				: 1;

			const shotsAvailable = ((quantity - 1) * max) + currentShots;

			let newCurrentShots = currentShots;
			let newCurrentCharges = currentCharges;
			let newQuantity = ammoItem.system.quantity;

			if (roundsToUse >= shotsAvailable) {
				roundsToUse -= shotsAvailable;

				this.deleteEmbeddedDocuments("Item", [ammoItem._id]);
				continue;
			}
			else {
				newCurrentShots -= roundsToUse;

				if (newCurrentShots <= 0) {
					const overflow = Math.abs(newCurrentShots);
					const usedQuantity = Math.floor(overflow / max) + 1;

					newQuantity -= usedQuantity;
					newCurrentShots = max - (overflow % max);

					if (ammoItem.system.fusionCore) {
						newCurrentCharges = Math.min(
							ammoItem.system.charges.max,
							Math.ceil(newCurrentShots / 50)
						);
					}
				}

				roundsToUse = 0;
			}

			await this.updateEmbeddedDocuments("Item", [{
				"_id": ammoItem._id,
				"system.charges.current": newCurrentCharges,
				"system.shots.current": newCurrentShots,
				"system.quantity": newQuantity,
			}]);
		}
	}

	async updateAddictions() {
		const updateData = {};

		if (this.isAlcoholic) {
			updateData["system.conditions.intoxication"] = 0;
		}

		for (const doseKey in this.system.chemDoses) {
			const dose = this.system.chemDoses[doseKey];

			const isAddicted = await this.isAddictedToChem(
				dose.addictionName
			);

			const scenesRemaining = dose.scenes - 1;

			if (isAddicted) {
				if (scenesRemaining <= 0) {
					updateData[`system.chemDoses.-=${doseKey}`] = null;
				}
				else {
					dose.scenes = scenesRemaining;
					updateData[`system.chemDoses.${doseKey}`] = dose;
				}
			}
			else {
				updateData[`system.chemDoses.${doseKey}`] = dose;
			}
		}

		this.update(updateData);
	}

	async resetChemDoses() {
		const updateData = {};

		for (const chemId in this.system.chemDoses) {
			updateData[`system.chemDoses.-=${chemId}`] = null;
		}

		this.update(updateData);
	}

	async rollAvailabilityCheck() {
		const luckDice = this.system.attributes?.luc?.value ?? 1;

		const formula = `${luckDice}dccs>=5`;
		let roll = new Roll(formula);

		let availabilityRoll = await roll.evaluate();

		fallout.Roller2D20.showDiceSoNice(availabilityRoll);

		const rarity = parseInt(roll.result);

		fallout.chat.renderGeneralMessage(
			this,
			{
				title: game.i18n.localize("FALLOUT.AvailabilityRoll.result.title"),
				body: game.i18n.format("FALLOUT.AvailabilityRoll.result.body", { rarity }),
			},
			CONST.DICE_ROLL_MODES.PRIVATE
		);
	}

	async sleep(hours, safe, hasActiveFatigue) {
		const currentSleepStatus = this.system.conditions?.sleep ?? 0;

		if (hasActiveFatigue) {
			fallout.debug(
				`Party Sleep: Actor ${this.name} has currently active fatigue sources`
			);
		}

		let currentFatigue = this.system.conditions?.fatigue ?? 0;
		let newFatigue = currentFatigue;

		let newSleepStatus = currentSleepStatus;
		let newWellRested = false;

		if (hours >= 8 && safe) {
			newWellRested = true;
		}

		if (hours >= 6) {
			newSleepStatus = CONFIG.FALLOUT.CONDITIONS.sleep.rested;

			// If there are active fatigue states we don't reset fatgue to zero
			newFatigue = hasActiveFatigue ? currentFatigue : 0;
		}
		else if (hours >= 1) {
			if (newSleepStatus > 0) {
				newSleepStatus--;
			}
		}

		const updateData = {
			"system.conditions.fatigue": newFatigue,
			"system.conditions.lastChanged.sleep": game.time.worldTime,
			"system.conditions.sleep": newSleepStatus,
			"system.conditions.wellRested": newWellRested,
		};

		await this.updateAddictions();

		if (newWellRested && this.isNotWellRested) {
			updateData["system.health.value"] = this.system.health.value + 2;
		}

		await this.update(updateData);
	}
}
