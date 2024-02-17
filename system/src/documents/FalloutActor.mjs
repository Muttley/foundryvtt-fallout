/**
 * Extend the base Actor document by defining a custom roll data structure which
 * is ideal for the Simple system.
 * @extends {Actor}
 */

export default class FalloutActor extends Actor {

	/**
	 * Update any settlement sheets that may be linked to the deleted Actor
	 *
	 * @static
	 * @param {*} actor
	 * @param {*} options
	 * @param {*} userId
	 */
	static async updateLinkedSettlementSheets(actor, options, userId) {
		if (!game.user.isGM) return;
		if (actor.type !== "npc") return;

		const settlementUuid = actor.system.settlement.uuid;

		if (settlementUuid === "") return;

		const settlement = await fromUuid(settlementUuid);
		if (settlement) {
			if (settlement.system.leader === actor.uuid) {
				await settlement.update({"system.leader": ""});
				settlement.sheet.render(false);
			}
		}
	}


	get isNotRobot() {
		return !this.isRobot;
	}


	get isRobot() {
		return this.type === "robot";
	}

	get useKgs() {
		return game.settings.get("fallout", "carryUnit") === "kgs";
	}

	/** @override */
	prepareData() {
		super.prepareData();
	}

	/** @override */
	// prepareBaseData() {
	// Data modifications in this step occur before processing embedded
	// documents or derived data.
	// }

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

		if (this.type === "character" || this.type === "robot") {
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

		// ADD UNOFFICIAL SPEED
		try {
			const athletics = this.items.find(
				i => i.name.toLowerCase() === "athletics" && i.type==="skill"
			);

			const athleticsValue = athletics !== undefined
				? athletics.system.value
				: 0;

			this.system.unofficalSpeed = this.system.attributes.agi.value + athleticsValue;
		}
		catch(er) {

		}
	}

	/**
   * Prepare Character type specific data
   */

	// CHARACTER
	_prepareCharacterData() {
		if (!["character"].includes(this.type)) return;

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
			game.system.model.Actor.character.body_parts
		)) {
			outfittedLocations[k] = false;
		}

		// ! CHECK POWER ARMOR PIECES
		for (let [k, v] of Object.entries(outfittedLocations)) {
			if (!v) {
				let pow = this.items.find(
					i => i.type === "apparel"
						&& i.system.appareltype === "powerArmor"
						&& i.system.equipped
						&& i.system.powered
						&& i.system.location[k] === true
				);
				if (pow && !outfittedLocations[k]) {
					outfittedLocations[k] = duplicate(pow.toObject());
				}
			}
		}

		// ! CHECK ARMOR PIECES
		for (let [k, v] of Object.entries(outfittedLocations)) {
			if (!v) {
				let armor = this.items.find(
					i =>
						i.type === "apparel"
                && i.system.appareltype === "armor"
                && i.system.equipped
                && i.system.location[k] === true
				);
				if (armor && !outfittedLocations[k]) {
					outfittedLocations[k] = duplicate(armor.toObject());
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
              && i.system.appareltype === "outfit"
              && i.system.equipped
			);
			if (outfit) {
				for (let [k, v] of Object.entries(outfit.system.location)) {
					if (v) {
						outfittedLocations[k] = duplicate(outfit.toObject());
					}
				}
			}
		}

		// ! CHECK HEADGEAR
		if (!outfittedLocations.head) {
			let headgear = this.items.find(i => i.type === "apparel"
				&& i.system.appareltype === "headgear"
				&& i.system.equipped
			);

			if (headgear) {
				outfittedLocations.head = duplicate(headgear.toObject());
			}
		}

		// ! ADD CLOTHING VALUES
		let clothing = this.items.find(
			i =>
				i.type === "apparel"
            && i.system.appareltype === "clothing"
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
					outfittedLocations[k] = duplicate(clothing.toObject());
				}
			}
		}

		// ! SET BODY PARTS TO OUTFIT ADD CHARACTER BONUSES
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
		const currentLevel = parseInt(this.system.level.value);

		let nextLevelXp = 0;
		if (currentLevel > 0) {
			const nextLevel = currentLevel + 1;

			nextLevelXp = nextLevel * currentLevel / 2 * 100;
		}

		this.system.level.nextLevelXP = nextLevelXp;
	}

	_prepareRobotData() {
		if (this.type !== "robot") return;

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
		if (this.type !== "settlement") return;

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
			if (this.system[attribute].value < people) happiness--;
		}

		this.system.happiness.value = happiness;
		this.system.happiness.total = this.system.happiness.value + this.system.happiness.mod;

		if (this.system.happiness.total < 1) this.system.happiness.total = 1;
		if (this.system.happiness.total > 20) this.system.happiness.total = 20;

		this.system.storage.total = this._getItemsTotalWeight();
	}

	_calculateRobotBodyResistance() {
		let outfittedLocations = {};
		for (let [k] of Object.entries(
			game.system.model.Actor.robot.body_parts
		)) {
			outfittedLocations[k] = false;
		}

		// ADD ROBOT ARMOR
		for (let [k, v] of Object.entries(outfittedLocations)) {
			if (!v) {
				let armor = this.items.find(i => i.type === "robot_armor"
					&& i.system.appareltype === "armor"
					&& i.system.equipped
					&& i.system.location[k] === true
				);

				if (armor && !outfittedLocations[k]) {
					outfittedLocations[k] = duplicate(armor.toObject());
				}
			}
		}
		// ADD PLATING AND RESISTANCE BONUSES
		let plating = this.items.find(i => i.type === "robot_armor"
            && i.system.appareltype === "plating"
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
					outfittedLocations[k] = duplicate(plating.toObject());
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

	async _getAvailableAmmoType(name) {
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
				if (i.system.appareltype === "powerArmor") {
					return !i.system.powered;
				}
				else {
					return true;
				}
			});
		}

		let physicalItemsMap = physicalItems.map(i => i.toObject());

		let totalWeight = 0;

		for (let i of physicalItemsMap) {
			totalWeight += parseFloat(i.system.weight) * parseFloat(i.system.quantity);
		}

		let materialWeight = 0;
		for (const material of ["common", "uncommon", "rare"]) {
			materialWeight += this.system.materials[material] ?? 0;
		}
		materialWeight += (this.system.materials.junk * 2);

		if (this.useKgs) {
			materialWeight = fallout.utils.lbsToKgs(materialWeight);
		}

		totalWeight += materialWeight;

		return parseFloat(totalWeight.toFixed(2));
	}

	/**
   * Prepare NPC type specific data.
   */
	_prepareNpcData() {
		if (!["creature", "npc"].includes(this.type)) return;

		// Make modifications to data here. For example:
		this.system.xp = this.system.cr * this.system.cr * 100;

		this.system.carryWeight.total = this._getItemsTotalWeight();
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
	_getNpcRollData(data) {}

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (!data.img) {
			const img = CONFIG.FALLOUT.DEFAULT_TOKENS[data.type] ?? undefined;

			if (img) {
				this.updateSource({
					img,
					prototypeToken: {
						texture: {
							src: img,
						},
					},
				});
			}
		}

		// Add Skills to Characters and Robots
		if (this.type === "character" || this.type === "robot") {
			// If the Actor data already contains skill items then this is an
			// Actor being duplicated and we don't want to touch their
			// items at all
			//
			const alreadyHasSkills = Array.isArray(data.items)
				&& data.items.filter(i => i.type === "skill").length > 0;

			if (!alreadyHasSkills) {
				let skillsCompendium = game.settings.get(
					"fallout", "skillsCompendium"
				);

				if (!skillsCompendium) skillsCompendium = "fallout.skills";

				let packSkills =
					await game.packs.get(skillsCompendium).getDocuments();

				const items = this.items.map(i => i.toObject());

				packSkills.forEach(s => {
					items.push(s.toObject());
				});

				this.updateSource({ items });
			}
		}
	}

	async consumeItem(item) {
		if (this.type !== "character") return false;

		const consumableType = item.system.consumableType;

		const newQuantity = item.system.quantity - 1;

		const allUsed = newQuantity <= 0 ? true : false;

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

					let alcoholicRoll = await roll.evaluate({ async: true });
					try {
						game.dice3d.showForRoll(alcoholicRoll);
					}
					catch(err) {}

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
				let formula = "1dccs>=5";
				let roll = new Roll(formula);

				let radiationDamageRoll = await roll.evaluate({ async: true });
				try {
					game.dice3d.showForRoll(radiationDamageRoll);
				}
				catch(err) {}

				if (parseInt(roll.result) > 0) {
					let newRadiation = this.system.radiation + 1;
					actorUpdateData["system.radiation"] = newRadiation;

					fallout.chat.renderGeneralMessage(
						this,
						{
							title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.radiation_from_consumable.title"),
							body: game.i18n.format("FALLOUT.CHAT_MESSAGE.radiation_from_consumable.body",
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

			if (consumableType === "chem" && item.system.addictive) {
				const alreadyAddicted = await this.isAddictedToChem(item);

				const chemId = item.name.slugify();
				const dosageKey = `system.chemDoses.${chemId}`;

				let	newDosage = this.system.chemDoses[chemId]?.doses ?? 0;
				newDosage++;

				const addictionNumberExceeded =
					newDosage >= item.system.addiction;

				if (addictionNumberExceeded && !alreadyAddicted) {
					let formula = `${newDosage}dccs>=5`;
					let roll = new Roll(formula);

					let addictedRoll = await roll.evaluate({ async: true });
					try {
						game.dice3d.showForRoll(addictedRoll);
					}
					catch(err) {}

					if (parseInt(roll.result) >= item.system.addiction) {

						const addictionName = item.system.consumableGroup !== ""
							? item.system.consumableGroup
							: item.name;

						fallout.chat.renderGeneralMessage(
							this,
							{
								title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.addiction.title"),
								body: game.i18n.format("FALLOUT.CHAT_MESSAGE.addiction.body",
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
					doses: newDosage,
					id: chemId,
					name: item.name,
				};

			}
		}

		if (consumableType === "beverage") {
			const currentThirst = parseInt(this.system.conditions.thirst) ?? 0;
			const thirstReduction = item.system.thirstReduction ?? 1;

			actorUpdateData["system.conditions.thirst"] =
				 Math.max(currentThirst - thirstReduction, 0);
		}

		if (consumableType === "food") {
			const currentHunger = parseInt(this.system.conditions.hunger) ?? 0;
			const hungerReduction = item.system.prepared ? 2 : 1;

			actorUpdateData["system.conditions.hunger"] =
				 Math.max(currentHunger - hungerReduction, 0);
		}

		await this.update(actorUpdateData);

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
				consumableType,
				hunger: this.system.conditions.hunger,
				thirst: this.system.conditions.thirst,
			}
		);

		if (allUsed) {
			await item.delete();
		}
		else {
			await item.update({
				"system.quantity": newQuantity,
			});
		}

		return allUsed;
	}

	async isAddictedToChem(item) {
		const chemName = item.system.consumableGroup !== ""
			? item.system.consumableGroup
			: item.name;

		const addiction = this.items.filter(
			i => i.type === "addiction"
		).find(
			i => i.name === chemName
		);

		return addiction ? true : false;
	}

	// Reduce Ammo
	async reduceAmmo(ammoName="", roundsToUse=0) {
		const [ammoItems, shotsAvailable] = await this._getAvailableAmmoType(ammoName);

		if (shotsAvailable <= 0) return;

		for (const ammoItem of ammoItems) {
			if (roundsToUse === 0) break;

			const current = ammoItem.system.shots.current;
			const quantity = ammoItem.system.quantity;

			const max = ammoItem.system.shots.max > 0
				? ammoItem.system.shots.max
				: 1;

			const quantityShots = ((quantity - 1) * max) + current;

			let newCurrent = current;
			let newQuantity = ammoItem.system.quantity;

			if (roundsToUse >= quantityShots) {
				roundsToUse -= quantityShots;

				this.deleteEmbeddedDocuments("Item", [ammoItem._id]);
				continue;
			}
			else {
				newCurrent -= roundsToUse;

				if (newCurrent <= 0) {
					const overflow = Math.abs(newCurrent);
					const usedQuantity = Math.floor(overflow / max) + 1;

					newQuantity -= usedQuantity;
					newCurrent = max - (overflow % max);
				}

				roundsToUse = 0;
			}

			await this.updateEmbeddedDocuments("Item", [{
				"_id": ammoItem._id,
				"system.shots.current": newCurrent,
				"system.quantity": newQuantity,
			}]);
		}
	}

	async resetChemDoses() {
		const updateData = {};

		for (const chemId in this.system.chemDoses) {
			updateData[`system.chemDoses.-=${chemId}`] = null;
		}

		this.update(updateData);
	}
}
