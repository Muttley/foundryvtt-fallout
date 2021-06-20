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
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    //context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

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
      console.log(k, v);
      v.label = game.i18n.localize(CONFIG.FALLOUT.attributes[k]) ?? k;
    }
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
    const gear = [];
    const skills = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to skills.
      else if (i.type === 'skill') {
        skills.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.data.spellLevel != undefined) {
          spells[i.data.spellLevel].push(i);
        }
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


    context.spells = spells;
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
        name: 'Roll With STR',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'str');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Roll With PER',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'per');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Roll With END',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'end');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Roll With CHA',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'cha');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Roll With INT',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'int');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Roll With AGI',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'agi');
        },
      },
      {
        icon: '<i class="fas fa-dice"></i>',
        name: 'Roll With LUC',
        callback: (t) => {
          this._onRightClickSkill(t.data("itemId"), 'luc');
        },
      }
    ];
    new ContextMenu(html.find(".skill"), null, menuSkills);

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable attributes.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.owner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        if (li.classList.contains("skill")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
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

}
