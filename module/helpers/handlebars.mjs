//import { FALLOUT } from "./config.mjs"
export const registerHandlebarsHelpers = function () {

    /* -------------------------------------------- */
    /*  GENERAL HELPERS                             */
    /* -------------------------------------------- */
    Handlebars.registerHelper('concat', function () {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('toLowerCase', function (str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper('toUpperCase', function (str) {
        return str.toUpperCase();
    });

    Handlebars.registerHelper('subString', function (str, s, e) {
        return str.substring(s, e);
    });

    Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
        switch (operator) {
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "!=":
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

    Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

    /* -------------------------------------------- */
    /*  FALLOUT HELPERS                             */
    /* -------------------------------------------- */

    Handlebars.registerHelper('damageFaIconClass', function (str) {
        if (str == "physical")
            return "fas fa-fist-raised";
        else if (str == "energy")
            return "fas fa-bolt";
        else if (str == "radiation")
            return "fas fa-radiation";
        else if (str == "poison")
            return "fas fa-biohazard";
    });

    Handlebars.registerHelper('getBodypartValue', function (str) {
        return CONFIG.FALLOUT.BodyValues[str];
    });

    Handlebars.registerHelper('isCreaturesWeapon', function (weapon) {
        if (weapon.data.data.weaponType == "creatureAttack" || weapon.actor?.type == "creature")
            return true;
        else
            return false;
    });

    Handlebars.registerHelper('isWeaponUsingMeleeBonus', function (weapon, actor) {
        if ((weapon.data.weaponType == "unarmed" || weapon.data.weaponType == "meleeWeapons") && actor?.type != "creature")
            return true;
        else
            return false;
    });

    // * Use with #if
    // {{#if (or 
    // (eq section1 "foo")
    //(ne section2 "bar"))}}
    //.. content
    //{{/if}}
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
        }
    });
}