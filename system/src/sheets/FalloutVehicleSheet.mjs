import FalloutNpcSheet from "./FalloutNpcSheet.mjs";

export default class FalloutVehicleSheet extends FalloutNpcSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "vehicle"],
			width: 750,
			height: 710,
		});
	}
}
