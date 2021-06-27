import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class FalloutActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fallout", "sheet", "actor"],
      template: "systems/fallout/templates/actor/actor-sheet.html",
      width: 720,
      height: 780,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
    });
  }

  /** @override */
  get template() {
    return `systems/fallout/templates/actor/actor-${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();
    // Use a safe clone of the actor data for further operations.
    const actorData = context.actor.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character' || actorData.type == 'robot') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context)
      this._prepareItems(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'creature') {
      this._prepareItems(context)
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    //context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);
    context.FALLOUT = CONFIG.FALLOUT;

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.data.attributes)) {
      v.label = game.i18n.localize(CONFIG.FALLOUT.attributes[k]) ?? k;
    }

    let allInjuries = [];
    for (const [key, bp] of Object.entries(this.actor.data.data.body_parts)) {
      allInjuries.push.apply(allInjuries, bp.injuries);
    }
    context.treatedInjuriesCount = allInjuries.filter(i => i == 1).length;
    context.openInjuriesCount = allInjuries.filter(i => i == 2).length;

  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.

    const skills = [];
    const perks = [];
    const apparel = [];
    const weapons = [];
    const gear = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'skill') {
        skills.push(i);
      }
      // Append to skills.
      else if (i.type === 'perk') {
        perks.push(i);
      }
      else if (i.type === 'apparel') {
        apparel.push(i);
      }
      else if (i.type === 'weapon') {
        weapons.push(i);
      }
      else if (i.type === 'gear') {
        gear.push(i);
      }
    }

    // Assign and return
    context.gear = gear;
    skills.sort(function (a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    });
    context.skills = skills;
    context.perks = perks;
    //context.apparel = apparel;
    let clothing = apparel.filter(a => a.data.appareltype == 'clothing');
    let outfit = apparel.filter(a => a.data.appareltype == 'outfit');
    let headgear = apparel.filter(a => a.data.appareltype == 'headgear');
    let armor = apparel.filter(a => a.data.appareltype == 'armor');
    let powerArmor = apparel.filter(a => a.data.appareltype == 'powerArmor');
    //context.newApparel = apparel.filter(a => a.data.appareltype == '' || undefined);
    context.allApparel = [
      { apparelType: 'clothing', list: clothing },
      { apparelType: 'outfit', list: outfit },
      { apparelType: 'headgear', list: headgear },
      { apparelType: 'armor', list: armor },
      { apparelType: 'powerArmor', list: powerArmor }];

    context.weapons = weapons;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // ! SKILLS LISTENERS [clic, right-click, value change, tag ]
    // Click Skill Item
    html.find('.skill .item-name').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      this._onRollSkill(item.name, item.data.data.value, this.actor.data.data.attributes[item.data.data.defaultAttribute].value, item.data.data.tag);
    });
    // Change Skill Rank value
    html.find('.skill .item-skill-value input').change(async (ev) => {
      let newRank = parseInt($(ev.currentTarget).val());
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      let updatedItem = { _id: item.id, data: { value: newRank } };
      await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
    });
    // Toggle Tag value
    html.find('.skill .item-skill-tag').click(async (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      let updatedItem = { _id: item.id, data: { tag: !item.data.data.tag } };
      await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
    });
    let menuSkills = [
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Strength',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'str');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Perception',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'per');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Endurance',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'end');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Charisma',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'cha');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Intelligence',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'int');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Agility',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'agi');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Use Luck',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'luc');
        },
      }
    ];
    new ContextMenu(html.find(".skill"), null, menuSkills);
    // ! END SKILLS

    html.find(".expandable-info").click((event) => this._onItemSummary(event));

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    //Toggle Equip Inventory Item
    html.find(".item-toggle").click(async (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("item-id"));
      await this.actor.updateEmbeddedDocuments("Item", [this._toggleEquipped(li.data("item-id"), item)]);
    });

    // ! INJURIES
    html.find('.injury-mark').click(async (ev) => {
      let status = parseInt(ev.currentTarget.dataset["status"]);
      //if (status == 2)
      //return;
      let index = ev.currentTarget.dataset["index"];
      let bodypart = ev.currentTarget.dataset["bodypart"];
      let injuries = this.actor.data.data.body_parts[bodypart].injuries;
      let newInjuries = [...injuries];
      newInjuries[index] = status == 2 ? 0 : 2;
      //newInjuries[index] = 2;
      let newStatus = this._getBodyPartStatus(newInjuries);
      let _update = {};
      let _dataInjuries = `data.body_parts.${bodypart}.injuries`;
      let _dataStatus = `data.body_parts.${bodypart}.status`;
      _update[_dataInjuries] = newInjuries;
      _update[_dataStatus] = newStatus;
      console.log(_update);
      await this.actor.update(_update);
    });
    html.find('.injury-mark').contextmenu(async (ev) => {
      let status = parseInt(ev.currentTarget.dataset["status"]);
      //if (status == 0)
      //return;
      let index = ev.currentTarget.dataset["index"];
      let bodypart = ev.currentTarget.dataset["bodypart"];
      let injuries = this.actor.data.data.body_parts[bodypart].injuries;
      let newInjuries = [...injuries];
      newInjuries[index] = status == 1 ? 0 : 1;
      let newStatus = this._getBodyPartStatus(newInjuries);
      let _dataInjuries = `data.body_parts.${bodypart}.injuries`;
      let _dataStatus = `data.body_parts.${bodypart}.status`;
      let _update = {};
      _update[_dataInjuries] = newInjuries;
      _update[_dataStatus] = newStatus;
      await this.actor.update(_update);
    });
    // ! END INJURIES

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable attributes.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        if (li.classList.contains("skill")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }

    // !CRATURES


    // DON't LET NUMBER FIELDS EMPTY
    const numInputs = document.querySelectorAll('input[type=number]');
    numInputs.forEach(function (input) {
      input.addEventListener('change', function (e) {
        if (e.target.value == '') {
          e.target.value = 0
        }
      })
    });
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);

    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };

    console.warn(itemData)
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  _onRightClickSkill(itemId, attribute) {
    console.log(itemId);
    const item = this.actor.items.get(itemId);
    this._onRollSkill(item.name, item.data.data.value, this.actor.data.data.attributes[attribute].value, item.data.data.tag);
  }
  _onRollSkill(skillName, rank, attribute, tag) {
    game.fallout.Dialog2d20.createDialog({ rollName: skillName, diceNum: 2, attribute: attribute, skill: rank, tag: tag, complication: 20 })
  }

  _onItemSummary(event) {
    event.preventDefault();
    let li = $(event.currentTarget).parents(".item");
    let item = this.actor.items.get(li.data("itemId"));
    console.log(item);
    let description = item.data.data.description;
    // Toggle summary
    if (li.hasClass("expanded")) {
      let summary = li.children(".item-summary");
      summary.slideUp(200, () => {
        summary.remove();
      });
    } else {
      let div = $(
        `<div class="item-summary"><div class="item-summary-wrapper"><div>${description}</div></div></div>`
      );
      //$(div).find(".item-summary-wrapper").append(props);
      // div.append(props);
      li.append(div.hide());
      div.slideDown(200);
    }
    li.toggleClass("expanded");
  }

  _getBodyPartStatus(injuries) {
    let maxStatus = Math.max(...injuries);
    let newStatus = 'healthy';
    if (maxStatus == 1)
      newStatus = 'wounded';
    else if (maxStatus == 2)
      newStatus = 'crippled';
    return newStatus;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[roll] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData()).roll();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  // ON TOGGLE EQUIPPED
  //Toggle Equipment
  _toggleEquipped(id, item) {
    return {
      _id: id,
      data: {
        equipped: !item.data.data.equipped,
      },
    };
  }

}
