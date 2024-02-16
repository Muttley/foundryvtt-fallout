export default function registerTextEditorEnrichers() {
	CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
		{
			pattern: /@fos\[(.+?)\]/gm,
			enricher: async (match, options) => {
				const span = document.createElement("span");
				span.style.fontFamily = "fallout";
				if (match[1] === "DC") {
					span.innerHTML = "";
				}
				else if (match[1] === "PH") {
					span.innerHTML = "";
				}
				else if (match[1] === "EN") {
					span.innerHTML = "";
				}
				else if (match[1] === "PO") {
					span.innerHTML = "";
				}
				else if (match[1] === "RA") {
					span.innerHTML = "";
				}
				return span;
			},
		},
		{
			pattern: /(\+\d+)CD/gm,
			enricher: async (match, options) => {
				const outerSpan = document.createElement("span");
				outerSpan.innerHTML = `${match[1]}&nbsp;`;

				const span = document.createElement("span");
				span.style.fontFamily = "fallout";
				span.innerHTML = "";

				outerSpan.appendChild(span);

				return outerSpan;
			},
		},
	]);
}
