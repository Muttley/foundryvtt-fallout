export class FOHovers {
	static LIST = {};

	static async loadList() {
		const listLocation = await game.settings.get("fallout", "hoversJsonLocation");
		const jsonFile = await fetch(listLocation);
		const content = await jsonFile.json();

		for await (const key of Object.keys(content)) {
			let qEnriched = await TextEditor.enrichHTML(content[key], {async: true});
			content[key] = qEnriched.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
		}
		// console.warn(content)
		FOHovers.LIST = content;
	}
}
