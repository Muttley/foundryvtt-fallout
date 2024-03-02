export default function registerTextEditorEnrichers() {
	CONFIG.TextEditor.enrichers = CONFIG.TextEditor.enrichers.concat([
		{
			pattern: /@fos\[(.+?)\]/gm,
			enricher: async (match, options) => {
				const i = document.createElement("i");

				switch (match[1]) {
					case "CD":
					case "DC":
						i.classList.add("fo-pip-boy");
						break;
					case "CDC":
					case "DCC":
						i.classList.add("fo-pip-boy", "fo-blue");
						break;
					case "EN":
						i.classList.add("fo-energy");
						break;
					case "PH":
						i.classList.add("fo-physical");
						break;
					case "PO":
						i.classList.add("fo-poison");
						break;
					case "RA":
						i.classList.add("fo-radiation");
						break;
				}

				return i;
			},
		},
		{
			pattern: /((\+|-)?\d+)?\s?D?(CD|DC)[CD]?/g,
			enricher: async (match, options) => {
				const i = document.createElement("i");
				i.classList.add("fo-pip-boy");

				const outerSpan = document.createElement("span");
				if (match[1]) {
					outerSpan.innerHTML = `${match[1]}&nbsp;`;
					outerSpan.appendChild(i);
				}
				else {
					outerSpan.innerHTML = "&nbsp;";
					outerSpan.appendChild(i);
				}
				return outerSpan;
			},
		},
	]);
}
