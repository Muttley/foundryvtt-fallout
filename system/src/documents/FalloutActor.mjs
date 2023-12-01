/**
 * Extend the base Actor document by defining a custom roll data structure which
 * is ideal for the Simple system.
 * @extends {Actor}
 */
export default class FalloutActor extends Actor {
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
			this._calculateMaxHp();
			this._calculateInitiative();
			this._calculateDefense();
			this._calculateNextLevelXp();
		}

		this._prepareCharacterData();
		this._prepareRobotData();
		this._prepareNpcData();

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
		if (this.type !== "character") return;
		this._calculateCharacterBodyResistance();
		this._calculateEncumbrance();
	}

	_calculateEncumbrance() {
		let strWeight = parseInt(this.system.attributes.str.value);
		switch (game.settings.get("fallout", "carryUnit")) {
			case "lbs":
				strWeight *= 10;
				break;
			case "kgs":
				strWeight *= 5;
				break;
			default:
		}

		this.system.carryWeight.base += strWeight + parseInt(
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
		let outfitedLocations = {};
		for (let [k] of Object.entries(
			game.system.model.Actor.character.body_parts
		)) {
			outfitedLocations[k] = false;
		}

		// ! CHECK POWER ARMOR PIECES
		// let hasPowerArmor = false;
		for (let [k, v] of Object.entries(outfitedLocations)) {
			if (!v) {
				let pow = this.items.find(
					i => i.type === "apparel"
						&& i.system.appareltype === "powerArmor"
						&& i.system.equipped
						&& i.system.powered
						&& i.system.location[k] === true
				);
				if (pow && !outfitedLocations[k]) {
					outfitedLocations[k] = duplicate(pow.toObject());
					// hasPowerArmor = false;
				}
			}
		}

		// ! CHECK ARMOR PIECES
		// let hasArmor = false;
		for (let [k, v] of Object.entries(outfitedLocations)) {
			if (!v) {
				let armor = this.items.find(
					i =>
						i.type === "apparel"
                && i.system.appareltype === "armor"
                && i.system.equipped
                && i.system.location[k] === true
				);
				if (armor && !outfitedLocations[k]) {
					outfitedLocations[k] = duplicate(armor.toObject());
					// hasArmor = true;
				}
			}
		}

		// ! CHECK OUTFIT
		if (!outfitedLocations.torso
			&& !outfitedLocations.armR
			&& !outfitedLocations.armL
			&& !outfitedLocations.legL
			&& !outfitedLocations.legR
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
						outfitedLocations[k] = duplicate(outfit.toObject());
					}
				}
			}
		}

		// ! CHECK HEADGEAR
		if (!outfitedLocations.head) {
			let headgear = this.items.find(i => i.type === "apparel"
				&& i.system.appareltype === "headgear"
				&& i.system.equipped
			);

			if (headgear) {
				outfitedLocations.head = duplicate(headgear.toObject());
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
				if (outfitedLocations[k] && v) {
					outfitedLocations[k].name += ` over ${clothing.name}`;
					outfitedLocations[k].system.resistance.physical = Math.max(
						parseInt(outfitedLocations[k].system.resistance.physical),
						parseInt(clothing.system.resistance.physical)
					);
					outfitedLocations[k].system.resistance.energy = Math.max(
						parseInt(outfitedLocations[k].system.resistance.energy),
						parseInt(clothing.system.resistance.energy)
					);
					outfitedLocations[k].system.resistance.radiation = Math.max(
						parseInt(outfitedLocations[k].system.resistance.radiation),
						parseInt(clothing.system.resistance.radiation)
					);
				}
				else if (!outfitedLocations[k] && v) {
					outfitedLocations[k] = duplicate(clothing.toObject());
				}
			}
		}

		// ! SET BODY PARTS TO OUTFIT ADD CHARACTER BONUSES
		for (let [k, bodyPart] of Object.entries(this.system.body_parts)) {
			if (outfitedLocations[k]) {
				bodyPart.resistance.physical =
            parseInt(outfitedLocations[k].system.resistance.physical)
            + parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy =
            parseInt(outfitedLocations[k].system.resistance.energy)
            + parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation =
            parseInt(outfitedLocations[k].system.resistance.radiation)
            + parseInt(this.system.resistance.radiation);
			}
			else {
				bodyPart.resistance.physical = parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy = parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation = parseInt(this.system.resistance.radiation);
			}
		}
		// ADD OUTFITED LIST FOR DISPLAY
		this.system.outfitedLocations = outfitedLocations;
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
			let dif = this.system.carryWeight.total - this.system.carryWeight.value;
			this.system.encumbranceLevel = Math.ceil(dif / 50);
		}
	}

	_calculateRobotBodyResistance() {
		let outfitedLocations = {};
		for (let [k] of Object.entries(
			game.system.model.Actor.robot.body_parts
		)) {
			outfitedLocations[k] = false;
		}

		// ADD ROBOT ARMOR
		for (let [k, v] of Object.entries(outfitedLocations)) {
			if (!v) {
				let armor = this.items.find(i => i.type === "robot_armor"
					&& i.system.appareltype === "armor"
					&& i.system.equipped
					&& i.system.location[k] === true
				);

				if (armor && !outfitedLocations[k]) {
					outfitedLocations[k] = duplicate(armor.toObject());
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
				if (outfitedLocations[k] && v) {
					outfitedLocations[k].name += ` over ${plating.name}`;
					outfitedLocations[k].system.resistance.physical =
              parseInt(outfitedLocations[k].system.resistance.physical)
              + parseInt(plating.system.resistance.physical);
					outfitedLocations[k].system.resistance.energy =
              parseInt(outfitedLocations[k].system.resistance.energy)
              + parseInt(plating.system.resistance.energy);
					outfitedLocations[k].system.resistance.radiation =
              parseInt(outfitedLocations[k].system.resistance.radiation)
              + parseInt(plating.system.resistance.radiation);
				}
				else if (!outfitedLocations[k] && v) {
					outfitedLocations[k] = duplicate(plating.toObject());
				}
			}
		}

		// ! SET BODY PARTS TO OUTFIT AND ADD CHARACTER BONUSES
		for (let [k, bodyPart] of Object.entries(this.system.body_parts)) {
			if (outfitedLocations[k]) {
				bodyPart.resistance.physical =
            parseInt(outfitedLocations[k].system.resistance.physical)
            + parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy =
            parseInt(outfitedLocations[k].system.resistance.energy)
            + parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation =
            parseInt(outfitedLocations[k].system.resistance.radiation)
            + parseInt(this.system.resistance.radiation);
			}
			else {
				bodyPart.resistance.physical = parseInt(this.system.resistance.physical);
				bodyPart.resistance.energy = parseInt(this.system.resistance.energy);
				bodyPart.resistance.radiation = parseInt(this.system.resistance.radiation);
			}
		}
		// ADD OUTFITED LIST FOR DISPLAY
		this.system.outfitedLocations = outfitedLocations;
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
		return parseFloat(totalWeight.toFixed(2));
	}

	/**
   * Prepare NPC type specific data.
   */
	_prepareNpcData() {
		if (this.type !== "npc") return;

		// Make modifications to data here. For example:
		this.system.xp = this.system.cr * this.system.cr * 100;
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

	// Reduce Ammo
	async reduceAmmo(ammo = "", ammount = 0) {
		const _ammo = this.items.find(i => i.name === ammo);
		if (_ammo) {
			const newQ = Math.max(0, parseInt(_ammo.system.quantity) - parseInt(ammount));
			await this.updateEmbeddedDocuments("Item", [{"_id": _ammo._id, "system.quantity": newQ}]);
		}
	}
}
