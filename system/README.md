![GitHub Release](https://img.shields.io/github/release-date/Muttley/foundryvtt-fallout)
![All Versions](https://img.shields.io/github/downloads/Muttley/foundryvtt-fallout/total)
![Latest Version](https://img.shields.io/github/downloads/Muttley/foundryvtt-fallout/latest/fallout.zip)
[![Crowdin](https://badges.crowdin.net/foundryvtt-fallout/localized.svg)](https://crowdin.com/project/foundryvtt-fallout)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffallout)

# Fallout 2d20 System for Foundry VTT

This is an unoffical Fallout 2d20 system for Foundry VTT.  No content from the books is included.

## Actor Types

- Character
- Creature
- NPC
- Robot

## Item Types

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
- Weapon
- Weapon Mod

## Features

- Dice Roller Macros for D20 and DC Rolls. You can find them in the fallout-macros compendium. Includes Re-roll and Add Dice options. Calculates the number of successes/damage/effects. It can be triggered separately or from the Attributes/Skills/Weapons. (Dice So Nice module supported)
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
	* `@fos[DC]` for DC die symbol
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

All copyright assets used with explicit consent from Modiphius Entertainment. The fvtt-modiphius developer community holds no claim to underlying copyrighted assets.

## Thanks to

- @e4g13 for making new images for the location die. Check out his cool fallout maps on http://www.patreon.com/e4g13
