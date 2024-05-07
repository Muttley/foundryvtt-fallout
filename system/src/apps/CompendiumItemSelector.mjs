export default class CompendiumItemSelector extends FormApplication {

	availableItems = [];

	closeOnSelection = false;

	maxChoices = 0;

	itemsLoaded = false;

	uuid = foundry.utils.randomID();

	constructor(object={}, options={}) {
		super(object, options);
	}

	static get defaultOptions() {
		const options = super.defaultOptions;

		foundry.utils.mergeObject(options, {
			classes: ["fallout"],
			height: "auto",
			width: 320,
			closeOnSubmit: false,
			submitOnChange: true,
		});

		return options;
	}

	get prompt() {
		return game.i18n.localize("FALLOUT.Form.SelectCompendiumItem.prompt");
	}

	get template() {
		return "systems/fallout/templates/apps/compendium-item-selector.hbs";
	}

	get title() {
		return game.i18n.localize("FALLOUT.Form.SelectCompendiumItem.title");
	}

	async _autoCloseWhenRendered() {
		while (!this.rendered) {
			await fallout.utils.sleep(100); // millisecs
		}

		this.close({force: true});
	}

	async _getAvailableItems() {
		const loadingDialog = new fallout.FalloutLoading().render(true);

		const availableItems = await this.getAvailableItems() ?? [];
		this.itemsLoaded = true;

		const itemsAvailable = availableItems?.size > 0 ?? false;

		if (itemsAvailable) {
			for (const item of availableItems) {
				item.decoratedName = await this.decorateName(item);
			}

			this.availableItems = Array.from(availableItems).sort(
				(a, b) => a.decoratedName.localeCompare(b.decoratedName)
			);
		}
		else {
			ui.notifications.warn(
				game.i18n.localize("FALLOUT.Form.SelectCompendiumItem.Error.NoItemsFound")
			);

			this._autoCloseWhenRendered();
		}

		loadingDialog.close({force: true});
	}

	activateListeners(html) {
		html.find(".remove-item").click(event => this._onRemoveItem(event));

		super.activateListeners(html);
	}

	async decorateName(item) {
		// By default we just use the name, but this can be overriden by each
		// selector class if needed
		return item.name;
	}

	async getCurrentItemData() {
		this.currentItemUuids = await this.getUuids() ?? [];
		this.currentItems = await this.getCurrentItems() ?? [];
	}

	async getCurrentItems() {
		const items = [];
		for (const uuid of this.currentItemUuids) {
			const item = await fromUuid(uuid);
			items.push(item);
		}

		return items.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
	}

	async getData() {
		if (!this.itemsLoaded) {
			await this._getAvailableItems();
		}

		await this.getCurrentItemData();

		const context = {
			currentItems: this.currentItems,
			itemChoices: [],
			prompt: this.prompt,
			uuid: this.uuid,
		};

		// Don't include already selected items
		for (const item of this.availableItems) {
			if (!this.currentItemUuids.includes(item.uuid)) {
				context.itemChoices.push(item);
			}
		}

		return context;
	}

	async _onRemoveItem(event) {
		event.preventDefault();
		event.stopPropagation();

		let itemIndex = $(event.currentTarget).data("item-index");

		const newItemUuids = [];

		for (let i = 0; i < this.currentItems.length; i++) {
			if (itemIndex === i) continue;
			newItemUuids.push(this.currentItems[i].uuid);
		}

		await this._saveSelected(newItemUuids);
	}

	async _saveSelected(uuids) {
		await this.saveSelected(uuids);

		this.render(false);
	}

	async _updateObject(event, formData) {
		let newUuids = this.currentItemUuids;

		const currentItemCount = this.currentItemUuids.length;
		if (this.maxChoices === 1 && currentItemCount === 1 && formData["item-selected"] !== "") {
			for (const item of this.availableItems) {
				if (item.decoratedName === formData["item-selected"]) {
					newUuids = [item.uuid];
					break;
				}
			}

			await this._saveSelected(newUuids);
		}
		else if (this.maxChoices === 0 || this.maxChoices > currentItemCount) {
			for (const item of this.availableItems) {
				if (item.decoratedName === formData["item-selected"]) {
					newUuids.push(item.uuid);
					break;
				}
			}

			await this._saveSelected(newUuids);
		}
		else {
			ui.notifications.warn(
				game.i18n.format("FALLOUT.Form.SelectCompendiumItem.Error.MaxChoicesReached",
					{maxChoices: this.maxChoices}
				)
			);

			return this.render(true);
		}

		if (this.closeOnSelection) return this.close({force: true});
	}
}
