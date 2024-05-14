const perks = await fallout.compendiums.perks();

const config = {};
const i18n = [];

for (const perk of perks) {
	const key = perk.name.toLowerCase().match(/[a-z\.\s]+/)[0].replaceAll(" ", "_").replaceAll(".", "");
	const i18nKey = `FALLOUT.PERKS.${key}`;
	config[key] = i18nKey;
	i18n.push(`${i18nKey}: ${perk.name}`);
}

console.log(config);
console.log(i18n);
