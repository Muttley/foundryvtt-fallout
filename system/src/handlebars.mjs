// import { FALLOUT } from "./config.mjs"
export const registerHandlebarsHelpers = function() {
	/* -------------------------------------------- */
	/*  GENERAL HELPERS                             */
	/* -------------------------------------------- */
	Handlebars.registerHelper("concat", function() {
		let outStr = "";
		for (let arg in arguments) {
			if (typeof arguments[arg] != "object") {
				outStr += arguments[arg];
			}
		}
		return outStr;
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
		if (str === "physical") return "fas fa-fist-raised";
		else if (str === "energy") return "fas fa-bolt";
		else if (str === "radiation") return "fas fa-radiation";
		else if (str === "poison") return "fas fa-biohazard";
	});

	Handlebars.registerHelper("fromConfig", function(arg1, arg2) {
		return CONFIG.FALLOUT[arg1][arg2] ? CONFIG.FALLOUT[arg1][arg2] : arg2;
	});

	Handlebars.registerHelper("isCreaturesWeapon", function(weapon) {
		const isCreatureAttack = weapon.system.weaponType === "creatureAttack";
		const isCreature = weapon.actor?.type === "creature";

		return (isCreatureAttack || isCreature);
	});

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

	Handlebars.registerHelper("getWpnQListAsString", function(weapon) {
		if (weapon.type !== "weapon") return "";

		let str = "";
		let title = "<strong>Weapon Qualities</strong>:";
		let content = "";
		for (let wq in weapon.system.damage.weaponQuality) {
			if (weapon.system.damage.weaponQuality[wq].value) {
				let qualitydescription = fallout.FalloutHovers.LIST[wq].toLowerCase();
				content += `&nbsp;<span title="${qualitydescription}">${weapon.system.damage.weaponQuality[wq].label}</span>,`;
			}
		}
		if (content) {
			str = title + content;
			str = str.slice(0, -1);
		}
		else {
			str = `${title} none`;
		}
		return str;
	});

};
