import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

/**
 * @extends {FalloutBaseActorSheet}
 */
export default class FalloutNpcSheet extends FalloutBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "npc"],
			width: 815,
			height: 790,
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
			"skill",
			"special_ability",
			"perk",
			"weapon",
		];
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find(".roll-wealth").click(this._onRollWealth.bind(this));
	}

	async getData(options) {
		const context = await super.getData(options);

		const bodyPartData = this.actor.system.body_parts;

		context.bodyParts = [];

		let bodyType = "humanoid";
		let valueConfig = {};

		if (this.actor.isVehicle) {
			bodyType = "vehicle";
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
		}
		else {
			bodyType = this.actor.system.bodyType;
			valueConfig = CONFIG.FALLOUT.BODY_VALUES;
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

		if (this.actor.isCreature) {
			await this._prepareButcheryMaterials(context);
		}

		if (this.actor.isVehicle) {
			await this._getVehicleQualities(context, this.actor);
		}

		context.disableAutoXpReward = game.settings.get(
			SYSTEM_ID, "disableAutoXpReward"
		);

		context.settlements = [];

		const settlements = game.actors.filter(a => a.type === "settlement");
		settlements.sort((a, b) => a.name.localeCompare(b.name));

		for (const settlement of settlements) {
			context.settlements.push({
				uuid: settlement.uuid,
				name: settlement.name,
			});
		}

		return context;
	}

	async _onRollWealth(event) {
		event.preventDefault();
		const wealthLevel = Math.max(1, this.actor.system.wealth ?? 1);

		const formula = `${wealthLevel}d20`;
		const roll = new Roll(formula);

		const wealthRoll = await roll.evaluate();

		await fallout.Roller2D20.showDiceSoNice(wealthRoll);

		const caps = parseInt(roll.total);

		this.actor.update({"system.currency.caps": caps});
	}

	async _updateObject(event, formData) {
		if (this.actor.type === "settlement") {
			const originalSettlement = this.actor.system.settlement.uuid;
			const newSettlement = formData["system.settlement.uuid"];

			await super._updateObject(event, formData);

			if (originalSettlement !== newSettlement) {
				for (const uuid of [originalSettlement, newSettlement]) {
					if (uuid === "") {
						continue;
					}
					const settlement = await fromUuid(uuid);

					if (settlement) {
						settlement.sheet.render(false);
					}
				}
			}
			else if (newSettlement !== "") {
				const settlement = await fromUuid(newSettlement);
				if (settlement) {
					settlement.sheet.render(false);
				}
			}
		}
		else {
			for (const resistanceType of ["energy", "physical", "poison", "radiation"]) {
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
}
