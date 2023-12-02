## v11.3.0

### Enhancements
- [#37] The following character sheet fields are now auto-calculated and have new variables that can be used to adjust them with Active Effects if needed:

	* **Defense** (adjusted by `system.defense.bonus`)
	* **Max Health** (adjusted by `system.health.bonus`)
	* **Initiative** (adjusted by `system.initiative.bonus`)
	* **Melee Damage** (adjusted by `system.meleeDamage.bonus`)
	* **Next Level XP** (no adjustment available)

- [#50] Display the sytsem release notes the first time a world is loaded in a new version of the system

### Bugfixes
- [#34] Weapon Qualities and Damage Effects should be displayed in (localised) alphabetical order on Weapon item sheet

### Chores
- [#33] Merged Polish language updates from Crowdin
- [#35] Remove usage of deprecated `ActiveEffect._getSourceName()`
- [#36] Remove usage of deprecated `ActiveEffect#label`
- [#46] Implement schema migration tools ready for likely schema changes

---

## v11.2.6

### Bugfixes
- [#27] Text for some item sheets seems to be broken
- [#28] Editing/Deleting items broken due to missing data tag
- [#29] Encumbrance not being calculated correctly

### Chores
- Merged Polish translation updates from Crowdin

---

## v11.2.5

### Chores
- Translation updates are now all handled via Crowdin to simplify the process of contributing translations.  See here for more details: https://github.com/Muttley/foundryvtt-fallout/wiki/Other-ways-to-contribute#translation

---

## v11.2.4

### Bugfixes
- [#19] Actor skills being overwritten when an Actor is duplicated

---

## v11.2.3

### Bugfixes
- [#17] Item preview/expansion on Actor sheets doesn't display anything

---

## v11.2.2

## Bugfixes
- [#14] NPC / Creature inventory items messed up

## Enhancements
- [#15] Tidy up hunger/thirst/sleep selector layout

---

## v11.2.1

## Bugfixes
- [#9] AP Tracker not launching

---

## v11.2.0

- System migrated to new home and build process
- Compendiums now contained within a top-level system folder

---

## v11.1.0

- Added Weight unit in settings
- Added some translation fix for french
- Changed defense on charater to read defense.value instead of defense.base

---

## v11.0.3

- Fixed Unstable radiation weapon quality

---

## v11.0.2

- Added new weapon qualities and damage effects
- Added Polish and Deutsch languages

---

## v11.0.1

- Foundry v11 compatible

---

## v10.1.5

- Moved the TextEditor.enrichHTML to getData on the sheet

---

## v10.1.4

- updated FR translation
- Added a setting where you can define your custom skill compendium that will be used to populate your newly created characters with the skills from that compendium.
- Exposed the APTracker class if you want to make a macro to update gmAP or partyAP (special request by some users).
You can now call
`await fallout.APTracker.setAP("gmAP", 1)` or `await fallout.APTracker.setAP("partyAP", 1)` to set it to the custom value. Change "1" for some value you want.

---

## v10.1.3

- removed the **max** Foundry version from the system so you can test it on Foundry V11
- small modification to encumbrance so the system.carryWeight.base could be modified by Active Effects
- robot carryWeight modifications from armor is now only taking the equipped and not-stashed parts in to acount

---

## v10.1.2

- Lowering **max** version from **11** back to **10** since there are some problems in Foundry 11
- Small fix in weapons names (to show if weapon is damaged)
- Adding images and additional info to the Favorite Weapons Box.
- Small styling fixes on the character status tab

---

## v10.1.1

- Fixed encumbrance display.
- Adding **this.system.unofficalSpeed = Agi + athletics** in derivedData method. This can be used for grided maps and optional grided combat rules.
- Equipped apparel name now shows when you hover "body part status box" on the status screen
- **Diseases**. Added **disease** item. Those can also have Active effect on them that can be transfered to actors. Replaced Quick Apparel box on Character sheet with the diseases.
- Improved the styling of chat messages that detail item's properties
- Added Português (Brasil) translation

---

## v10.1.0

- Added new Block for Body Parts with resistances and Injuries to the NPC and Creature sheets. Unfortunately there is no way for me to migrate previous data so the resistances and the injuries of NPCs and Creatures must be repopulated.

---

## v10.0.9

- Added "perks" parameter to Robot Mods.
- Removed the background from the d6 so the color of the die can be customized in Dice So Nice module

---

## v10.0.8

- Added "Ammo Per Shoot" parameter to weapons.

---

## v10.0.7

- Small fix in the Enricher initialization

---

## v10.0.6

- Small changes to enable compatibility with the Maestro module

---

## v10.0.5

- Introducing a way to write fallout symbols in to the text fileds. Use "@fos[DC]" for DC die. Use @fos[PH], @fos[EN], @fos[PO], @fos[RA] for the damage types.

---

## v10.0.4

- Added game settting for the initial carry capacity for characters and robots

---

## v10.0.3

- Improved Condition status display
- Added system.complication value (initially 20). This can be further modified by Active Effects
- Weapons with unreliable quality now decrease Complication by 1 when you roll 2D20 from the weapon

---

## v10.0.2

- Adding vicious damage effect in to the weapon damage calculation

---

## v10.0.1

- Added Ammo Calculation
- Added Weapon Quality labels in the 2d20 chat message
- Cleared some old "data" instances

---

## v10.0.0

- Compatibility update for Foundry v10

---

## v9.0.6

- Fixed initial creation of caps and other valuables on Actor (Thanks to Haxxer)

---

## v9.0.5

- Send item details to chat

---

## v9.0.4

- Thanks to @e4g13 for making new images for the location die. Check out his cool fallout maps on http://www.patreon.com/e4g13

---

## v9.0.3

- Introduced the "Hit Location Die" that is automatically rolled when clicking on the weapon. You can also roll it by using the "h" identifier. (eg. /r 1dh or as inline [[1dh]])
- Added French translation

---

## v9.0.2

- Setting added: "Show Overseer's AP To Player"
- Setting added: "Players Can Setup Party's Max AP"

---

## v9.0.1

- Added mouse hovers for weapon Qualities and Effects. You can change the page numbers for the actual descriptions by creating your own json file and pointing the system to it in the settings.

---

## v9.0.0

- Bumping the manifest to Foundry v9

---

## v1.9.1

- Weight of an Item can now be a float. (You can now put for example 0.2 as a weight)
- Added Qualities and Effects to the Weapon List on the Character Sheet.
- Fixed total value of the Challenge Die rolls when you use standard roll formula (/r 1dc).
- Fixed quantity box so it doesn't disappear if the quantity is set to zero.

---

## v1.9

- Added quantity filed next to the item name/
- I am still trying to find and fix why sometimes the crit doesn't register and you get a wrong num of successes. I did put some safe measures around it but I still need more test data.

---

## v1.8

- Added the 'Wear & Tear' field in the weapon sheet. If it is populated the 'wrench' will apear next to the weapon name on the character sheet to remind you that you should fix it.

---

## v1.7

- Radiation tracker added to the chracter sheet

---

## v1.6

- Fixed encumbrance calculation. Now it should include item quantity too.

---

## v1.5

- Added skill delete option for characters, and blocked skill duplication.

---

## v1.4

- Fixed Book and Magazines Effect field

---

## v1.3

- Added dice term for Combat Die. "/r 1dc"
- Added Dice Modifier "ef" to count the effect results (5,6)
- Added Dice Modifier "sum" to count the results (1+2+0+0+1+1)

---

## v1.21

- Bug Fix: Show robot mod on the character sheet under "unsorted items".

---

## v1.2

- Merged Rosataker translation improvements.
- Bug Fix: show the Perk Rank on the character sheet list.
- Improvement: DC Roll Chat Message now displays weapon damage types and weapon damage effects.

---

## v1.1

- Weapon Mods: Changed the weapon type field to be a text input so more specific weapon types can be entered.
- Bug Fix: Items Sheet background bug fixed when installed on the Forge servers.
