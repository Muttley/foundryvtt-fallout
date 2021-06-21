/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/fallout/templates/actor/parts/actor-skills.html",
    "systems/fallout/templates/actor/parts/actor-perks.html",
    "systems/fallout/templates/actor/parts/actor-effects.html",
  ]);
};
