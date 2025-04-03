export class FalloutModuleArt {
	constructor() {
		/**
		 * The stored map of item UUIDs to their art information.
		 * @type {Map<string, ModuleArtInfo>}
		 */
		Object.defineProperty(this, "map", {value: new Map(), writable: false});
	}

	/* -------------------------------------------- */

	/**
	 * Set to true to temporarily prevent actors from loading module art.
	 * @type {boolean}
	 */
	suppressArt = false;

	static getModuleArtPath(module) {
		const flags = module.flags?.[module.id];
		const artPath = flags?.["fallout-art"];
		if (!artPath || !module.active) {
			return null;
		}
		return artPath;
	}

	async parseArtMapping(moduleId, mapping) {
		let settings = game.settings.get(
			SYSTEM_ID, "moduleArtConfiguration"
		)?.[moduleId];

		settings ??= {items: true};

		for (const [packName, items] of Object.entries(mapping)) {
			const pack = game.packs.get(packName);

			if (!pack) {
				continue;
			}

			for (let [itemId, info] of Object.entries(items))  {
				const entry = pack.index.get(itemId);

				if (!entry) {
					continue;
				}

				if (settings.items) {
					entry.img = info.img;
				}
				else {
					delete info.img;
				}

				delete info.__ITEM_NAME__;

				const uuid = pack.getUuid(itemId);

				info = foundry.utils.mergeObject(
					this.map.get(uuid) ?? {}, info, {inplace: false}
				);

				this.map.set(uuid, info);
			}
		}
	}

	async registerModuleArt() {
		this.map.clear();

		for (const module of game.modules) {
			const artPath = this.constructor.getModuleArtPath(module);

			if (!artPath) {
				continue;
			}

			try {
				const mapping = await foundry.utils.fetchJsonWithTimeout(artPath);
				await this.parseArtMapping(module.id, mapping);
			}
			catch(e) {
				console.error(e);
			}
		}
	}
}
