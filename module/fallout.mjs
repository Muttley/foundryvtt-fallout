// Import document classes.
import { FalloutActor } from "./documents/actor.mjs";
import { FalloutItem } from "./documents/item.mjs";
// Import sheet classes.
import { FalloutActorSheet } from "./sheets/actor-sheet.mjs";
import { FalloutItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { FALLOUT } from "./helpers/config.mjs";
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./helpers/handlebars.mjs"
//Import Roll2D20
import { Roller2D20 } from "./roller/fo2d20-roller.mjs"
import { Dialog2d20 } from './roller/dialog2d20.js'
import { DialogD6 } from './roller/dialogD6.js'
//AP traker
import { registerSettings } from './settings.js';
import { APTracker } from './ap/ap-tracker.mjs'
//Dice
import {DieFalloutDamage} from './roller/damageDie.js'



/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
registerHandlebarsHelpers();

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
    formula: "@initiative.value",
    decimals: 0
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = FalloutActor;
  CONFIG.Item.documentClass = FalloutItem;

  // Register custom system settings
  registerSettings();

  CONFIG.Dice.terms["c"] = DieFalloutDamage;

  Die.MODIFIERS["ef"] = function minResult(modifier) {
    this.results = this.results.flatMap(result => {
        if (result.result < 5) {
            result.active = false;
            result.discarded = true;
        } 
        DiceTerm._applyCount(this.results, '>', 4, {flagSuccess: true});
        return [result];
    });
  }
  Die.MODIFIERS["sum"] = function minResult(modifier) {
    this.results = this.results.flatMap(result => {
        if (result.result == 1 || result.result == 5 || result.result == 6) {
            result.active = true;
            result.discarded = false;
            result.success = true;
            result.count = 1;
        }
        else if (result.result == 2) {
          result.active = true;
          result.discarded = false;
          result.success = true;
          result.count = 2;
        }
        else{
            result.active = true;
            result.discarded = true;
            result.success = false;
            result.count = 0;
        }

        //DiceTerm._applyCount(this.results, '>', 4, {flagSuccess: true});
        return [result];
    });
  }

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("fallout", FalloutActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("fallout", FalloutItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();



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
      //let selectedDiceForReroll = $(el.currentTarget).parent().find('.dice-selected');
      let selectedDiceForReroll = html.find('.dice-selected');
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
            dicesRolled: falloutRoll.dicesRolled,
            weapon: message.data.flags.weapon
          });
        } else {
          ui.notifications.notify('No dice face reckognized');
        }

      }
    })
  }
  html.find('.dice-icon').click((el) => {
    //if ($(el.currentTarget).hasClass('reroll'))
    //return;
    if ($(el.currentTarget).hasClass('dice-selected')) {
      $(el.currentTarget).removeClass('dice-selected');
    } else {
      $(el.currentTarget).addClass('dice-selected')
    }
  });
  let addBtn = html.find('.add-button');
  if (addBtn.length > 0) {
    addBtn[0].setAttribute('data-messageId', message.id);
    addBtn.click((ev) => {
      let falloutRoll = message.data.flags.falloutroll;
      let weapon = message.data.flags.weapon;
      game.fallout.DialogD6.createDialog({ rollname: falloutRoll.rollname, diceNum: 1, falloutRoll: falloutRoll, weapon: weapon })
    });
  }

});



/* -------------------------------------------- */
/*  Omit Specific Items on Specific Actors      */
/* -------------------------------------------- */
Hooks.on("preCreateItem", (_item) => {
  if (_item.parent) {
    // PERKS AND SPECIAL ABILITIES
    if ((_item.parent.type != "npc" && _item.parent.type != "creature") && _item.type == "special_ability") {
      ui.notifications.warn(`ONLY NPCs AND CREATURES CAN HAVE SPECIAL ABILITIES`);
      return false;
    }
    if ((_item.parent.type != "character" && _item.parent.type != "robot") && _item.type == "perk") {
      ui.notifications.warn(`ONLY PLAYERS CAN HAVE PERKS`);
      return false;
    }
  }
});

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
  if (data.type == "Item") {
    ui.notifications.notify('Adding Item Macro: This feature is to be added in the future');
    return;
  }

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
  ui.notifications.notify('To be added in the future');
  // const speaker = ChatMessage.getSpeaker();
  // let actor;
  // if (speaker.token) actor = game.actors.tokens[speaker.token];
  // if (!actor) actor = game.actors.get(speaker.actor);
  // const item = actor ? actor.items.find(i => i.name === itemName) : null;
  // if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);
  // return item.roll();
}

/* -------------------------------------------- */
/*  DICE SO NICE                                */
/* -------------------------------------------- */

Hooks.once("diceSoNiceReady", (dice3d) => {
  dice3d.addSystem(
    { id: "fallout", name: "Fallout 2d20" },
    true
  );
  
  dice3d.addColorset(
    {
      name: "fallout",
      description: "Fallout 2d20",
      category: "Colors",
      foreground: "#fcef71",
      background: "#008cd1",
      outline: "gray",
      texture: "none",
    }
  );

  dice3d.addDicePreset({
    type:"dc",
    labels:[
      "systems/fallout/assets/dice/d1.webp",
      "systems/fallout/assets/dice/d2.webp",
      "systems/fallout/assets/dice/d3.webp",
      "systems/fallout/assets/dice/d4.webp",
      "systems/fallout/assets/dice/d5.webp",
      "systems/fallout/assets/dice/d6.webp",
    ],
    system:"fallout",
    colorset:"fallout"
  });


});


