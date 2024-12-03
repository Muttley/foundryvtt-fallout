import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

export default class FalloutVehicleSheet extends FalloutBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "vehicle"],
			width: 700,
			height: 710,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: this.initialTab,
				},
			],
		});
	}


	/** @override */
	get initialTab() {
		return "abilities";
	}


	/** @override */
	get inventorySections() {
		return [
			"weapon",
			"ammo",
		];
	}


	/** @override */
	get template() {
		return "systems/fallout/templates/actor/vehicle-sheet.hbs";
	}


	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action='roll-vehicle-cover']").click(
			async event => this._onVehicleCoverRoll(event)
		);

		html.find("[data-action='roll-vehicle-impact']").click(
			async event => this._onVehicleImpactRoll(event)
		);

		html.find("[data-action='roll-vehicle-weapon-attack']").click(
			async event => this._onVehicleWeaponRoll(event)
		);

	}


	async getData(options) {
		const context = await super.getData(options);

		const bodyPartData = this.actor.system.body_parts;

		context.bodyParts = [];

		let bodyType = "vehicle";
		let valueConfig = {};

		switch (this.actor.system.bodyType) {
			case "apc":
				valueConfig = CONFIG.FALLOUT.VEHICLE_APC_VALUES;
				break;
			case "armored":
				valueConfig = CONFIG.FALLOUT.VEHICLE_ARMORED_VALUES;
				break;
			case "bus":
				valueConfig = CONFIG.FALLOUT.VEHICLE_BUS_VALUES;
				break;
			case "carTruck":
				valueConfig = CONFIG.FALLOUT.VEHICLE_CARTRUCK_VALUES;
				break;
			case "motorcycle":
				valueConfig = CONFIG.FALLOUT.VEHICLE_MOTORCYCLE_VALUES;
				break;
			case "sportsCar":
				valueConfig = CONFIG.FALLOUT.VEHICLE_SPORTSCAR_VALUES;
				break;
			case "vertibird":
				valueConfig = CONFIG.FALLOUT.VEHICLE_VERTIBIRD_VALUES;
				break;
			default:
				valueConfig = CONFIG.FALLOUT.VEHICLE_CARTRUCK_VALUES;
		}


		for (const part in valueConfig) {
			const name = game.i18n.localize(
				`FALLOUT.BodyTypes.${bodyType}.${part}`
			);
			context.bodyParts.push({
				name: name,
				roll: valueConfig[part],
				basePath: `system.body_parts.${part}`,
				resistanceValues: bodyPartData[part].resistance,
				injuryOpenCount: bodyPartData[part].injuryOpenCount ?? 0,
				injuryTreatedCount: bodyPartData[part].injuryTreatedCount ?? 0,
			});
		}

		await this._getVehicleQualities(context, this.actor);


		context.settlements = [];

		const settlements = game.actors.filter(a => a.type === "settlement");
		settlements.sort((a, b) => a.name.localeCompare(b.name));

		for (const settlement of settlements) {
			context.settlements.push({
				uuid: settlement.uuid,
				name: settlement.name,
			});
		}

		// ADD FAVOURITE ITEMS
		context.favoriteWeapons = context.itemsByType.weapon.filter(
			i => i.system.favorite
		);

		return context;
	}


	async _updateObject(event, formData) {
		for (const resistanceType of ["energy", "physical"]) {
			const key = `_all_${resistanceType}`;
			const val = formData[key] ?? null;

			if (val !== null && val >= 0) {
				// Update all locations
				for (const bodyPart in this.actor.system.body_parts) {
					const bodyPartKey = `system.body_parts.${bodyPart}.resistance.${resistanceType}`;
					formData[bodyPartKey] = val;
				}
			}

			delete formData[key];
		}

		return super._updateObject(event, formData);

	}


	async _getVehicleQualities(context, actor) {
		const vehicleQualities = [];
		for (const key in CONFIG.FALLOUT.VEHICLE_QUALITIES) {
			vehicleQualities.push({
				active: actor.system?.vehicleQuality[key].value ?? false,
				hasRank: CONFIG.FALLOUT.VEHICLE_QUALITY_HAS_RANK[key],
				rank: actor.system?.vehicleQuality[key].rank,
				key,
				label: CONFIG.FALLOUT.VEHICLE_QUALITIES[key],
			});
		}

		context.vehicleQualities = vehicleQualities.sort(
			(a, b) => a.label.localeCompare(b.label)
		);
	}


	async _onVehicleCoverRoll(event) {
		const numOfDice = this.actor.system.cover.value;

		let rollName = `${game.i18n.localize("TYPES.Actor.vehicle")} ${game.i18n.localize("FALLOUT.VEHICLE.cover")}`;

		let actorUUID;
		let _token = this.actor.token;
		if (_token) actorUUID = this.actor.token.uuid;
		else actorUUID = this.actor.uuid;

		// console.warn(fromUuidSync(actorUUID).actor)

		fallout.DialogD6.createDialog({
			rollName: rollName,
			diceNum: numOfDice,
			actor: actorUUID,
		});
	}


	async _onVehicleImpactRoll(event) {
		const numOfDice = this.actor.system.impact.value;

		let rollName = `${game.i18n.localize("TYPES.Actor.vehicle")} ${game.i18n.localize("FALLOUT.VEHICLE.impact")}`;

		let actorUUID;
		let _token = this.actor.token;
		if (_token) actorUUID = this.actor.token.uuid;
		else actorUUID = this.actor.uuid;

		// console.warn(fromUuidSync(actorUUID).actor)

		fallout.DialogD6.createDialog({
			rollName: rollName,
			diceNum: numOfDice,
			actor: actorUUID,
		});
	}


	async _onVehicleWeaponRoll(event) {
		const li = $(event.currentTarget).parents(".item");
		const item = this.actor.items.get(li.data("item-id"));

		if (item.isWeaponBroken) {
			return ui.notifications.warn(
				game.i18n.localize("FALLOUT.ERRORS.ThisWeaponIsBroken")
			);
		}

		let attribute;
		let rollName = item.name;
		let skill;

		let actor = await fallout.utils.getActorForUser();

		if (!actor || actor.type === "vehicle") {
			return ui.notifications.warn(
				game.i18n.localize("FALLOUT.ERRORS.NoUsableCharacterFound")
			);
		}

		if (actor.type === "creature") {
			const creatureAttribute = item.system.creatureAttribute ?? "";
			const creatureSkill = item.system.creatureSkill ?? "";

			if (creatureSkill === "" || creatureAttribute === "") {
				return ui.notifications.warn(
					game.i18n.localize("FALLOUT.ERRORS.WeaponHasMissingCreatureConfiguration")
				);
			}

			attribute = actor.system[creatureAttribute];

			skill = actor.system[creatureSkill];
			skill.tag = true;
		}
		else {
			const skillName = item.system.weaponType === "custom"
				? item.system.skill ?? ""
				: CONFIG.FALLOUT.WEAPON_SKILLS[item.system.weaponType];

			const customAttribute = item.system.weaponType === "custom"
				? item.system.attribute ?? ""
				: false;

			if (skillName === "") {
				return ui.notifications.error(
					game.i18n.localize("FALLOUT.ERRORS.UnableToDetermineWeaponSkill")
				);
			}

			const skillItem = actor.items.find(i => i.name === skillName);

			if (skillItem) {
				skill = skillItem.system;
			}
			else {
				skill = { value: 0, tag: false, defaultAttribute: "str" };
			}

			const attributeOverride = CONFIG.FALLOUT.WEAPON_ATTRIBUTE_OVERRIDE[
				item.system.weaponType
			];

			if (customAttribute) {
				attribute = actor.system.attributes[customAttribute];
			}
			else if (attributeOverride) {
				attribute = actor.system.attributes[attributeOverride];
			}
			else {
				attribute = actor.system.attributes[skill.defaultAttribute];
			}

			if (!attribute) {
				attribute = { value: 0 };
			}
		}

		// REDUCE AMMO
		const autoCalculateAmmo = game.settings.get(
			"fallout", "automaticAmmunitionCalculation"
		);

		const actorCanUseAmmo =
			["character", "robot", "vehicle"].includes(this.actor.type);

		const ammoPopulated = item.system.ammo !== "";

		if (autoCalculateAmmo && actorCanUseAmmo && ammoPopulated) {
			const [ammo, shotsAvailable] = this.actor._getAvailableAmmoType(
				item.system.ammo
			);

			if (!ammo) {
				ui.notifications.warn(`Ammo ${item.system.ammo} not found`);
				return;
			}

			if (shotsAvailable < item.system.ammoPerShot) {
				ui.notifications.warn(`Not enough ${item.system.ammo} ammo`);
				return;
			}
		}

		// Check for unreliable weapon quality
		let complication = parseInt(this.actor.system.complication);
		if (item.system.damage.weaponQuality.unreliable.value) {
			complication -= 1;
		}

		fallout.Dialog2d20.createDialog({
			rollName: rollName,
			diceNum: 2,
			attribute: attribute.value,
			skill: skill.value,
			tag: skill.tag,
			complication: complication,
			rollLocation: true,
			actor: this.actor,
			item: item,
		});
	}

}
