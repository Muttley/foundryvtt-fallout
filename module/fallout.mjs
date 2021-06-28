// Import document classes.
import { FalloutActor } from "./documents/actor.mjs";
import { FalloutItem } from "./documents/item.mjs";
// Import sheet classes.
import { FalloutActorSheet } from "./sheets/actor-sheet.mjs";
import { FalloutItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { FALLOUT } from "./helpers/config.mjs";
//Import Roll2D20
import { Roller2D20 } from "./roller/fo2d20-roller.mjs"
import { Dialog2d20 } from './roller/dialog2d20.js'
import { DialogD6 } from './roller/DialogD6.js'

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.fallout = {
    FalloutActor,
    FalloutItem,
    rollItemMacro,
    Roller2D20,
    Dialog2d20,
    DialogD6
  };

  // Add custom constants for configuration.
  CONFIG.FALLOUT = FALLOUT;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @attributes.dex.mod",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = FalloutActor;
  CONFIG.Item.documentClass = FalloutItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("fallout", FalloutActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("fallout", FalloutItemSheet, { makeDefault: true });

  //CONFIG.Dice.terms["b"] = FalloutDcDie;

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
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
  console.warn(weapon)
  if ((weapon.data.weaponType == "unarmed" || weapon.data.weaponType == "meleeWeapons") && actor?.type != "creature")
    return true;
  else
    return false;
});




/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

Hooks.on('renderChatMessage', (message, html, data) => {
  let rrlBtn = html.find('.reroll-button');
  if (rrlBtn.length > 0) {
    rrlBtn[0].setAttribute('data-messageId', message.id);
    rrlBtn.click((el) => {
      let selectedDiceForReroll = $(el.currentTarget).parent().find('.dice-selected');
      let rerollIndex = [];
      for (let d of selectedDiceForReroll) {
        rerollIndex.push($(d).data('index'));
      }
      if (!rerollIndex.length) {
        ui.notifications.notify('Select Dice you want to Reroll');
      }
      else {
        let falloutRoll = message.data.flags.falloutroll;
        if (falloutRoll.diceFace == "d20") {
          Roller2D20.rerollD20({
            rollname: falloutRoll.rollname,
            rerollIndexes: rerollIndex,
            successTreshold: falloutRoll.successTreshold,
            critTreshold: falloutRoll.critTreshold,
            complicationTreshold: falloutRoll.complicationTreshold,
            dicesRolled: falloutRoll.dicesRolled
          });
        } else if (falloutRoll.diceFace == "d6") {
          Roller2D20.rerollD6({
            rollname: falloutRoll.rollname,
            rerollIndexes: rerollIndex,
            dicesRolled: falloutRoll.dicesRolled
          });
        } else {
          ui.notifications.notify('No dice face reckognized');
        }

      }
    })
  }
  html.find('.dice-icon').click((el) => {
    if ($(el.currentTarget).hasClass('reroll'))
      return;
    if ($(el.currentTarget).hasClass('dice-selected')) {
      $(el.currentTarget).removeClass('dice-selected');
    } else {
      $(el.currentTarget).addClass('dice-selected')
    }
  })
})

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.fallout.rollItemMacro("${item.name}");`;
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "fallout.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}

// ! DICE SO NICE

Hooks.once("diceSoNiceReady", (dice3d) => {
  dice3d.addSystem(
    { id: "fallout", name: "Fallout 2d20" },
    true
  );
  dice3d.addDicePreset({
    type: "d6",
    labels: [
      "systems/fallout/assets/dice/d1.webp",
      "systems/fallout/assets/dice/d2.webp",
      "systems/fallout/assets/dice/d3.webp",
      "systems/fallout/assets/dice/d4.webp",
      "systems/fallout/assets/dice/d5.webp",
      "systems/fallout/assets/dice/d6.webp",
    ],
    system: "fallout",
  });
  dice3d.addColorset(
    {
      name: "fallout",
      description: "Fallout 2d20",
      category: "Colors",
      foreground: "#fcef71",
      background: "#008cd1",
      outline: "gray",
      texture: "none",
    },
    "force"
  );
});


