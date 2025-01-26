const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class FalloutLevelUp extends HandlebarsApplicationMixin(ApplicationV2) {

	actor = undefined;

	constructor(actor, options={}) {
		super();

		this.actor = actor;
	}


	/** @override */
	static DEFAULT_OPTIONS = {
		tag: "form",
		window: {
			contentClasses: [
				"standard-form",
			],
			resizable: true,
		},
		position: {
			width: 400,
			height: "auto",
		},
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
			handler: FalloutLevelUp.#onSubmit,
		},
		actions: {
		},
	};


	/** @override */
	static PARTS = {
		newLevel: {
			template: "systems/fallout/templates/apps/level-up/new-level.hbs",
		},
		maxHP: {
			template: "systems/fallout/templates/apps/level-up/max-hp.hbs",
		},
		perkSelection: {
			template: "systems/fallout/templates/apps/level-up/perk-selection.hbs",
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	};


	get title() {
		return `${game.i18n.localize("FALLOUT.LevelUp.AppTitle")}: ${this.actor.name}`;
	}


	async _getMaxHpContextData(context) {
		context.maxHP = this.actor.system.health.max;
		context.newMaxHP = context.maxHP + 1;

		return context;
	}


	async _getNewLevelContextData(context) {
		context.level = this.actor.system.level.value;
		context.newLevel = context.level + 1;

		return context;
	}


	async _getPerkSelectionContextData(context) {
		context.availablePerks = await this.actor.perkManager.getAvailablePerks();

		return context;
	}


	async _preparePartContext(partId, context) {
		switch (partId) {
			case "maxHP":
				return this._getMaxHpContextData(context);
			case "newLevel":
				return this._getNewLevelContextData(context);
			case "perkSelection":
				return this._getPerkSelectionContextData(context);
			default:
				return super._preparePartContext(partId, context);
		}
	}


	async #onChange(event, form, formData) {
		// TODO Implement
	}


	static async #onSubmit(event, form, formData) {
		if (event.type === "change") {
			return this.#onChange(event, form, formData);
		}

		// TODO Implement

		return this.close();
	}

}
