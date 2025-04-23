export class FalloutHovers {
	static LIST = {};

	static async loadList() {
		fallout.debug("Loading tooltips");

		const listLocation = await game.settings.get(SYSTEM_ID, "hoversJsonLocation");
		const jsonFile = await fetch(listLocation);
		const content = await jsonFile.json();

		for await (const key of Object.keys(content)) {
			let qEnriched = await TextEditor.enrichHTML(content[key], {async: true});

			content[key] = qEnriched
				.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;")
				.replaceAll('"', "&quot;")
				.replaceAll("'", "&#039;");
		}

		this.LIST = content;
	}
}
