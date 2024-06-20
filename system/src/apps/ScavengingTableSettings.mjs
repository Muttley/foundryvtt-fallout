export default class ScavengingTableSettings extends FormApplication {
	constructor(object, options) {
		super(object, options);

		this.selectedTables = game.settings.get(SYSTEM_ID, "scavengingCategoryTables") ?? {};
	}

	/** @inheritdoc */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize("FALLOUT.Form.ScavengingSettings.title"),
			template: "systems/fallout/templates/apps/scavenging-settings.hbs",
			width: 450,
			height: "auto",
			resizable: false,
			closeOnSubmit: false,
			submitOnChange: true,
		});
	}

	get selectedCompendium() {
		return game.settings.get(SYSTEM_ID, "scavengingCompendium") ?? "";
	}

	static registerSetting() {
		game.settings.register(SYSTEM_ID, "scavengingCompendium", {
			name: game.i18n.localize("FALLOUT.Form.ScavengingCompendium.title"),
			hint: game.i18n.localize("FALLOUT.Form.ScavengingCompendium.hint"),
			config: false,
			scope: "world",
			type: String,
			default: "",
		});
		game.settings.register(SYSTEM_ID, "scavengingCategoryTables", {
			name: game.i18n.localize("FALLOUT.Form.ScavengingCategoryTables.title"),
			hint: game.i18n.localize("FALLOUT.Form.ScavengingCategoryTables.hint"),
			config: false,
			scope: "world",
			type: Object,
			default: {
				ammunition: "",
				armor: "",
				beverages: "",
				chems: "",
				clothing: "",
				food: "",
				junk: "",
				other: "",
				weapons: "",
			},
		});
	}

	activateListeners(html) {
		super.activateListeners(html);
	}

	async getData() {
		const data = await super.getData();

		data.FALLOUT = CONFIG.FALLOUT;

		data.compendiums = {};
		for (let pack of game.packs) {
			if (pack.metadata.type !== "RollTable") continue;

			data.compendiums[pack.metadata.id] =
				`[${pack.metadata.packageName}] ${pack.metadata.label}`;
		}

		data.selectedCompendium = this.selectedCompendium;

		const tables = await fallout.compendiums.scavengingRolltables();

		data.tables = {};

		for (const table of tables) {
			data.tables[table.uuid] = table.name;
		}

		data.selectedTables = this.selectedTables;

		return data;
	}

	async _onChangeInput(event) {
		const currentTarget = event.currentTarget;
		const name = currentTarget.name;
		const value = currentTarget.value;

		console.log(`${name} :: ${value}`);
		if (name === "scavenging_compendium") {
			await game.settings.set(SYSTEM_ID, "scavengingCompendium", value);

			for (const category of Object.keys(this.selectedTables)) {
				this.selectedTables[category] = "";
			}
			await game.settings.set(
				SYSTEM_ID, "scavengingCategoryTables", this.selectedTables
			);
		}
		else {
			this.selectedTables[name] = value;
			await game.settings.set(
				SYSTEM_ID, "scavengingCategoryTables", this.selectedTables
			);
		}

		return this.render(true);
	}

	async _updateObject(event, data) {}
}
