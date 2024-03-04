![GitHub Release](https://img.shields.io/github/release-date/Muttley/foundryvtt-fallout)
![All Versions](https://img.shields.io/github/downloads/Muttley/foundryvtt-fallout/total)
![Latest Version](https://img.shields.io/github/downloads/Muttley/foundryvtt-fallout/latest/fallout.zip)
[![Crowdin](https://badges.crowdin.net/foundryvtt-fallout/localized.svg)](https://crowdin.com/project/foundryvtt-fallout)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffallout)

# Fallout: The Roleplaying Game for Foundry VTT

*In 2077, the storm of nuclear war reduced most of the planet to cinders. From the ashes of nuclear devastation, a new civilization will struggle to arise. A civilization you will shape.*

*How will you re-shape the world? Will you join with a plucky band of survivors to fight off all-comers and carve out your own settlement? Will you team up with pre-existing factions like the Brotherhood of Steel or Super Mutants to enforce your own ideals on the Wasteland? Ghoul or robot, paladin or raider, it’s your choice - and the consequences are yours. Welcome to the Wasteland. Welcome to the world of Fallout.*

---

This community contributed and maintained system for playing [Fallout: The Roleplaying Game][1] with the [Foundry VTT][2] virtual tabletop software has been produced with the explicit consent of [Modiphius Entertainment][3].

All copyright assets included in the system are used with the explicit consent of [Modiphius Entertainment][3]. The system developers hold no claims to these underlying copyrighted assets.

*Many thanks to Modiphius for allowing the inclusion of many player facing item compendiums which contain various classes of item from the core rulebook. Their generosity means the system comes with compendiums containing 1031 items from the core rulebook.*

---

## System Features

### Actor Types

- Character
- Creature
- NPC
- Robot
- Settlement

### Item Types

- Addiction
- Ammo
- Apparel
- Apparel Mod
- Books and Magazines
- Consumables (Food, Beverage, Chem, Other)
- Miscellany
- Perk
- Robot Armor
- Robot Modules
- Skill
- Special Ability
- Trait
- Weapon
- Weapon Mod

### Features

- The following compendiums containing items from the core rulebook are included with the kind permission of Modiphius Entertainment:
	* Addictions item compendium (12 items)
	* Ammunition item compendium (20 items)
	* Apparel item compendium (161 items)
	* Apparel Mods item compendium (161 items)
	* Books and Magazines item compendium (95 items)
	* Consumables item compendium (137 items)
	* Miscellany item compendium (19 items)
	* Perks item compendium (190 items)
	* Robot Modules item compendium (13 items)
	* Skills item compendium (17 items)
	* Traits item compendium (10 items)
	* Weapon Mods item compendium (145 items)
	* Weapons item compendium (68 items)
- Dice Roller Macros for D20 and DC Rolls. You can find them in the fallout-macros compendium. Includes Re-roll and Add Dice options. Calculates the number of successes/damage/effects. It can be triggered separately or from the Attributes/Skills/Weapons. (Dice So Nice module supported)
- Ability to consume Consumable items and have thirst, hunger, hp, rads, etc. adjusted accordingly.
	* Addiction and Alchoholism checks are automatically rolled when the correct type of items are consumed.
- Hunger, thirst, sleep and fatigue levels can be automatically updated with the in-game world time.
	* Without any modules installed, only the Party Sleep tool will advance world time
	* If you have the Simple Calendar (or similar) module installed, the GM can adjust world time and have the character's condition statuses update following the core rules (p.190)
- Custom CD roll: "`/r 1dc`" and modifiers to count the effects ("`/r 1dcef`") or count total results summed ("`/r 1dcsum`")
- Pipboy Screen for Characters and Robots (player sheets)
- Calculating Resistances depending on the equipped apparel
- Marking Injuries visually on the body parts
- Calculating Encumbrance
- Smart Item Sorting by Type
- Adding Melee Bonus to Unarmed and melee weapons
- Automatically switching to Creature Attributes and Skills for Creature Weapons that are of "Creature Attack" Type. Also automatically marks them as Tagged when rolling.
- Favorite Weapons List quick view
- Power Armor Health Monitor
- Robot Modules List quick view
- Conditions
- Action Points trackers for Overseer and the Party
- Location Die "`1dh`" (Thanks to @e4g13 for making images for the location die. Check out his cool fallout maps on http://www.patreon.com/e4g13)
- A way to write fallout symbols in the journal entries:
	* `@fos[DC]` or `@fos[CD]` for DC (Pip-Boy) die symbol
	* `@fos[PH]` for Physical damage type
	* `@fos[EN]` for Energy damage type
	* `@fos[PO]` for Poison damage type
	* `@fos[RA]` for Radiation damage type

## FAQ

- Apparel resistances are visible on the pip-boy figure for that specific body part. Resistances on the left of the pip-boy are general bonuses that are added to all body parts.
- Power Armor needs to be equipped and powered in order to apply it's resistances.
- Power Armor frame as an Active Effect `system.attributes.str.value, Override, 11`
- You can drag skills to the NPCs from the included skills compendium.
- Right click on the Skill name in order to choose a different Attribute to roll with. This will prop Delete skill on NPCs.(still looking for the right design solution for this)
- Characters can't equip robot armor so those are stashed under the GEAR tab. (and vice versa)
- You can stash items by clicking on the stash icon in the character’s items list.Stashed items do not count against total weight you carry.

## Disclaimer

This might change in the future but for now:

### Power Armor Frame

There is no item of this type but you can use Foundry's Active Effect on the character sheet to create one "Passive Effect" with this values:

system.attributes.str.value, Override, 11

Players can then toggle it depending if they are in or out of the Power Armor.

### Power Armor and other Apparel

Allowing players to have Power Armor and Armor equipped at the same time on different body parts is intentional. Still, when calculating resistances for the body part these will not stack! Only Clothing stacks with other apparel types on the same body part.

_In some situations GMs might allow that you could be in a power armor frame with only power-armor-torso for example but still receive "Armor" bonuses on the other parts of your body. Your game table should decide about that and it is up to the players to equip/unequip their apparel accordingly._

### Weapon mods and Apparel mods

Weapon mods and Apparel mods can be added to the character sheet as items.
To add them to your Weapons and Apparel you will need to write their names in your weapon/apparel item sheets.
Since there is no native Foundry support for Items to contain other Items I am looking for some sort of work around, but for now you will need to be a good player and take care of those numbers and effects on your own. Pen and Paper style.

## License

Foundry VTT: Limited License Agreement for module development.

All copyright assets used with explicit consent from Modiphius Entertainment. The system developers hold no claims to underlying copyrighted assets.

## Thanks to

- @e4g13 for making new images for the location die. Check out his cool fallout maps on http://www.patreon.com/e4g13

- This system uses various icons from [Game-icons.net](https://game-icons.net/), including icons created by **Caro Asercion**, [Delapouite](https://delapouite.com/), [Lorc](https://lorcblog.blogspot.com/) and **Skoll**

[1]: https://www.modiphius.net/pages/fallout-the-roleplaying-game
[2]: https://foundryvtt.com
[3]: https://www.modiphius.net
