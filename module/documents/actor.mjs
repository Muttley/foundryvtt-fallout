
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class FalloutActor extends Actor {

  /** @override */
  prepareData() {
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

  // CHARACTER
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;
    const data = actorData.data;
    this._calculateCharacterBodyResistance(actorData);
    data.favoriteWeapons = actorData.items.filter(i => i.type == 'weapon' && i.data.data.favorite);
    // Encumbrance
    data.carryWeight.base = 150 + (parseInt(this.data.data.attributes.str.value) * 10);
    data.carryWeight.value = parseInt(data.carryWeight.base) + parseInt(data.carryWeight.mod);
    data.totalWeight = this._getItemsTotalWeight();
    data.encumbranceLevel = 0;
    if (data.totalWeight > data.carryWeight.value) {
      let dif = data.totalWeight - data.carryWeight.value;
      data.encumbranceLevel = Math.ceil(dif / 50);
    }
  }

  _calculateCharacterBodyResistance(actorData) {
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
        let pow = actorData.items.find(i => i.type == 'apparel' && i.data.data.appareltype == 'powerArmor' && i.data.data.equipped && i.data.data.powered && i.data.data.location[k] == true);
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
          outfitedLocations[k].name += ` over ${clothing.name}`;
          outfitedLocations[k].data.resistance.physical = Math.max(parseInt(outfitedLocations[k].data.resistance.physical), parseInt(clothing.data.data.resistance.physical));
          outfitedLocations[k].data.resistance.energy = Math.max(parseInt(outfitedLocations[k].data.resistance.energy), parseInt(clothing.data.data.resistance.energy));
          outfitedLocations[k].data.resistance.radiation = Math.max(parseInt(outfitedLocations[k].data.resistance.radiation), parseInt(clothing.data.data.resistance.radiation));
        } else if (!outfitedLocations[k] && v) {
          outfitedLocations[k] = duplicate(clothing.data.toObject());
        }
      }
    }

    // ! SET BODY PARTS TO OUTFIT ADD CHARACTER BONUSES
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
    // ADD OUTFITED LIST FOR DISPLAY
    actorData.data.outfitedLocations = outfitedLocations;
  }

  // ROBOT
  _prepareRobotData(actorData) {
    if (actorData.type !== 'robot') return;
    const data = actorData.data;
    this._calculateRobotBodyResistance(actorData);
    actorData.data.favoriteWeapons = actorData.items.filter(i => i.type == 'weapon' && i.data.data.favorite);
    actorData.data.equippedRobotMods = actorData.items.filter(i => i.type == 'robot_mod' && i.data.data.equipped).slice(0, 3);
    data.carryWeight.base = 150;
    let robotArmors = this.items.filter(i => { return i.type == 'robot_armor' });
    for (let i of robotArmors) {
      data.carryWeight.base += parseInt(i.data.data.carry);
    }
    data.carryWeight.value = parseInt(data.carryWeight.base) + parseInt(data.carryWeight.mod);
    data.totalWeight = this._getItemsTotalWeight();
    data.encumbranceLevel = 0;
    if (data.totalWeight > data.carryWeight.value) {
      let dif = data.totalWeight - data.carryWeight.value;
      data.encumbranceLevel = Math.ceil(dif / 50);
    }
  }

  _calculateRobotBodyResistance(actorData) {
    const data = actorData.data;
    let outfitedLocations = {};
    for (let [k, v] of Object.entries(game.system.model.Actor.robot.body_parts)) {
      outfitedLocations[k] = false;
    }

    // ADD ROBOT ARMOR
    for (let [k, v] of Object.entries(outfitedLocations)) {
      if (!v) {
        let armor = actorData.items.find(i => i.type == 'robot_armor' && i.data.data.appareltype == 'armor' && i.data.data.equipped && i.data.data.location[k] == true);
        if (armor && !outfitedLocations[k]) {
          outfitedLocations[k] = duplicate(armor.data.toObject());
        }
      }
    }
    // ADD PLATING AND RESISTANCE BONUSES
    let plating = actorData.items.find(i => i.type == 'robot_armor' && i.data.data.appareltype == 'plating' && i.data.data.equipped);
    if (plating) {
      for (let [k, v] of Object.entries(plating.data.data.location)) {
        if (outfitedLocations[k] && v) {
          outfitedLocations[k].name += ` over ${plating.name}`;
          outfitedLocations[k].data.resistance.physical = parseInt(outfitedLocations[k].data.resistance.physical) + parseInt(plating.data.data.resistance.physical);
          outfitedLocations[k].data.resistance.energy = parseInt(outfitedLocations[k].data.resistance.energy) + parseInt(plating.data.data.resistance.energy);
          outfitedLocations[k].data.resistance.radiation = parseInt(outfitedLocations[k].data.resistance.radiation) + parseInt(plating.data.data.resistance.radiation);
        } else if (!outfitedLocations[k] && v) {
          outfitedLocations[k] = duplicate(plating.data.toObject());
        }
      }
    }

    // ! SET BODY PARTS TO OUTFIT AND ADD CHARACTER BONUSES
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
    // ADD OUTFITED LIST FOR DISPLAY
    actorData.data.outfitedLocations = outfitedLocations;
  }

  // Calculate Total Weight Of Items
  _getItemsTotalWeight() {
    let physicalItems = this.items.filter(i => {
      return (!i.data.data.stashed && i.data.data.weight != null)
    });
    // remove powered powerArmor pieces for characters
    if (this.data.type == 'character') {
      physicalItems = physicalItems.filter(i => {
        if (i.data.data.appareltype == "powerArmor") {
          if (!i.data.data.powered)
            return i;
        } else {
          return i;
        }
      });
    }
    let physicalItemsMap = physicalItems.map(i => i.data.toObject());
    let totalWeight = 0;
    for (let i of physicalItemsMap) {
      totalWeight += parseInt(i.data.weight);
    }
    return totalWeight;

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
    await super._preCreate(data, options, user);

    // Setup Tokens
    if (this.type === 'character' || this.type === 'robot') {
      this.data.token.update({ vision: true, actorLink: true, disposition: 1 });
    }

    if (this.type === 'creature') {
      this.data.token.update({ disposition: -1 });
    }

    // Add Skills to Characters and Robots
    if (this.type === 'character' || this.type === 'robot') {
      let packSkills = await game.packs.get('fallout.skills').getDocuments();
      const items = this.items.map(i => i.toObject());
      packSkills.forEach(s => {
        items.push(s.toObject());
      });
      this.data.update({ items });
    }
  }

}