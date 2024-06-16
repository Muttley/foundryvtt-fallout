import CompendiumItemSelector from "../CompendiumItemSelector.mjs";

export default class ItemSelector extends CompendiumItemSelector {

	closeOnSelection = true;

	maxChoices = 1;

	constructor(object={}, options={}) {
		super(object, options);

		this.itemType = options.itemType;
	}

	get prompt() {
		return game.i18n.localize("FALLOUT.Form.SelectCompendiumItem.prompt");
	}

	get title() {
		let i18nKey;

		switch (this.itemType) {
			case "armor":
			case "clothing":
			case "headgear":
			case "outfit":
			case "powerArmor":
				i18nKey = `FALLOUT.APPAREL.${this.itemType}`;
				break;
			case "armor_robot":
				i18nKey = "TYPES.Item.robot_armor";
				break;
			case "plating_robot":
				i18nKey = "FALLOUT.APPAREL.plating";
				break;
			default:
				i18nKey = `TYPES.Item.${this.itemType}`;
		}

		return game.i18n.format(
			"FALLOUT.Form.SelectItem.title",
			{
				type: game.i18n.localize(i18nKey),
			}
		);
	}

	async decorateName(item) {
		switch (item.type) {
			case "apparel_mod": {
				const apparelType = CONFIG.FALLOUT.APPAREL_TYPES[
					item.system.apparelType
				];

				return `${item.name} (${apparelType})`;
			}
			case "books_and_magz": {
				if (item.system.publication !== "") {
					return `${item.system.publication}: ${item.name}`;
				}
				else {
					return `${item.name}`;
				}
			}
			case "consumable": {
				const consumableType = CONFIG.FALLOUT.CONSUMABLE_TYPES[
					item.system.consumableType
				];

				return `${item.name} (${consumableType})`;
			}
			case "skill": {
				return fallout.utils.getLocalizedSkillName(item);
			}
			case "weapon": {
				const weaponType = CONFIG.FALLOUT.WEAPON_TYPES[item.system.weaponType];
				return `${item.name} (${weaponType})`;
			}
			case "weapon_mod": {
				const weaponType = CONFIG.FALLOUT.WEAPON_TYPES[item.system.weaponType];
				const modType = item.system.modType;
				return `${item.name} (${weaponType}, ${modType})`;
			}
			default:
				return super.decorateName(item);
		}
	}

	async getAvailableItems() {
		switch (this.itemType) {
			case "addiction":
				return await fallout.compendiums.addictions();
			case "ammo":
				return await fallout.compendiums.ammo();
			case "apparel_mod":
				return await fallout.compendiums.apparel_mods();
			case "armor":
				return await fallout.compendiums.armor();
			case "apparel":
				return await fallout.compendiums.apparel();
			case "armor_robot":
				return await fallout.compendiums.armor_robot();
			case "books_and_magz":
				return await fallout.compendiums.books_and_magz();
			case "clothing":
				return await fallout.compendiums.clothing();
			case "consumable":
				return await fallout.compendiums.consumables();
			case "disease":
				return await fallout.compendiums.diseases();
			case "headgear":
				return await fallout.compendiums.headgear();
			case "miscellany":
				return await fallout.compendiums.miscellany();
			case "object_or_structure":
				return await fallout.compendiums.structures();
			case "outfit":
				return await fallout.compendiums.outfit();
			case "perk":
				return await fallout.compendiums.perks();
			case "plating_robot":
				return await fallout.compendiums.plating_robot();
			case "powerArmor":
				return await fallout.compendiums.powerArmor();
			case "robot_armor":
				return await fallout.compendiums.robot_armor();
			case "robot_mod":
				return await fallout.compendiums.robot_mods();
			case "skill":
				return await fallout.compendiums.skills();
			case "special_ability":
				return await fallout.compendiums.special_abilities();
			case "trait":
				return await fallout.compendiums.traits();
			case "weapon":
				return await fallout.compendiums.weapons();
			case "weapon_mod":
				return await fallout.compendiums.weapon_mods();
			default:
				console.log(this.itemType);
		}
	}

	async getCurrentItems() {}

	async getUuids() {}

	async saveSelected(uuids) {
		const uuid = uuids[0] ?? "";

		if (uuid !== "") {
			const item = await fromUuid(uuid);
			const itemData = item.toObject();
			itemData._stats.compendiumSource = uuid;
			this.object.createEmbeddedDocuments("Item", [itemData]);
		}
	}
}
