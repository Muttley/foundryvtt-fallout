export default class FalloutCompendiums {

	static async _compendiumDocuments(type, subtype=null) {
		let docs = [];

		// Iterate through the Packs, adding them to the list
		for (let pack of game.packs) {
			if (pack.metadata.type !== type) continue;

			let ids;

			if (subtype !== null) {
				ids = pack.index.filter(d => d.type === subtype).map(d => d._id);
			}
			else {
				ids = pack.index.map(d => d._id);
			}

			for (const id of ids) {
				const doc = await pack.getDocument(id);

				if (doc) docs.push(doc);
			}
		}

		// Dedupe and sort the list alphabetically
		docs = Array.from(new Set(docs)).sort((a, b) => a.name.localeCompare(b.name));

		const collection = new Collection();

		for (let d of docs) {
			collection.set(d.id, d);
		}

		return collection;
	}

	static async _documents(type, subtype, filterSources=true) {
		let sources = [];

		if (filterSources === true) {
			sources = game.settings.get("fallout", "sourceFilters") ?? [];
		}

		const noSources = sources.length === 0;

		const documents = await FalloutCompendiums._compendiumDocuments(type, subtype);

		if (noSources) {
			return documents;
		}
		else {
			const filteredDocuments = documents.filter(
				document => {
					const source = document.system?.source ?? "";

					return source === "" || sources.includes(source);
				}
			);

			// re-create the collection from the filtered Items
			const filteredCollection = new Collection();
			for (let d of filteredDocuments) {
				filteredCollection.set(d.id, d);
			}

			return filteredCollection;
		}
	}

	static async addictions(filterSources=true) {
		return FalloutCompendiums._documents("Item", "addiction", filterSources);
	}

	static async ammo(filterSources=true) {
		return FalloutCompendiums._documents("Item", "ammo", filterSources);
	}

	static async apparel_mods(filterSources=true) {
		return FalloutCompendiums._documents("Item", "apparel_mod", filterSources);
	}

	static async apparel(subtypes=[], filterSources=true) {
		const noSubtypes = subtypes.length === 0;

		const documents = await FalloutCompendiums._documents("Item", "apparel", filterSources);

		if (noSubtypes) {
			return documents;
		}
		else {
			const filteredDocuments = documents.filter(
				document => subtypes.includes(document.system.apparelType)
			);

			// re-create the collection from the filtered Items
			const filteredCollection = new Collection();
			for (let d of filteredDocuments) {
				filteredCollection.set(d.id, d);
			}

			return filteredCollection;
		}
	}

	static async armor(filterSources=true) {
		return FalloutCompendiums.apparel(["armor"], filterSources);
	}

	static async armor_robot(filterSources=true) {
		return FalloutCompendiums.robot_armor(["armor"], filterSources);
	}

	static async books_and_magz(filterSources=true) {
		return FalloutCompendiums._documents("Item", "books_and_magz", filterSources);
	}

	static async clothing(filterSources=true) {
		return FalloutCompendiums.apparel(["clothing"], filterSources);
	}

	static async consumables(filterSources=true) {
		return FalloutCompendiums._documents("Item", "consumable", filterSources);
	}

	static async diseases(filterSources=true) {
		return FalloutCompendiums._documents("Item", "disease", filterSources);
	}

	static async headgear(filterSources=true) {
		return FalloutCompendiums.apparel(["headgear"], filterSources);
	}

	static async miscellany(filterSources=true) {
		return FalloutCompendiums._documents("Item", "miscellany", filterSources);
	}

	static async npcs(filterSources=true) {
		return FalloutCompendiums._documents("Actor", "npc", filterSources);
	}

	static async outfit(filterSources=true) {
		return FalloutCompendiums.apparel(["outfit"], filterSources);
	}

	static async plating_robot(filterSources=true) {
		return FalloutCompendiums.robot_armor(["plating"], filterSources);
	}

	static async perks(filterSources=true) {
		return FalloutCompendiums._documents("Item", "perk", filterSources);
	}

	static async powerArmor(filterSources=true) {
		return FalloutCompendiums.apparel(["powerArmor"], filterSources);
	}

	static async robot_armor(subtypes=[], filterSources=true) {
		const noSubtypes = subtypes.length === 0;

		const documents = await FalloutCompendiums._documents("Item", "robot_armor", filterSources);

		if (noSubtypes) {
			return documents;
		}
		else {
			const filteredDocuments = documents.filter(
				document => subtypes.includes(document.system.apparelType)
			);

			// re-create the collection from the filtered Items
			const filteredCollection = new Collection();
			for (let d of filteredDocuments) {
				filteredCollection.set(d.id, d);
			}

			return filteredCollection;
		}
	}

	static async robot_mods(filterSources=true) {
		return FalloutCompendiums._documents("Item", "robot_mod", filterSources);
	}

	static async skills(filterSources=true) {
		return FalloutCompendiums._documents("Item", "skill", filterSources);
	}

	static async sources() {
		if (Array.isArray(CONFIG.FALLOUT.ALL_SOURCES)) {
			return CONFIG.FALLOUT.ALL_SOURCES;
		}

		const allSources = [];

		for (const source of Object.keys(CONFIG.FALLOUT.OFFICIAL_SOURCES)) {
			allSources.push({
				uuid: source,
				name: game.i18n.localize(
					CONFIG.FALLOUT.OFFICIAL_SOURCES[source]
				),
			});
		}

		for (const module of game.modules) {
			if (!module.active) continue;

			const flags = module.flags?.[module.id];
			const moduleSources = flags?.["fallout-sources"] ?? {};

			for (const moduleSource of Object.keys(moduleSources)) {
				allSources.push({
					uuid: moduleSource,
					name: game.i18n.localize(
						moduleSources[moduleSource]
					),
				});
			}
		}

		CONFIG.FALLOUT.ALL_SOURCES = allSources.sort(
			(a, b) => a.name.localeCompare(b.name)
		);

		return CONFIG.FALLOUT.ALL_SOURCES;
	}

	static async special_abilities(filterSources=true) {
		return FalloutCompendiums._documents("Item", "special_ability", filterSources);
	}

	static async structures(filterSources=true) {
		return FalloutCompendiums._documents("Item", "object_or_structure", filterSources);
	}

	static async traits(filterSources=true) {
		return FalloutCompendiums._documents("Item", "trait", filterSources);
	}

	static async weapon_mods(filterSources=true) {
		return FalloutCompendiums._documents("Item", "weapon_mod", filterSources);
	}

	static async weapons(filterSources=true) {
		return FalloutCompendiums._documents("Item", "weapon", filterSources);
	}

}
