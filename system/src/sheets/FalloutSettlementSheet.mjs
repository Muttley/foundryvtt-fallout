export default class FalloutSettlementSheet extends ActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "actor"],
			width: 780,
			height: 940,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "status",
				},
			],
		});
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/settlement-sheet.hbs";
	}

	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Actor.${this.actor.type}`);
		return `[${type}] ${this.actor.name}`;
	}

	/** @override */
	async getData(options) {
		// Use a safe clone of the actor data for further operations.
		const source = this.actor.toObject();
		const actorData = this.actor.toObject(false);

		// Sort all items alphabetically for display on the character sheet
		actorData.items.sort((a, b) => a.name.localeCompare(b.name));

		const context = {
			actor: actorData,
			editable: this.isEditable,
			limited: this.actor.limited,
			options: this.options,
			owner: this.actor.isOwner,
			rollData: this.actor.getRollData.bind(this.actor),
			source: source.system,
			system: actorData.system,
			type: this.actor.type,
		};

		// Biography HTML enrichment
		context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		// Setup materials
		context.materials = [];
		for (const material of ["junk", "common", "uncommon", "rare"]) {
			context.materials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: this.actor.system.materials[material] ?? 0,
			});
		}

		return context;
	}
}
