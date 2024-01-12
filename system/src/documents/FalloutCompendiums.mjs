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

	static async skills(filterSources=true) {
		return FalloutCompendiums._documents("Item", "skill", filterSources);
	}

	static async sources() {
		if (Array.isArray(CONFIG.FALLOUT.ALL_SOURCES)) {
			return CONFIG.FALLOUT.ALL_SOURCES;
		}

		CONFIG.FALLOUT.ALL_SOURCES = [];

		for (const source of Object.keys(CONFIG.FALLOUT.OFFICIAL_SOURCES)) {
			CONFIG.FALLOUT.ALL_SOURCES.push({
				uuid: source,
				name: game.i18n.localize(
					CONFIG.FALLOUT.OFFICIAL_SOURCES[source]
				),
			});
		}

		for (const module of game.modules) {
			if (!module.active) continue;

			const moduleSources = module.flags?.fallout?.sources ?? {};

			for (const moduleSource of Object.keys(moduleSources)) {
				CONFIG.FALLOUT.ALL_SOURCES.push({
					uuid: moduleSource,
					name: game.i18n.localize(
						moduleSources[moduleSource]
					),
				});
			}
		}

		return CONFIG.FALLOUT.ALL_SOURCES.sort(
			(a, b) => a.name.localeCompare(b.name)
		);
	}

}
