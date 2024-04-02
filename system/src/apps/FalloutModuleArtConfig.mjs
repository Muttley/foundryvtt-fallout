import { FalloutModuleArt } from "../utils/FalloutModuleArt.mjs";

export class FalloutModuleArtConfig extends FormApplication {

	/** @inheritdoc */
	constructor(object={}, options={}) {
		object = foundry.utils.mergeObject(
			game.settings.get(SYSTEM_ID, "moduleArtConfiguration"),
			object,
			{inplace: false}
		);
		super(object, options);
	}

	/* -------------------------------------------- */

	/** @inheritdoc */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize("FALLOUT.APP.ModuleArtConfig.title"),
			template: "systems/fallout/templates/apps/module-art-config.hbs",
			popOut: true,
			width: 600,
			height: "auto",
		});
	}

	/* -------------------------------------------- */

	/** @inheritdoc */
	getData(options={}) {
		const context = super.getData(options);

		context.config = [];

		for (const module of game.modules) {
			if (!FalloutModuleArt.getModuleArtPath(module)) continue;
			const settings = this.object[module.id] ?? {portraits: true, tokens: true};
			context.config.push({label: module.title, id: module.id, ...settings});
		}

		context.config.sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));

		context.config.unshift({
			label: game.system.title,
			id: game.system.id,
			...this.object.fallout,
		});

		return context;
	}

	/* -------------------------------------------- */

	/** @inheritdoc */
	async _updateObject(event, formData) {
		await game.settings.set(
			SYSTEM_ID, "moduleArtConfiguration",
			foundry.utils.expandObject(formData)
		);
		return SettingsConfig.reloadConfirm({world: true});
	}
}
