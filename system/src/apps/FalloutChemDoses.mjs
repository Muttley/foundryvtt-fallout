export default class FalloutChemDoses extends FormApplication {

	constructor(object, options={}) {
		super(object, options);

		this.actor = object;
	}

	/** @inheritdoc */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "chem-doses"],
			height: "auto",
			resizable: true,
			submitOnChange: true,
			submitOnClose: true,
			width: 333,
		});
	}

	/** @inheritdoc */
	get template() {
		return "systems/fallout/templates/apps/chem-doses.hbs";
	}

	/** @inheritdoc */
	get title() {
		const title = game.i18n.localize("FALLOUT.APP.ChemDoseManager.title");
		return `${title}: ${this.actor.name}`;
	}

	/** @override */
	getData() {
		const context = super.getData();

		context.chemDoses = this.actor.system.chemDoses;

		return context;
	}

	activateListeners(html) {
		html.find(".chem-delete").click(
			event => this._onDeleteChem(event)
		);

		html.find(".reset-all-button").click(
			event => this._onResetAllDoses(event)
		);

		super.activateListeners(html);
	}

	async _onDeleteChem(event) {
		event.preventDefault();
		const chemId = $(event.currentTarget).data("chemId");

		const updateData = {};
		updateData[`system.chemDoses.-=${chemId}`] = null;

		this.actor.update(updateData);
	}

	/** @inheritdoc */
	async _onSubmit(event) {
		let formData = this._getSubmitData();

		const updateData = {};

		for (const chemId in formData) {
			updateData[`system.chemDoses.${chemId}.doses`] = formData[chemId];
		}

		this.actor.update(updateData);
	}

	_onResetAllDoses(event) {
		event.preventDefault();

		renderTemplate(
			"systems/fallout/templates/dialogs/are-you-sure.hbs"
		).then(html => {
			new Dialog({
				title: `${game.i18n.localize("FALLOUT.UI.ChemDoses.ConfirmReset")}`,
				content: html,
				buttons: {
					Yes: {
						icon: '<i class="fa fa-check"></i>',
						label: `${game.i18n.localize("FALLOUT.UI.Yes")}`,
						callback: async () => {
							this.actor.resetChemDoses();
						},
					},
					Cancel: {
						icon: '<i class="fa fa-times"></i>',
						label: `${game.i18n.localize("FALLOUT.UI.Cancel")}`,
					},
				},
				default: "Yes",
			}).render(true);
		});
	}

}
