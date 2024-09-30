import FalloutNpcSheet from "./FalloutNpcSheet.mjs";

export default class FalloutCreatureSheet extends FalloutNpcSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "creature"],
			width: 690,
			height: 635,
		});
	}
}
