import fs from "fs";
import { markdown } from "markdown";

import stringify from "json-stable-stringify-pretty";

const issueUrl = "https://github.com/Muttley/foundryvtt-fallout/issues";

const docs = [
	{
		src: "./RELEASE_NOTES.md",
		dst: "./data/packs/system_documentation.db/release_notes__auV5NLfnrA5zUr9q.json",
	},
	{
		src: "./data/docs/active-effects.md",
		dst: "./data/packs/system_documentation.db/active_effects__c3srsy3XNwoUiMC8.json",
	},
];

function compileDocs(cb) {
	for (const doc of docs) {
		const source = fs.readFileSync(doc.src, "utf8");

		// Dynamically add links to ticket numbers:
		//
		// Matches: [#389]
		// Outputs: [**[#389](https://github.com/Muttley/foundryvtt-fallout/issues/389)**]
		//
		const enhancedSource = source.replace(
			/\[#(\d+)\]/g,
			`[**[#$1](${issueUrl}/$1)**]`
		);

		const html = markdown.toHTML(enhancedSource, "Maruku");

		const journalJson = fs.readFileSync(doc.dst, "utf8");
		const journal = JSON.parse(journalJson);
		journal.text.content = `${html}`;

		let jsonData = stringify(journal, {space: "\t", undef: true});
		jsonData += "\n";

		fs.writeFileSync(doc.dst, jsonData);
	}

	cb();
}

export const compile = compileDocs;
