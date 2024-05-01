export default class ItemTypeMenu extends Application {

	constructor(object, options={}) {
		super(object, options);

		this.actor = object;

		this.physicalItemTypes = [
			"ammo",
			"apparel_mod",
			"apparel",
			"books_and_magz",
			"consumable",
			"miscellany",
			"robot_mod",
			"robot_armor",
			"weapon_mod",
			"weapon",
		];
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fallout"],
			resizable: false,
			width: 100,
		});
	}

	get template() {
		return "systems/fallout/templates/apps/item-type-menu.hbs";
	}

	get title() {
		return game.i18n.localize("FALLOUT.APP.ItemTypeMenu.title");
	}

	async _onFindFromCompendium(event) {
		event.preventDefault();
		const itemType = event.currentTarget.dataset.type;
		new fallout.apps.ItemSelector(this.actor, {itemType}).render(true);
	}

	activateListeners(html) {
		html.find(".find-from-compendium").click(this._onFindFromCompendium.bind(this));
	}

	async getData(options={}) {
		const context = super.getData(options);

		const itemTypes = [];

		for (const type of this.physicalItemTypes) {
			itemTypes.push({key: type, name: CONFIG.FALLOUT.ITEM_TYPES[type]});
		}

		context.itemTypes = itemTypes.sort((a, b) => a.name.localeCompare(b.name));

		return context;
	}
}
