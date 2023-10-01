v 11.0.3

- Fixed Unstable radiation weapon quality

v 11.0.2

- Added new weapon qualities and damage effects
- Added Polish and Deutsch languages


v 11.0.1

- Foundry v11 compatible


v 10.1.5

- Moved the TextEditor.enrichHTML to getData on the sheet


v 10.1.4

- updated FR translation
- Added a setting where you can define your custom skill compendium that will be used to populate your newly created characters with the skills from that compendium.
- Exposed the APTracker class if you want to make a macro to update gmAP or partyAP (special request by some users).
You can now call 
`await game.fallout.APTracker.setAP("gmAP", 1) or ("partyAP", 1) to set it to the custom value. Change "1" for some value you want. `

v 10.1.3

- removed the **max** Foundry version from the system so you can test it on Foundry V11
- small modification to encumbrance so the system.carryWeight.base could be modified by Active Effects
- robot carryWeight modifications from armor is now only taking the equipped and not-stashed parts in to acount


v 10.1.2

- Lowering **max** version from **11** back to **10** since there are some problems in Foundry 11
- Small fix in weapons names (to show if weapon is damaged)
- Adding images and additional info to the Favorite Weapons Box.
- Small styling fixes on the character status tab


v 10.1.1

- Fixed encumbrance display.
- Adding **this.system.unofficalSpeed = Agi + athletics** in derivedData method. This can be used for grided maps and optional grided combat rules.
- Equipped apparel name now shows when you hover "body part status box" on the status screen
- **Diseases**. Added **disease** item. Those can also have Active effect on them that can be transfered to actors. Replaced Quick Apparel box on Character sheet with the diseases.
- Improved the styling of chat messages that detail item's properties
- Added Português (Brasil) translation


v 10.1.0

- Added new Block for Body Parts with resistances and Injuries to the NPC and Creature sheets. Unfortunately there is no way for me to migrate previous data so the resistances and the injuries of NPCs and Creatures must be repopulated.


v 10.0.9

- Added "perks" parameter to Robot Mods.
- Removed the background from the d6 so the color of the die can be customized in Dice So Nice module


v 10.0.8

- Added "Ammo Per Shoot" parameter to weapons.


v 10.0.7

- Small fix in the Enricher initialization


v 10.0.6

- Small changes to enable compatibility with the Maestro module


v 10.0.5

- Introducing a way to write fallout symbols in to the text fileds. Use "@fos[DC]" for DC die. Use @fos[PH], @fos[EN], @fos[PO], @fos[RA] for the damage types.


v 10.0.4

- Added game settting for the initial carry capacity for characters and robots


v 10.0.3

- Improved Condition status display
- Added system.complication value (initialy 20). This can be further modified by Active Effects
- Weapons with unreliable quality now decrease Complication by 1 when you roll 2D20 from the weapon


v 10.0.2

- Adding vicious damage effect in to the weapon damage calculation


v 10.0.1

- Added Ammo Calculation
- Added Weapon Quality labels in the 2d20 chat message
- Cleared some old "data" instances


v 10.0.0

- Compatibility update for Foundry v10


V 9.0.6

- Fixed initial creation of caps and other valuables on Actor (Thanks to Haxxer)


V 9.0.5

- Send item details to chat


V 9.0.4

- Thanks to @e4g13 for making new images for the location die. Check out his cool fallout maps on http://www.patreon.com/e4g13


V 9.0.3

- Introduced the "Hit Location Die" that is automatically rolled when clicking on the weapon. You can also roll it by using the "h" identifier. (eg. /r 1dh or as inline [[1dh]])
- Added French translation



V 9.0.2

- Setting added: "Show Overseer's AP To Player"
- Setting added: "Players Can Setup Party's Max AP"


V 9.0.1

- Added mouse hovers for weapon Qualities and Effects. You can change the page numbers for the actual descriptions by creating your own json file and pointing the system to it in the settings.

V 9.0.0

- Bumping the manifest to Foundry v9


V 1.9.1

- Weight of an Item can now be a float. (You can now put for example 0.2 as a weight)
- Added Qualities and Effects to the Weapon List on the Character Sheet.
- Fixed total value of the Challenge Die rolls when you use standard roll formula (/r 1dc).
- Fixed quantity box so it doesn't disappear if the quantity is set to zero.


V 1.9

- Added quantity filed next to the item name/
- I am still trying to find and fix why sometimes the crit doesn't register and you get a wrong num of successes. I did put some safe measures around it but I still need more test data.

V 1.8

- Added the 'Wear & Tear' field in the weapon sheet. If it is populated the 'wrench' will apear next to the weapon name on the character sheet to remind you that you should fix it.

V 1.7

- Radiation tracker added to the chracter sheet

V 1.6

- Fixed encumbrance calculation. Now it should include item quantity too.

V 1.5

- Added skill delete option for characters, and blocked skill duplication.

V 1.4

- Fixed Book and Magazines Effect field

V 1.3

- Added dice term for Combat Die. "/r 1dc"
- Added Dice Modifier "ef" to count the effect results (5,6)
- Added Dice Modifier "sum" to count the results (1+2+0+0+1+1)

V 1.21

- Bug Fix: Show robot mod on the character sheet under "unsorted items".

V 1.2

- Merged Rosataker translation improvements.
- Bug Fix: show the Perk Rank on the character sheet list.
- Improvement: DC Roll Chat Message now displays weapon damage types and weapon damage effects.

V 1.1

- Weapon Mods: Changed the weapon type field to be a text input so more specific weapon types can be entered.
- Bug Fix: Items Sheet background bug fixed when installed on the Forge servers.
