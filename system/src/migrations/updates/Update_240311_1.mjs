import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240311_1 extends FalloutUpdateBase {

	static version = 240311.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "ammo") {
			return;
		}
		if (itemData.system.quantityRoll !== "") {
			return;
		}

		const ammoMap = {
			".308 Round": "6+3dc",
			".38 Round": "10+5dc",
			".44 Magnum Round": "4+2dc",
			".45 Round": "8+4dc",
			".50 Round": "4+2dc",
			"10mm Round": "8+4dc",
			"2mm Electromagnetic Cartridge": "6+3dc",
			"5.56mm Round": "8+4dc",
			"5mm Round": "10*12+6dc",
			"Baseball Grenade": "1",
			"Bottlecap Mine": "1",
			"Flamer Fuel": "12+6dc",
			"Flare": "2+1dc",
			"Frag Grenade": "1",
			"Frag Mine": "1",
			"Fusion Cell": "14+7dc",
			"Fusion Core": "1",
			"Gamma Round": "4+2dc",
			"Javelin": "1",
			"Mini-Nuke": "1+1dc",
			"Missile": "2+1dc",
			"Molotov Cocktail": "1",
			"Nuka Grenade": "1",
			"Nuke Mine": "1",
			"Plasma Cartridge": "10+5dc",
			"Plasma Grenade": "1",
			"Plasma Mine": "1",
			"Pulse Grenade": "1",
			"Pulse Mine": "1",
			"Railway Spike": "6+3dc",
			"Shotgun Shell": "6+3dc",
			"Syringer Ammo": "4+2dc",
			"Throwing Knife": "1",
			"Tomahawk": "1",
		};

		const updateData = {};

		const newFormula = ammoMap[itemData.name];

		if (newFormula) {
			updateData["system.quantityRoll"] = newFormula;
		}

		return updateData;
	}
}
