import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export default class FalloutItemSheet extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "item"],
			width: 520,
			height: 520,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "attributes",
			}],
		});
	}

	/** @override */
	get template() {
		const path = "systems/fallout/templates/item";
		return `${path}/item-${this.item.type}-sheet.hbs`;
	}

	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Item.${this.item.type}`);
		return `[${type}] ${this.item.name}`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData(options) {
		// Retrieve base data structure.
		const context = await super.getData(options);
		const item = context.item;
		const source = item.toObject();

		foundry.utils.mergeObject(context, {
			source: source.system,
			system: item.system,
			isEmbedded: item.isEmbedded,
			type: item.type,
			flags: item.flags,
			FALLOUT: CONFIG.FALLOUT,
			effects: prepareActiveEffectCategories(item.effects),
			descriptionHTML: await TextEditor.enrichHTML(item.system.description, {
				secrets: item.isOwner,
				async: true,
			}),
		});

		// Enrich Mods Text
		if (item.system.mods) {
			foundry.utils.mergeObject(context, {
				modsListHTML: await TextEditor.enrichHTML(item.system.mods.list, {
					secrets: item.isOwner,
					async: true,
				}),
			});
		}

		// Enrich Effect Text
		if (item.system.effect) {
			foundry.utils.mergeObject(context, {
				effectHTML: await TextEditor.enrichHTML(item.system.effect, {
					secrets: item.isOwner,
					async: true,
				}),
			});
		}

		if (item.type === "weapon") {
			context.damageTypes = [];
			for (const key in CONFIG.FALLOUT.WEAPONS.damageType) {
				context.damageTypes.push({
					active: item.system?.damage?.damageType[key] ?? false,
					key,
					label: game.i18n.localize(CONFIG.FALLOUT.WEAPONS.damageType[key]),
				});
			}

			const weaponQualities = [];
			for (const key in CONFIG.FALLOUT.WEAPONS.weaponQuality) {
				weaponQualities.push({
					active: item.system?.damage?.weaponQuality[key].value ?? false,
					key,
					label: game.i18n.localize(CONFIG.FALLOUT.WEAPONS.weaponQuality[key].label),
				});

				context.weaponQualities = weaponQualities.sort(
					(a, b) => a.label.localeCompare(b.label)
				);
			}

			const damageEffects = [];
			for (const key in CONFIG.FALLOUT.WEAPONS.damageEffect) {
				const effect = CONFIG.FALLOUT.WEAPONS.damageEffect[key] ?? {};
				const itemData = item.system?.damage?.damageEffect[key] ?? {};

				damageEffects.push({
					active: itemData.value ?? false,
					hasRanks: effect.hasRanks,
					key,
					label: game.i18n.localize(effect.label),
					rank: effect.hasRanks ? itemData.rank : -1,
				});

				context.damageEffects = damageEffects.sort(
					(a, b) => a.label.localeCompare(b.label)
				);
			}
		}

		return context;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Effects.
		html.find(".effect-control").click(ev => {
			if (this.item.isOwned) {
				return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.");
			}
			onManageActiveEffect(ev, this.item);
		});

		// Send To Chat
		html.find(".chaty").click(ev => {
			this.item.sendToChat();
		});

		// DON't LET NUMBER FIELDS EMPTY
		const numInputs = document.querySelectorAll("input[type=number]");
		numInputs.forEach(function(input) {
			input.addEventListener("change", function(e) {
				if (e.target.value === "") {
					e.target.value = 0;
				}
			});
		});
	}
}
