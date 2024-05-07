import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

/**
 * @extends {ItemSheet}
 */
export default class FalloutItemSheet extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "item"],
			width: 600,
			height: "auto",
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
			descriptionHTML: await TextEditor.enrichHTML(item.system.description, {
				secrets: item.isOwner,
				async: true,
			}),
			effects: prepareActiveEffectCategories(item.effects),
			FALLOUT: CONFIG.FALLOUT,
			flags: item.flags,
			isEmbedded: item.isEmbedded,
			isGM: game.user.isGM,
			source: source.system,
			system: item.system,
			type: item.type,
			useKgs: game.settings.get("fallout", "carryUnit") === "kgs",
		});

		context.allSources = await fallout.compendiums.sources();

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
			for (const [uuid, name] of Object.entries(CONFIG.FALLOUT.AMMO_BY_UUID)) {
				if (name === this.item.system.ammo) {
					context.ammoUuid = uuid;
					break;
				}
			}
			context.ammoTypes = CONFIG.FALLOUT.AMMO_TYPES;

			context.damageTypes = [];
			for (const key in CONFIG.FALLOUT.DAMAGE_TYPES) {
				context.damageTypes.push({
					active: item.system?.damage?.damageType[key] ?? false,
					key,
					label: CONFIG.FALLOUT.DAMAGE_TYPES[key],
				});
			}

			const weaponQualities = [];
			for (const key in CONFIG.FALLOUT.WEAPON_QUALITIES) {
				weaponQualities.push({
					active: item.system?.damage?.weaponQuality[key].value ?? false,
					hasRank: CONFIG.FALLOUT.WEAPON_QUALITY_HAS_RANK[key],
					rank: item.system?.damage?.weaponQuality[key].rank,
					key,
					label: CONFIG.FALLOUT.WEAPON_QUALITIES[key],
				});
			}

			context.weaponQualities = weaponQualities.sort(
				(a, b) => a.label.localeCompare(b.label)
			);

			const damageEffects = [];
			for (const key in CONFIG.FALLOUT.DAMAGE_EFFECTS) {
				damageEffects.push({
					active: item.system?.damage?.damageEffect[key].value ?? false,
					hasRank: CONFIG.FALLOUT.DAMAGE_EFFECT_HAS_RANK[key],
					rank: item.system?.damage?.damageEffect[key].rank,
					key,
					label: CONFIG.FALLOUT.DAMAGE_EFFECTS[key],
				});
			}

			context.damageEffects = damageEffects.sort(
				(a, b) => a.label.localeCompare(b.label)
			);

			context.isOwnedByCreature = item.isOwnedByCreature;

			const allSkills = await fallout.compendiums.skills();
			context.availableSkills = {};

			let availableSkillNames = [];
			for (const skill of allSkills) {
				availableSkillNames.push(skill.name);
			}

			availableSkillNames = availableSkillNames.sort(
				(a, b) => a.localeCompare(b)
			);

			for (const skillName of availableSkillNames) {
				context.availableSkills[skillName] = skillName;
			}
		}

		if (item.type === "object_or_structure") {
			// Setup materials
			context.materials = [];
			for (const material of ["common", "uncommon", "rare"]) {
				context.materials.push({
					label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
					key: `system.materials.${material}`,
					value: source.system.materials[material] ?? 0,
				});
			}

			const __getDescendants = function(output, actor, item) {
				const descendants = actor.items.filter(
					i => i.system.parentItem === item._id
				);

				for (const nextDescendant of descendants) {
					output.push(nextDescendant);
					__getDescendants(output, actor, nextDescendant);
				}
			};

			if (context.isEmbedded) {
				const descendants = [];
				__getDescendants(descendants, this.item.actor, item);

				let possibleParents =
					await this.item.actor.items.filter(i =>
						["structure", "room", "store"].includes(i.system.itemType)
						&& item._id !== i._id
						&& (!descendants.find(d => d._id === i._id))
					) ?? [];

				if (this.item.system.itemType === "structure") possibleParents = [];

				if (this.item.system.itemType === "room") {
					possibleParents = possibleParents.filter(
						i => i.system.itemType === "structure"
					);
				}

				const parentChoices = [];
				for (const possibleParent of possibleParents) {
					parentChoices.push({
						id: possibleParent._id,
						name: possibleParent.name,
					});
				}

				context.parentChoices = parentChoices.sort(
					(a, b) => a.name.localeCompare(b.name)
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

		html.find(".ammo-quantity-roll").click(this._rollAmmoQuantity.bind(this));

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

	_onSubmit(event) {
		if (this.item.type === "weapon") {
			const updateData = this._getSubmitData();

			const weaponType = updateData["system.weaponType"];
			if (weaponType !== this.item.system.weaponType) {
				updateData["system.creatureAttribute"] =
					CONFIG.FALLOUT.DEFAULT_CREATURE_WEAPON_ATTRIBUTE[
						weaponType
					];
				updateData["system.creatureSkill"] =
					CONFIG.FALLOUT.DEFAULT_CREATURE_WEAPON_SKILL[
						weaponType
					];
			}

			this.item.update(updateData);
		}
		else {
			super._onSubmit(event);
		}
	}

	async _rollAmmoQuantity(event) {
		if (this.item.type !== "ammo") return;

		event.preventDefault();

		if (this.item.system.quantityRoll === "") {
			return ui.notifications.warn(`No roll formula set on Ammo item ${this.item.name}`);
		}


		const content = await renderTemplate(
			"systems/fallout/templates/dialogs/roll-ammo.hbs"
		);

		const dialogData = {
			title: game.i18n.localize("FALLOUT.dialog.roll_ammo.title"),
			content,
			buttons: {
				create: {
					label: game.i18n.localize("FALLOUT.dialog.roll_ammo.button.create"),
					callback: () => "create",
				},
				update: {
					label: game.i18n.localize("FALLOUT.dialog.roll_ammo.button.update"),
					callback: () => "update",
				},
				chat: {
					label: game.i18n.localize("FALLOUT.dialog.roll_ammo.button.chat"),
					callback: () => "chat",
				},
			},
			close: () => null,
			default: "update",
		};

		const mode = await Dialog.wait(dialogData);

		if (mode) {
			const formula = this.item.system.quantityRoll;

			const roll = new Roll(formula);
			const quantityRoll = await roll.evaluate();

			try {
				await game.dice3d.showForRoll(quantityRoll);
			}
			catch(err) {}

			const quantity = parseInt(roll.total);

			switch (mode) {
				case "update":
					return this.item.update({"system.quantity": quantity});
				case "create":
					const data = this.item.toObject();
					data.system.quantity = quantity;
					if (this.item.actor) {
						return this.item.actor.createEmbeddedDocuments("Item", [data]);
					}
					else {
						return Item.create(data);
					}
				case "chat":
					return fallout.chat.renderGeneralMessage(
						this,
						{
							title: game.i18n.localize("FALLOUT.dialog.roll_ammo.title"),
							body: game.i18n.format("FALLOUT.dialog.roll_ammo.chat.body",
								{
									ammoName: this.item.name,
									quantity,
								}
							),
						}
					);
			}
		}
	}
}
