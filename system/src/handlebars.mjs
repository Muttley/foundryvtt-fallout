export default function registerHandlebarsHelpers() {
	/* -------------------------------------------- */
	/*  GENERAL HELPERS                             */
	/* -------------------------------------------- */
	Handlebars.registerHelper("activeEffectIcon", effect => {
		return fallout.utils.foundryMinVersion(12)
			? effect.img
			: effect.icon;
	});

	Handlebars.registerHelper("concat", function() {
		let outStr = "";
		for (let arg in arguments) {
			if (typeof arguments[arg] != "object") {
				outStr += arguments[arg];
			}
		}
		return outStr;
	});

	Handlebars.registerHelper("listDamageEffects", function(effects) {
		const elements = [];

		for (const key in effects) {
			if (!CONFIG.FALLOUT.DAMAGE_EFFECTS.hasOwnProperty(key)) continue;

			const effect = effects[key];

			if (!effect.value) continue;

			let effectName = CONFIG.FALLOUT.DAMAGE_EFFECTS[key];
			if (effect.rank > 0) effectName += ` ${effect.rank}`;

			const tooltip = CONFIG.FALLOUT.DAMAGE_EFFECT_TOOLTIPS[key];

			const resultHtml = document.createElement("span");
			resultHtml.classList.add("effect", "hover");
			resultHtml.dataset.key = key;
			resultHtml.dataset.tooltip = tooltip;
			resultHtml.innerHTML = effectName;

			elements.push(resultHtml.outerHTML);
		}

		let listString = "";

		if (elements.length > 0) {
			listString = elements.join(",&nbsp;");
		}
		else {
			listString = "&mdash;";
		}

		return listString;
	});

	Handlebars.registerHelper("listWeaponQualities", function(qualities) {
		const elements = [];

		for (const key in qualities) {
			if (!CONFIG.FALLOUT.WEAPON_QUALITIES.hasOwnProperty(key)) continue;

			const quality = qualities[key];

			if (!quality.value) continue;

			let qualityName = CONFIG.FALLOUT.WEAPON_QUALITIES[key];
			if (quality.rank > 0) qualityName += ` ${quality.rank}`;

			const tooltip = CONFIG.FALLOUT.WEAPON_QUALITY_TOOLTIPS[key];

			const resultHtml = document.createElement("span");
			resultHtml.classList.add("effect", "hover");
			resultHtml.dataset.key = key;
			resultHtml.dataset.tooltip = tooltip;
			resultHtml.innerHTML = qualityName;

			elements.push(resultHtml.outerHTML);
		}

		let listString = "";

		if (elements.length > 0) {
			listString = elements.join(",&nbsp;");
		}
		else {
			listString = "&mdash;";
		}

		return listString;
	});

	Handlebars.registerHelper("toLowerCase", function(str) {
		return str.toLowerCase();
	});

	Handlebars.registerHelper("toUpperCase", function(str) {
		return str.toUpperCase();
	});

	Handlebars.registerHelper("subString", function(str, s, e) {
		return str.substring(s, e);
	});

	Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
		switch (operator) {
			case "==":
				// eslint-disable-next-line eqeqeq
				return v1 == v2 ? options.fn(this) : options.inverse(this);
			case "===":
				return v1 === v2 ? options.fn(this) : options.inverse(this);
			case "!=":
				// eslint-disable-next-line eqeqeq
				return v1 != v2 ? options.fn(this) : options.inverse(this);
			case "!==":
				return v1 !== v2 ? options.fn(this) : options.inverse(this);
			case "<":
				return v1 < v2 ? options.fn(this) : options.inverse(this);
			case "<=":
				return v1 <= v2 ? options.fn(this) : options.inverse(this);
			case ">":
				return v1 > v2 ? options.fn(this) : options.inverse(this);
			case ">=":
				return v1 >= v2 ? options.fn(this) : options.inverse(this);
			case "&&":
				return v1 && v2 ? options.fn(this) : options.inverse(this);
			case "||":
				return v1 || v2 ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
		}
	});

	Handlebars.registerHelper("math", function(
		lvalue,
		operator,
		rvalue,
		options
	) {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);
		return {
			"+": lvalue + rvalue,
			"-": lvalue - rvalue,
			"*": lvalue * rvalue,
			"/": lvalue / rvalue,
			"%": lvalue % rvalue,
		}[operator];
	});

	/* -------------------------------------------- */
	/*  FALLOUT HELPERS                             */
	/* -------------------------------------------- */

	Handlebars.registerHelper("damageFaIconClass", function(str) {
		switch (str) {
			case "physical":
				return "fas fa-fist-raised";
			case "energy":
				return "fas fa-bolt";
			case "radiation":
				return "fas fa-radiation";
			case "poison":
				return "fas fa-biohazard";
			default:
				return "";
		}
	});

	Handlebars.registerHelper("fromConfig", function(arg1, arg2) {
		return CONFIG.FALLOUT[arg1][arg2] ? CONFIG.FALLOUT[arg1][arg2] : arg2;
	});

	Handlebars.registerHelper("fromSettings", function(arg1) {
		return game.settings.get(SYSTEM_ID, arg1);
	});

	// Handlebars.registerHelper("incrementCounter", function(counter) {
	// 	return ++counter;
	// });

	// Handlebars.registerHelper("isCreaturesWeapon", function(weapon) {
	// 	const isCreatureAttack = weapon.system.weaponType === "creatureAttack";
	// 	const isCreature = weapon.actor?.type === "creature";

	// 	return (isCreatureAttack || isCreature);
	// });

	Handlebars.registerHelper("isWeaponUsingMeleeBonus", function(weapon, actor) {
		if ((weapon.system.weaponType === "unarmed" || weapon.system.weaponType === "meleeWeapons") &&  actor?.type !== "creature") {
			return true;
		}
		else {
			return false;
		}
	});

	Handlebars.registerHelper("isWeaponDamaged", function(weapon) {
		if (!weapon.tear) return false;
		else return true;
	});

	// * Use with #if
	// {{#if (or
	// (eq section1 "foo")
	// (ne section2 "bar"))}}e
	// .. content
	// {{/if}}
	Handlebars.registerHelper({
		eq: (v1, v2) => v1 === v2,
		ne: (v1, v2) => v1 !== v2,
		lt: (v1, v2) => v1 < v2,
		gt: (v1, v2) => v1 > v2,
		lte: (v1, v2) => v1 <= v2,
		gte: (v1, v2) => v1 >= v2,
		and() {
			return Array.prototype.every.call(arguments, Boolean);
		},
		or() {
			return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
		},
	});

	Handlebars.registerHelper("enrichHtmlHelper", function(rawText) {
		return TextEditor.enrichHTML(rawText, {async: false});
	});

	// coloring input fields
	Handlebars.registerHelper("colorIfValue", function(num, compare, color, color2) {
		return num === compare
			? `color:#${color};`
			: `color:#${color2};`;
	});

	Handlebars.registerHelper("levelPadding", function(level) {
		let str = "";
		for (let i = 0; i < level; i++) {
			str += "&nbsp;&nbsp;&nbsp;&nbsp;";
		}
		return str;
	});

	Handlebars.registerHelper("select", function(selected, options) {
		const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected));
		const rgx = new RegExp(` value=["']${escapedValue}["']`);
		const html = options.fn(this);
		return html.replace(rgx, "$& selected");
	});

}
