export default class SourceFilterSettings extends FormApplication {
	constructor(object, options) {
		super(object, options);

		this.filtered = game.settings.get(SYSTEM_ID, "sourceFilters") ?? [];
	}

	/** @inheritdoc */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: game.i18n.localize("FALLOUT.Form.SourceFilters.title"),
			template: "systems/fallout/templates/apps/source-filter.hbs",
			width: 450,
			height: "auto",
			resizable: false,
			closeOnSubmit: true,
		});
	}

	static registerSetting() {
		game.settings.register(SYSTEM_ID, "sourceFilters", {
			name: game.i18n.localize("FALLOUT.Form.SourceFilters.title"),
			hint: game.i18n.localize("FALLOUT.Form.SourceFilters.hint"),
			config: false,
			scope: "world",
			type: Array,
			requiresReload: true,
			default: [],
		});
	}

	activateListeners(html) {
		html.find(".delete-choice").click(event => this._deleteChoiceItem(event));

		super.activateListeners(html);
	}

	async getData() {
		const data = await super.getData();

		const sources = await fallout.compendiums.sources();

		const sourceLut = {};
		for (const source of sources) {
			sourceLut[source.uuid] = source.name;
		}

		data.selectedSources = this.filtered.map(
			choice => ({uuid: choice, name: sourceLut[choice]})
		);

		data.hasSelectedSources = data.selectedSources.length > 0;

		data.unselectedSources = sources.map(
			({uuid, name}) => ({name, uuid})
		).filter(source => !this.filtered.includes(source.uuid));

		return data;
	}

	async _deleteChoiceItem(event) {
		event.preventDefault();
		event.stopPropagation();

		const deleteUuid = $(event.currentTarget).data("uuid");

		const newChoices = [];
		for (const itemUuid of this.filtered) {
			if (itemUuid === deleteUuid) {
				continue;
			}
			newChoices.push(itemUuid);
		}

		this.filtered = newChoices;

		return this.render(true);
	}

	async _onChangeInput(event) {
		const options = event.target.list.options;
		const value = event.target.value;

		let uuid = null;
		for (const option of options) {
			if (option.value === value) {
				uuid = option.getAttribute("data-uuid");
				break;
			}
		}

		if (uuid === null) {
			return;
		}

		if (this.filtered.includes(uuid)) {
			return;
		} // No duplicates

		this.filtered.push(uuid);

		this.filtered.sort((a, b) => a.localeCompare(b));

		return this.render(true);
	}

	async _updateObject(event, data) {
		game.settings.set(SYSTEM_ID, "sourceFilters", this.filtered);
	}
}
