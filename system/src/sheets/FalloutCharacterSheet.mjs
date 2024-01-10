import FalloutPlayerCharacterSheet from "./FalloutPlayerCharacterSheet.mjs";

/**
 * @extends {ActorSheet}
 */
export default class FalloutCharacterSheet extends FalloutPlayerCharacterSheet {

	constructor(object, options) {
		super(object, options);

		this.chemDoseManager = new fallout.apps.FalloutChemDoses(this.actor);
	}

	/* -------------------------------------------- */

	activateListeners(html) {
		super.activateListeners(html);

		// * POWER ARMOR MONITOR
		html.find(".power-armor-monitor-health-value").change(event => {
			event.preventDefault();

			const apparelId = $(event.currentTarget).data("itemId");
			const newHealthValue = $(event.currentTarget).val();

			let apparel = this.actor.items.get(apparelId);

			if (apparel && apparel.system.appareltype === "powerArmor") {
				apparel.update({ "system.health.value": newHealthValue });
			}
		});
	}


	/** @override */
	async getData(options) {
		const context = await super.getData(options);

		this.chemDoseManager.render(false);

		return context;
	}
}
