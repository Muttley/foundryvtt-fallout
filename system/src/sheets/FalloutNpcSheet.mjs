import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

/**
 * @extends {FalloutBaseActorSheet}
 */
export default class FalloutNpcSheet extends FalloutBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: "auto",
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
			"weapon",
		];
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/npc-sheet.hbs";
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find(".roll-wealth").click(this._onRollWealth.bind(this));
	}

	async getData(options) {
		const context = await super.getData(options);

		if (this.actor.isCreature) {
			await this._prepareButcheryMaterials(context);
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

		const wealthRoll = await roll.evaluate({ async: true });
		try {
			await game.dice3d.showForRoll(wealthRoll);
		}
		catch(err) {}

		const caps = parseInt(roll.total);

		this.actor.update({"system.currency.caps": caps});
	}

	async _updateObject(event, formData) {
		if (this.actor.type !== "settlement") {
			return super._updateObject(event, formData);
		}

		const originalSettlement = this.actor.system.settlement.uuid;
		const newSettlement = formData["system.settlement.uuid"];

		await super._updateObject(event, formData);

		if (originalSettlement !== newSettlement) {
			for (const uuid of [originalSettlement, newSettlement]) {
				if (uuid === "") continue;
				const settlement = await fromUuid(uuid);

				if (settlement) settlement.sheet.render(false);
			}
		}
		else if (newSettlement !== "") {
			const settlement = await fromUuid(newSettlement);
			if (settlement) settlement.sheet.render(false);
		}
	}
}
