import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

/**
 * @extends {FalloutBaseActorSheet}
 */
export default class FalloutNpcSheet extends FalloutBaseActorSheet {

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
}
