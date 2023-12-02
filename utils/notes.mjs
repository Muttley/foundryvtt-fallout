import fs from "fs";
import { markdown } from "markdown";

import stringify from "json-stable-stringify-pretty";

const NOTES_SRC_PATH = "./CHANGELOG.md";
const JOURNAL_JSON =
	"./data/packs/system-documentation.db/release_notes__auV5NLfnrA5zUr9q.json";

function compileReleaseNotes(cb) {
	const source = fs.readFileSync(NOTES_SRC_PATH, "utf8");
	const html = markdown.toHTML(source);

	const journalJson = fs.readFileSync(JOURNAL_JSON, "utf8");
	const journal = JSON.parse(journalJson);
	journal.text.content = `${html}`;

	let jsonData = stringify(journal, {space: "\t", undef: true});
	jsonData += "\n";

	fs.writeFileSync(JOURNAL_JSON, jsonData);
	cb();
}
export const compile = compileReleaseNotes;
