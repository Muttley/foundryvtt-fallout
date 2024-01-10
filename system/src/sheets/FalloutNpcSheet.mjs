import FalloutActorSheet from "./FalloutActorSheet.mjs";

/**
 * @extends {FalloutActorSheet}
 */
export default class FalloutNpcSheet extends FalloutActorSheet {

	/** @override */
	get initialTab() {
		return "abilities";
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/npc-sheet.hbs";
	}
}
