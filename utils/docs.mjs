import fs from "fs";
import { markdown } from "markdown";

import stringify from "json-stable-stringify-pretty";

const docs = [
	{
		src: "./CHANGELOG.md",
		dst: "./data/packs/system-documentation.db/release_notes__auV5NLfnrA5zUr9q.json",
	},
	{
		src: "./data/docs/active-effects.md",
		dst: "./data/packs/system-documentation.db/active_effects__c3srsy3XNwoUiMC8.json",
	},
];

// const NOTES_SRC_PATH = "./CHANGELOG.md";
// const JOURNAL_JSON =
// 	"./data/packs/system-documentation.db/release_notes__auV5NLfnrA5zUr9q.json";

function compileDocs(cb) {
	for (const doc of docs) {
		const source = fs.readFileSync(doc.src, "utf8");
		const html = markdown.toHTML(source, "Maruku");

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
