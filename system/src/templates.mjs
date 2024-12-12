
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
		"systems/fallout/templates/actor/_shared-partials/npc_body.hbs",
		"systems/fallout/templates/actor/_shared-partials/npc_defense.hbs",
		"systems/fallout/templates/actor/_shared-partials/npc_hp.hbs",
		"systems/fallout/templates/actor/_shared-partials/npc_initiative.hbs",
		"systems/fallout/templates/actor/_shared-partials/npc_special-abilities.hbs",
		"systems/fallout/templates/actor/_shared-partials/simple-expandable-item.hbs",
		"systems/fallout/templates/actor/_shared-partials/skills.hbs",
		"systems/fallout/templates/actor/_shared-partials/weapons.hbs",
		"systems/fallout/templates/actor/creature/partials/attributes.hbs",
		"systems/fallout/templates/actor/creature/partials/butchery.hbs",
		"systems/fallout/templates/actor/creature/partials/carried-weight.hbs",
		"systems/fallout/templates/actor/creature/partials/salvage.hbs",
		"systems/fallout/templates/actor/creature/tabs/abilities.hbs",
		"systems/fallout/templates/actor/creature/tabs/butchery.hbs",
		"systems/fallout/templates/actor/creature/tabs/salvage.hbs",
		"systems/fallout/templates/actor/npc/partials/attributes.hbs",
		"systems/fallout/templates/actor/npc/partials/carried-weight.hbs",
		"systems/fallout/templates/actor/npc/partials/carry-weight.hbs",
		"systems/fallout/templates/actor/npc/partials/inventory.hbs",
		"systems/fallout/templates/actor/npc/partials/melee-bonus.hbs",
		"systems/fallout/templates/actor/npc/partials/settlement.hbs",
		"systems/fallout/templates/actor/npc/tabs/abilities.hbs",
		"systems/fallout/templates/actor/npc/tabs/gear.hbs",
		"systems/fallout/templates/actor/npc/tabs/skills.hbs",
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
		"systems/fallout/templates/actor/pc/partials/statuses.hbs",
		"systems/fallout/templates/actor/pc/partials/traits.hbs",
		"systems/fallout/templates/actor/pc/tabs/abilities.hbs",
		"systems/fallout/templates/actor/pc/tabs/apparel.hbs",
		"systems/fallout/templates/actor/pc/tabs/inventory.hbs",
		"systems/fallout/templates/actor/pc/tabs/status.hbs",
		"systems/fallout/templates/actor/pc/tabs/weapons.hbs",
		"systems/fallout/templates/actor/scavenging_location/partials/categories.hbs",
		"systems/fallout/templates/actor/scavenging_location/partials/category.hbs",
		"systems/fallout/templates/actor/scavenging_location/partials/found-items.hbs",
		"systems/fallout/templates/actor/scavenging_location/partials/header.hbs",
		"systems/fallout/templates/actor/scavenging_location/tabs/details.hbs",
		"systems/fallout/templates/actor/scavenging_location/tabs/items.hbs",
		"systems/fallout/templates/actor/scavenging_location/tabs/notes.hbs",
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
		"systems/fallout/templates/actor/vehicle/partials/attributes.hbs",
		"systems/fallout/templates/actor/vehicle/partials/body.hbs",
		"systems/fallout/templates/actor/vehicle/partials/carried-weight.hbs",
		"systems/fallout/templates/actor/vehicle/partials/favorite-weapons.hbs",
		"systems/fallout/templates/actor/vehicle/partials/header.hbs",
		"systems/fallout/templates/actor/vehicle/partials/inventory.hbs",
		"systems/fallout/templates/actor/vehicle/partials/qualities.hbs",
		"systems/fallout/templates/actor/vehicle/partials/speed.hbs",
		"systems/fallout/templates/actor/vehicle/partials/weapons.hbs",
		"systems/fallout/templates/actor/vehicle/tabs/abilities.hbs",
		"systems/fallout/templates/actor/vehicle/tabs/cargo.hbs",
		"systems/fallout/templates/actor/vehicle/tabs/weapons.hbs",
		"systems/fallout/templates/item/_shared-partials/choice-selector.hbs",
		"systems/fallout/templates/item/_shared-partials/description-tab.hbs",
		"systems/fallout/templates/item/_shared-partials/effects-tab.hbs",
		"systems/fallout/templates/item/_shared-partials/header.hbs",
		"systems/fallout/templates/item/_shared-partials/mods-tab.hbs",
		"systems/fallout/templates/item/_shared-partials/source.hbs",
		"systems/fallout/templates/item/addiction/attributes-tab.hbs",
		"systems/fallout/templates/item/ammo/attributes-tab.hbs",
		"systems/fallout/templates/item/apparel_mod/attributes-tab.hbs",
		"systems/fallout/templates/item/apparel/_partials/power-armor-piece.hbs",
		"systems/fallout/templates/item/apparel/_partials/power-armor-pieces.hbs",
		"systems/fallout/templates/item/apparel/_partials/power-armor.hbs",
		"systems/fallout/templates/item/apparel/attributes-tab.hbs",
		"systems/fallout/templates/item/apparel/frame-tab.hbs",
		"systems/fallout/templates/item/books_and_magz/attributes-tab.hbs",
		"systems/fallout/templates/item/consumable/_partials/addictive.hbs",
		"systems/fallout/templates/item/consumable/_partials/alcoholic.hbs",
		"systems/fallout/templates/item/consumable/_partials/butchery.hbs",
		"systems/fallout/templates/item/consumable/_partials/duration.hbs",
		"systems/fallout/templates/item/consumable/_partials/hp-healed.hbs",
		"systems/fallout/templates/item/consumable/_partials/irradiated-damage.hbs",
		"systems/fallout/templates/item/consumable/_partials/irradiated.hbs",
		"systems/fallout/templates/item/consumable/_partials/prepared.hbs",
		"systems/fallout/templates/item/consumable/_partials/radiation-healed.hbs",
		"systems/fallout/templates/item/consumable/_partials/thirst-reduction.hbs",
		"systems/fallout/templates/item/consumable/attributes-tab.hbs",
		"systems/fallout/templates/item/consumable/type/beverage.hbs",
		"systems/fallout/templates/item/consumable/type/chem.hbs",
		"systems/fallout/templates/item/consumable/type/food.hbs",
		"systems/fallout/templates/item/consumable/type/other.hbs",
		"systems/fallout/templates/item/disease/attributes-tab.hbs",
		"systems/fallout/templates/item/miscellany/attributes-tab.hbs",
		"systems/fallout/templates/item/object_or_structure/attributes-tab.hbs",
		"systems/fallout/templates/item/origin/attributes-tab.hbs",
		"systems/fallout/templates/item/perk/attributes-tab.hbs",
		"systems/fallout/templates/item/perk/requirements-tab.hbs",
		"systems/fallout/templates/item/perk/_partials/attributes.hbs",
		"systems/fallout/templates/item/robot_armor/attributes-tab.hbs",
		"systems/fallout/templates/item/robot_mod/attributes-tab.hbs",
		"systems/fallout/templates/item/skill/attributes-tab.hbs",
		"systems/fallout/templates/item/special_ability/attributes-tab.hbs",
		"systems/fallout/templates/item/weapon_mod/attributes-tab.hbs",
		"systems/fallout/templates/item/weapon/_partials/effects.hbs",
		"systems/fallout/templates/item/weapon/_partials/qualities.hbs",
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
