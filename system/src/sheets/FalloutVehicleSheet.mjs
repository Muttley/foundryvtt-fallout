import FalloutNpcSheet from "./FalloutNpcSheet.mjs";

export default class FalloutVehicleSheet extends FalloutNpcSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "vehicle"],
			width: 700,
			height: 710,
		});
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/vehicle-sheet.hbs";
	}

}
