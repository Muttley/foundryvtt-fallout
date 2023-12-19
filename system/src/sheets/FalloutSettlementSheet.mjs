import FalloutActorSheet from "./FalloutActorSheet.mjs";

export default class FalloutSettlementSheet extends FalloutActorSheet {

	/** @override */
	get template() {
		return `systems/fallout/templates/actor/${this.actor.type}-sheet.hbs`;
	}

}
