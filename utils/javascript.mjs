import { rollup } from "rollup";
import { deleteAsync } from "del";
import eslint from "gulp-eslint-new";
import gulp from "gulp";
import gulpIf from "gulp-if";
import mergeStream from "merge-stream";
import nodeResolve from "@rollup/plugin-node-resolve";

const LINT_SRC_PATHS = ["./system/fallout.mjs", "./system/src/"];

const BUILD_SRC_PATH = "./system/fallout.mjs";
const BUILD_DST_PATH = "./system/fallout-compiled.mjs";

function cleanupJavascriptFiles() {
	return deleteAsync([BUILD_DST_PATH, `${BUILD_DST_PATH}.map`]);
}
export const clean = cleanupJavascriptFiles;

// Compile javascript source files into a single output file.
//
async function compileJavascript() {
	const bundle = await rollup({
		input: BUILD_SRC_PATH,
		plugins: [nodeResolve()],
	});
	await bundle.write({
		file: BUILD_DST_PATH,
		format: "es",
		sourcemap: true,
		sourcemapFile: BUILD_SRC_PATH,
	});
}
export const compile = compileJavascript;

// Use eslint to check for formatting issues
//
function lintJavascript() {
	const tasks = LINT_SRC_PATHS.map(path => {
		const src = path.endsWith("/")
			? `${path}**/*.mjs`
			: path;

		const dest = path.endsWith("/")
			? path
			: `${path.split("/").slice(0, -1).join("/")}/`;

		return gulp
			.src(src)
			.pipe(eslint({ fix: true }))
			.pipe(eslint.format())
			.pipe(
				gulpIf(
					file => file.eslint != null && file.eslint.fixed,
					gulp.dest(dest)
				)
			);
	});

	return mergeStream(tasks);
}
export const lint = lintJavascript;

// Watch for file changes and lint when they do
//
export async function watchJavascriptUpdates() {
	gulp.watch(LINT_SRC_PATHS, gulp.parallel(lint, compile));
}
export const watchUpdates = watchJavascriptUpdates;
