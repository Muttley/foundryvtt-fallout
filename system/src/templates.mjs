/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
	return loadTemplates([
		// Actor partials.
		"systems/fallout/templates/actor/parts/actor-header.hbs",
		"systems/fallout/templates/actor/parts/actor-attributes.hbs",
		"systems/fallout/templates/actor/parts/actor-skills.hbs",
		"systems/fallout/templates/actor/parts/actor-perks.hbs",
		"systems/fallout/templates/actor/parts/actor-apparel.hbs",
		"systems/fallout/templates/actor/parts/actor-weapons.hbs",
		"systems/fallout/templates/actor/parts/actor-status.hbs",
		"systems/fallout/templates/actor/parts/actor-effects.hbs",
		"systems/fallout/templates/actor/parts/actor-equipped_apparel.hbs",
		"systems/fallout/templates/actor/parts/actor-favorite_weapons.hbs",
		"systems/fallout/templates/actor/parts/actor-conditions.hbs",
		"systems/fallout/templates/actor/parts/actor-inventory.hbs",
		"systems/fallout/templates/actor/parts/actor-special_abilities.hbs",
		"systems/fallout/templates/actor/parts/actor-diseases.hbs",
		"systems/fallout/templates/actor/parts/body-status-plaque.hbs",
		"systems/fallout/templates/actor/parts/npc-body.hbs",
		"systems/fallout/templates/item/parts/item-header.hbs",
		"systems/fallout/templates/item/parts/item-effects.hbs",
		"systems/fallout/templates/actor/parts/simple-expandable-item.hbs",
	]);
};
