import { onManageActiveEffect, prepareActiveEffectCategories } from "../helpers/effects.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class FalloutItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["fallout", "sheet", "item"],
      width: 520,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/fallout/templates/item";
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    // Retrieve base data structure.
    const context = await super.getData(options);
    const item = context.item;
    const source = item.toObject();

    foundry.utils.mergeObject(context, {
      source: source.system,
      system: item.system,
      isEmbedded: item.isEmbedded,
      type: item.type,
      flags: item.flags,
      FALLOUT: CONFIG.FALLOUT,
      effects: prepareActiveEffectCategories(item.effects),
      descriptionHTML: await TextEditor.enrichHTML(item.system.description, {
        secrets: item.isOwner,
        async: true
      })
    });

    // Enrich Mods Text
    if(item.system.mods){
      foundry.utils.mergeObject(context,{
        modsListHTML: await TextEditor.enrichHTML(item.system.mods.list, {
          secrets: item.isOwner,
          async: true
        })
      })
    }

    // Enrich Effect Text
    if(item.system.effect){
      foundry.utils.mergeObject(context,{
        effectHTML: await TextEditor.enrichHTML(item.system.effect, {
          secrets: item.isOwner,
          async: true
        })
      })
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Weapon Qualities Toggle
    html.find(".wpn-tag-toggler").click(async (ev) => {
      let tagEl = $(ev.currentTarget).parent('.wpn-tag');
      let tagKey = tagEl.data('tagKey');
      let tagValue = !tagEl.data('tagValue');
      tagEl.data('tagValue', tagValue);
      let tagType = tagEl.data('tagType');
      let itemId = this.document.data._id;
      let flagKey = "";
      if (tagType == 'weaponQuality')
        flagKey = 'weaponQualities';
      else if (tagType == 'damageEffect')
        flagKey = 'damageEffects';
      let flags = duplicate(this.item.getFlag('fallout', flagKey));
      let box = tagEl.parent('.item-list');
      $(box.children()).each((q, i) => {
        let qu = flags[$(i).data('tagKey')];
        qu['value'] = $(i).data('tagValue');
      });
      await this.item.setFlag('fallout', flagKey, flags);
    });

    // Tag Rank Change
    html.find(".wpn-tag-rank").change(async (ev) => {
      let newRank = $(ev.currentTarget).val();
      let tagEl = $(ev.currentTarget).parent('.wpn-tag');
      let tagKey = tagEl.data('tagKey');
      let tagType = tagEl.data('tagType');
      //let itemId = this.document.data._id;
      //let wpn = game.items.get(itemId);
      let flagKey = "";
      if (tagType == 'weaponQuality')
        flagKey = 'weaponQualities';
      else if (tagType == 'damageEffect')
        flagKey = 'damageEffects';
      let flags = duplicate(this.item.getFlag('fallout', flagKey));
      let box = tagEl.parent('.item-list');
      $(box.children()).each((q, i) => {
        let qu = flags[$(i).data('tagKey')];
        if (qu['rank'] != null)
          qu['rank'] = newRank;
      });
      await this.item.setFlag('fallout', flagKey, flags);
    });

    // Effects.
    html.find(".effect-control").click(ev => {
      if (this.item.isOwned) return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.")
      onManageActiveEffect(ev, this.item)
    });

    // Send To Chat
    html.find('.chaty').click(ev=>{
      this.item.sendToChat();
    })

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
}
