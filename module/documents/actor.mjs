
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class FalloutActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.fallout || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareRobotData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;
    const data = actorData.data;
    this._calculateBodyResistance(actorData);
  }

  _prepareRobotData(actorData) {
    if (actorData.type !== 'robot') return;
    const data = actorData.data;
    //this._calculateBodyResistance(actorData);
  }

  _calculateBodyResistance(actorData) {
    const data = actorData.data;
    //  ! CHECK for the OUTFIT
    // Prep Body Locations
    let outfitedLocations = {};
    for (let [k, v] of Object.entries(game.system.model.Actor.character.body_parts)) {
      outfitedLocations[k] = false;
    }

    // ! CHECK POWER ARMOR PIECES
    let hasPowerArmor = false;
    for (let [k, v] of Object.entries(outfitedLocations)) {
      if (!v) {
        let pow = actorData.items.find(i => i.type == 'apparel' && i.data.data.appareltype == 'powerArmor' && i.data.data.equipped && i.data.data.location[k] == true);
        if (pow && !outfitedLocations[k]) {
          outfitedLocations[k] = duplicate(pow.data.toObject());
          hasPowerArmor = false;
        }
      }
    }

    // ! CHECK ARMOR PIECES
    let hasArmor = false;
    for (let [k, v] of Object.entries(outfitedLocations)) {
      if (!v) {
        let armor = actorData.items.find(i => i.type == 'apparel' && i.data.data.appareltype == 'armor' && i.data.data.equipped && i.data.data.location[k] == true);
        if (armor && !outfitedLocations[k]) {
          outfitedLocations[k] = duplicate(armor.data.toObject());
          hasArmor = true;
        }
      }
    }

    // ! CHECK OUTFIT
    if (!outfitedLocations['torso'] && !outfitedLocations['armR'] && !outfitedLocations['armL'] && !outfitedLocations['legL'] && !outfitedLocations['legR']) {
      let outfit = actorData.items.find(i => i.type == 'apparel' && i.data.data.appareltype == 'outfit' && i.data.data.equipped);
      if (outfit) {
        for (let [k, v] of Object.entries(outfit.data.data.location)) {
          if (v) {
            outfitedLocations[k] = duplicate(outfit.data.toObject());
          }
        }
      }
    }

    // ! CHECK HEADGEAR
    if (!outfitedLocations['head']) {
      let headgear = actorData.items.find(i => i.type == 'apparel' && i.data.data.appareltype == 'headgear' && i.data.data.equipped);
      if (headgear) {
        outfitedLocations['head'] = duplicate(headgear.data.toObject());
      }
    }

    // ! ADD CLOTHING VALUES
    let clothing = actorData.items.find(i => i.type == 'apparel' && i.data.data.appareltype == 'clothing' && i.data.data.equipped);
    if (clothing) {
      for (let [k, v] of Object.entries(clothing.data.data.location)) {
        if (outfitedLocations[k] && v) {
          outfitedLocations[k].name += ` with ${clothing.name}`;
          outfitedLocations[k].data.resistance.physical = parseInt(outfitedLocations[k].data.resistance.physical) + parseInt(clothing.data.data.resistance.physical);
          outfitedLocations[k].data.resistance.energy = parseInt(outfitedLocations[k].data.resistance.energy) + parseInt(clothing.data.data.resistance.energy);
          outfitedLocations[k].data.resistance.radiation = parseInt(outfitedLocations[k].data.resistance.radiation) + parseInt(clothing.data.data.resistance.radiation);
        } else if (!outfitedLocations[k] && v) {
          outfitedLocations[k] = duplicate(clothing.data.toObject());
        }
      }
    }

    // ! ADD CHARACTER BONUSES
    for (let [k, bodyPart] of Object.entries(actorData.data.body_parts)) {
      if (outfitedLocations[k]) {
        bodyPart.resistance.physical = parseInt(outfitedLocations[k].data.resistance.physical) + parseInt(data.resistance.physical);
        bodyPart.resistance.energy = parseInt(outfitedLocations[k].data.resistance.energy) + parseInt(data.resistance.energy);
        bodyPart.resistance.radiation = parseInt(outfitedLocations[k].data.resistance.radiation) + parseInt(data.resistance.radiation);
      } else {
        bodyPart.resistance.physical = parseInt(data.resistance.physical);
        bodyPart.resistance.energy = parseInt(data.resistance.energy);
        bodyPart.resistance.radiation = parseInt(data.resistance.radiation);
      }
    }

  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
    data.xp = (data.cr * data.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character' || this.data.type !== 'robot') return;
    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.level) {
      data.lvl = data.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

  async _preCreate(data, options, user) {
    // Add Skills to Characters and Robots
    if (this.data.type !== 'npc') {
      await super._preCreate(data, options, user);
      let packSkills = await game.packs.get('fallout.skills').getDocuments();
      const items = this.items.map(i => i.toObject());
      packSkills.forEach(s => {
        items.push(s.toObject());
      });
      this.data.update({ items });
    }

    //const item = new CONFIG.Item.documentClass({name: 'Foo', type: 'feat'});

    //items.push(item.toObject());
    //this.data.update({ items });
  }

}