const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class FalloutSpecialEditor
	extends HandlebarsApplicationMixin(ApplicationV2) {

	actor = undefined;

	attributes = underfined;

	constructor(options={}) {
		super(options);

		this.actor = options.actor ?? undefined;
	}

	static DEFAULT_OPTIONS = {
		actions: {
			saveSpecial: FalloutSpecialEditor.saveSpecial,
		},
		classes: ["fallout"],
		form: {
			handler: FalloutSpecialEditor.formHandler,
			submitOnChange: true,
			submitOnClose: false,
		},
		position: {
			width: 350,
		},
		tag: "form",
	};

	static PARTS = {
		form: {
			template: "systems/fallout/templates/apps/special-editor.hbs",
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	};

	static async formHandler(event, form, formdata) {
		event.preventDefault();
		fallout.logger.log(formdata);
		this.render();
	}

	get title() {
		return "Edit SPECIAL";
	}

	static async saveSpecial(event, target) {
		event.preventDefault();
		fallout.logger.log("Hello, World!");
		return this.close();
	}

	async _prepareContext(options) {
		const context = {
			FALLOUT: CONFIG.FALLOUT,
			buttons: [{
				type: "submit",
				icon: "fa-solid fa-floppy-disk",
				label: "FALLOUT.UI.SaveChanges",
			}],
			system: this.actor?.system ?? {},
		};

		return context;
	}
}
