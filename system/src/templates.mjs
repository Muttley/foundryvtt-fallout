
/**
 * Define a set of template paths to pre-load.
 *
 * Pre-loaded templates are compiled and cached for fast access when rendering
 *
 * @export
 * @async
 * @returns {Promise}
 */
export default async function preloadHandlebarsTemplates() {
	const partials = [
		"systems/fallout/templates/actor/_shared-partials/ammo.hbs",
		"systems/fallout/templates/actor/_shared-partials/biography.hbs",
		"systems/fallout/templates/actor/_shared-partials/data-tab.hbs",
		"systems/fallout/templates/actor/_shared-partials/effects-tab.hbs",
		"systems/fallout/templates/actor/_shared-partials/header.hbs",
		"systems/fallout/templates/actor/_shared-partials/material.hbs",
		"systems/fallout/templates/actor/_shared-partials/materials.hbs",
		"systems/fallout/templates/actor/_shared-partials/simple-expandable-item.hbs",
		"systems/fallout/templates/actor/_shared-partials/weapons.hbs",
		"systems/fallout/templates/actor/npc/partials/attacks.hbs",
		"systems/fallout/templates/actor/npc/partials/attributes_creature.hbs",
		"systems/fallout/templates/actor/npc/partials/attributes_npc.hbs",
		"systems/fallout/templates/actor/npc/partials/body.hbs",
		"systems/fallout/templates/actor/npc/partials/butchery.hbs",
		"systems/fallout/templates/actor/npc/partials/carried-weight_creature.hbs",
		"systems/fallout/templates/actor/npc/partials/carried-weight_npc.hbs",
		"systems/fallout/templates/actor/npc/partials/carry-weight.hbs",
		"systems/fallout/templates/actor/npc/partials/defense.hbs",
		"systems/fallout/templates/actor/npc/partials/hp.hbs",
		"systems/fallout/templates/actor/npc/partials/initiative.hbs",
		"systems/fallout/templates/actor/npc/partials/inventory.hbs",
		"systems/fallout/templates/actor/npc/partials/material.hbs",
		"systems/fallout/templates/actor/npc/partials/melee-bonus.hbs",
		"systems/fallout/templates/actor/npc/partials/settlement.hbs",
		"systems/fallout/templates/actor/npc/partials/skills.hbs",
		"systems/fallout/templates/actor/npc/partials/special-abilities.hbs",
		"systems/fallout/templates/actor/npc/tabs/abilities.hbs",
		"systems/fallout/templates/actor/npc/tabs/butchery.hbs",
		"systems/fallout/templates/actor/npc/tabs/gear.hbs",
		"systems/fallout/templates/actor/npc/tabs/special-abilities.hbs",
		"systems/fallout/templates/actor/pc/partials/addictions.hbs",
		"systems/fallout/templates/actor/pc/partials/apparel-item-row.hbs",
		"systems/fallout/templates/actor/pc/partials/apparel.hbs",
		"systems/fallout/templates/actor/pc/partials/attributes.hbs",
		"systems/fallout/templates/actor/pc/partials/body-location-status.hbs",
		"systems/fallout/templates/actor/pc/partials/conditions.hbs",
		"systems/fallout/templates/actor/pc/partials/currency.hbs",
		"systems/fallout/templates/actor/pc/partials/derived.hbs",
		"systems/fallout/templates/actor/pc/partials/diseases.hbs",
		"systems/fallout/templates/actor/pc/partials/encumbrance.hbs",
		"systems/fallout/templates/actor/pc/partials/favorite-weapons.hbs",
		"systems/fallout/templates/actor/pc/partials/health.hbs",
		"systems/fallout/templates/actor/pc/partials/injuries.hbs",
		"systems/fallout/templates/actor/pc/partials/inventory-block.hbs",
		"systems/fallout/templates/actor/pc/partials/perks.hbs",
		"systems/fallout/templates/actor/pc/partials/pip-boy.hbs",
		"systems/fallout/templates/actor/pc/partials/power-armor.hbs",
		"systems/fallout/templates/actor/pc/partials/radiation.hbs",
		"systems/fallout/templates/actor/pc/partials/resistances.hbs",
		"systems/fallout/templates/actor/pc/partials/robot-mods.hbs",
		"systems/fallout/templates/actor/pc/partials/skills.hbs",
		"systems/fallout/templates/actor/pc/partials/statuses.hbs",
		"systems/fallout/templates/actor/pc/partials/traits.hbs",
		"systems/fallout/templates/actor/pc/tabs/abilities.hbs",
		"systems/fallout/templates/actor/pc/tabs/apparel.hbs",
		"systems/fallout/templates/actor/pc/tabs/inventory.hbs",
		"systems/fallout/templates/actor/pc/tabs/status.hbs",
		"systems/fallout/templates/actor/pc/tabs/weapons.hbs",
		"systems/fallout/templates/actor/settlement/partials/action-tallies.hbs",
		"systems/fallout/templates/actor/settlement/partials/action-tally.hbs",
		"systems/fallout/templates/actor/settlement/partials/attribute.hbs",
		"systems/fallout/templates/actor/settlement/partials/header.hbs",
		"systems/fallout/templates/actor/settlement/partials/leader.hbs",
		"systems/fallout/templates/actor/settlement/partials/settler.hbs",
		"systems/fallout/templates/actor/settlement/partials/settlers.hbs",
		"systems/fallout/templates/actor/settlement/partials/stockpile.hbs",
		"systems/fallout/templates/actor/settlement/partials/structure-item.hbs",
		"systems/fallout/templates/actor/settlement/partials/structure-items.hbs",
		"systems/fallout/templates/actor/settlement/partials/structures.hbs",
		"systems/fallout/templates/actor/settlement/tabs/status.hbs",
		"systems/fallout/templates/actor/settlement/tabs/stockpile.hbs",
		"systems/fallout/templates/item/_shared-partials/description-tab.hbs",
		"systems/fallout/templates/item/_shared-partials/effects-tab.hbs",
		"systems/fallout/templates/item/_shared-partials/header.hbs",
		"systems/fallout/templates/item/_shared-partials/mods-tab.hbs",
		"systems/fallout/templates/item/_shared-partials/source.hbs",
		"systems/fallout/templates/item/apparel/_partials/power-armor-piece.hbs",
		"systems/fallout/templates/item/apparel/_partials/power-armor-pieces.hbs",
		"systems/fallout/templates/item/apparel/_partials/power-armor.hbs",
		"systems/fallout/templates/item/apparel/attributes-tab.hbs",
		"systems/fallout/templates/item/apparel/frame-tab.hbs",
		"systems/fallout/templates/item/consumable/attributes-tab.hbs",
		"systems/fallout/templates/item/weapon/attributes-tab.hbs",
		"systems/fallout/templates/item/weapon/qualities-and-effects-tab.hbs",
	];

	const paths = {};
	for (const path of partials) {
		const [key] = path.split("/").slice(3).join("/").split(".");
		paths[key] = path;
	}

	return loadTemplates(paths);
}
