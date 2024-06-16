# v11.12.0

#### Enhancements
- [#443] When deleting scrappable items, ask the player if they want to turn them into junk
- [#444] Allow relevant items to be flagged as junk and have the scrapping tool always use them first if available

	* The following items can be be flagged as being Junk items and if they are will be used as part of the salvage process: Apparel Mod, Apparel, Miscellany, Robot Armor, Robot Module, Weapon Mod, Weapon

- [#454] Populate the compendiumSource field when adding items to actors via ItemSelectors to aid with Babele translations

#### Bugs
- [#438] Owned Robot Mods do not display in Character sheet inventory
- [#452] Resistence labels not correctly localized on Apparel Mod item sheet
- [#453] Not using localized Skill names in Item Selector interface

#### Chores
- [#440] Merge new Polish translation updates from Crowdin
- [#450] Merge new Portuguese/Brazilian translation updates from Crowdin

# v11.11.4

#### Bugs
- [#434] Skills on NPC sheet aren't correctly translated
- [#436] Unable to alter max AP setting if you reduce it to zero

#### Chores
- [#433] Merge new German and Portuguese/Brazilian translation updates from Crowdin

---

# v11.11.3

#### Bugs
- [#428] Rolling weapon attacks broken when using a non-English language setting
- [#430] Character sheet not fully visible on low-resolution displays due to min-height CSS setting

#### Chores
- [#429] Merge German translation updates from Crowdin

---

# v11.11.2

#### Bugs
- [#422] Fusion Cell "quantity found" roll shortcut incorrect in Ammo Item description
- [#423] Weapon Skills not being translated correctly in the config file
- [#424] Encumbrance floating bar can make other character sheet items inaccessible

#### Chores
- [#420] Merge **Portuguese, Brazilian** and **Polish** translation updates from Crowdin

*Many thanks to **Leo Tusi** for providing a massive update to the **Portuguese, Brazilian** translation data.*

*Many thanks to **Bartek** for contributed fixes in this release*

---

# v11.11.1

#### Bugs
- [#417] Unable to modify items

---

# v11.11.0

#### Enhancements
- [#388] Hit locations order on creature/npc sheets
- [#402] Add carry capacity to all gear tabs
- [#403] Add CSS styling for Journal entries
- [#405] Dynamically link original ticket URL when generating Release Notes document
- [#408] Add min-width to Actor sheets to avoid the layout breaking when shrunk too small

#### Bugs
- [#397] Dice So Nice only show for the player who rolls
- [#404] Bogus permission error when closing Item from locked compendium
- [#411] When scrapping junk, unable to locate Scrapper perk by name for people using Babele to translate compendium items.

#### Chores
- [#399] Merge French translation updates from Crowdin
- [#406] Merge French and Polish translation updates from Crowdin

*Many thanks to **extazz17** for contributed fixes in this build*

---

# v11.10.1

#### Bugs
- [#389] Dice So Nice stopped showing for most rolls

#### Chores
- [#387] Merge French translation updates from Crowdin

---

# v11.10.0

#### Enhancement
- [#334] Add a setting to consumables to specify the amount of rad damage CD that are rolled when consuming it
- [#348] Improve the way Power Armor is handled on the sheets

	* You can now optionally attach Power Armor items to a base "Armor Frame" item (this can be found in the core compendiums).
	* This is done by editing the frame item and using the Frame tab to select/deselect which power armor items owned by the actor are attached.
	* The frame and any attached items will be grouped together at the top of the inventory section, and each attached piece will show a "plug" icon to show they attached to a base frame.
	* All attached items will also share Power, Equipped and Stashed settings so that using these controls on any item in the group will modify the value on all items.

- [#366] Add tool to simplify the breaking down of Junk items

	* This can be launched from the Gear tab of the character sheet, there is a new item control button next to the Junk inventory item.
	* This tool also checks to see what levels of the Salvage perk you have and handles the salvage process accordingly.
	* GMs can right-click on a salvage results card and select to "Advance Game Time" by the amount detailed on the result chat card.

- [#367] Add option to automatically reduce weapon damage by wear and tear rate and refuse to fire if broken

	* New option called "Apply Wear and Tear to Weapon Damage" added and is enabled by default.  This will automatically reduce the damage of a weapon by the amount of wear and tear, and a weapon will become unusable once the base damage is reduced to zero by wear and tear.

- [#370] Allow posting items to chat even if they're not currently editable (for example, locked compendium items)
- [#371] Reduce interface clutter by only showing the current damage of a weapon
- [#373] Make the favourite weapons list more readable by moving the damage type into the additional data
- [#375] Stashing an item in your inventory should also unequip it
- [#376] Equipping an item in your inventory should also unstash it
- [#377] Provide a built in Macro to open the Scavenging Help web tool

#### Bugs
- [#356] Laser Gun Damage Value Incorrect
- [#365] Typo in description of all Grognak the Barbarian magazines
- [#368] 10mm Auto Pistol price and weight wrong
- [#369] Weapon Wear & Tear should be a numeric value

	* The upgrade process will attempt to migrate existing values, but if a non-empty, non-numeric string is found will default to a value of 1

- [#372] Available ammo for a weapon missing from favourite and main weapons list
- [#384] Available shots calculation not updated immediately a new ammo item is added to the character

#### Chore
- [#357] Ensure there are no compatibility issues with Foundry V12
- [#358] globalThis.mergeObject must now be accessed via foundry.utils.mergeObject *(Foundry v12 compatibility)*
- [#359] globalThis.duplicate must now be accessed via foundry.utils.duplicate *(Foundry v12 compatibility)*
- [#360] The {{select}} handlebars helper is deprecated *(Foundry v12 compatibility)*
- [#361] globalThis.randomID must now be accessed via foundry.utils.randomID *(Foundry v12 compatibility)*
- [#362] game.system.model.Actor.character.body_parts no longer accessible when checking resistances *(Foundry v12 compatibility)*
- [#363] CONST.CHAT_MESSAGE_TYPES is deprecated in favor of CONST.CHAT_MESSAGE_STYLES *(Foundry v12 compatibility)*
- [#364] The async option for Roll#evaluate has been removed *(Foundry v12 compatibility)*
- [#379] Merge French translation updates from Crowdin
- [#381] ActiveEffect#icon has been migrated to ActiveEffect#img *(Foundry v12 compatibility)*
- [#383] Global "Die" is now namespaced under foundry.dice.terms.Die *(Foundry v12 compatibility)*

*Many thanks to **MrAtoni** for kindly allowing us to link to his scavenging help tool.*

---

# v11.9.4

#### Enhancent
- [#352] Add the ability to easily adjust an NPC's calculated Carry Weight on the NPC sheet

#### Bugs
- [#347] Availability Roll trigger not available on Robot character sheet
- [#350] Don't show the Luck points field on Creatures as they don't have them
- [#351] NPC has no default max HP set

---

# v11.9.3

#### Enhancements
- [#343] Add additional logging around compendium filtering to help with debugging issues

#### Chores
- [#342] Merge French translation updates from Crowdin

---

# v11.9.2

#### Bugs
- [#339] Source filtering not working correctly

# v11.9.1

#### Bugs
- [#336] Sleep processing fails due to error in player online checks

---

# v11.9.0

#### Enhancements
- [#182] Allow weapons to be configured to use custom skills

	* A new "Custom" weapon type has been added which when selected allows you to specify which skill to use, and optionally override the attribute to be used with that skill.  In order to become available for selection custom skills must exist in a compendium.

- [#256] Add a setting to select what compendium items are auto-retrieved from

	* In the settings you can now specify which book sources should be used by the system when pulling items from the compendiums for all sections of the interface which do this.

- [#275] Add the ability to make an availability luck roll from the character sheet

	* This is triggered by clicking the cross-fingers icon in the Luck section of the character sheet header, and it will roll using your Luck SPECIAL score.

- [#294] Add option to use Variable Initiative

	* Currently this cannot handle any situational advantage that the Gamemaster may give to one side or the other, so if needed this will have to be handled manually.

- [#311] Add weapon ranges to character/npc/creature sheets
- [#316] Add ability to quickly search and add filtered items from compendiums to an Actor sheet

	* Each Item section on character now has a new control icon (magnifying glass) which when clicked will open a list of Items from all compendiums, filtered by the specific type for the section.  You can start typing the name of the item you wish to add in the input, and it will filter anything that matches.
	Selecting one of these items from the list will add it to the Actor's inventory.

- [#317] Add Diseases item compendium (20 items)
- [#324] On all items add ability to specify which source book they came from
- [#325] Add the ability to add custom book sources via module flags

	* The example Fallout custom data module has been updated with an example of how to add new sources to your own content modules: https://github.com/Muttley/foundryvtt-fallout-custom-module/releases/tag/v1.1.0

#### Bugs
- [#267] Actors should not take radiation damage from consumables if they are immune, and if not immune the amount of rads taken should be adjusted by an actor's base resistance.
- [#320] Food item deleted or quantity reduced even though unable to eat as full

#### Chores
- [#310] Merge French translation updates from Crowdin
- [#313] Remove unused armorType field from apparel item schema
- [#314] Rename appareltype field in apparel item schema to apparelType for field name consistency purposes
- [#315] Rename appareltype field in robot_armor item schema to apparelType for field name consistency purposes

---

# v11.8.1

#### Bugs
- [#307] Update release to latest compedium data

---

# v11.8.0

#### Enhancements
- [#283] Display Fire Rate outside of Weapon Item
- [#290] Default new character SPECIAL to 5 as those are the defaults for character creation
- [#300] Automatically detect that a weapon is owned by a Creature and not an NPC to simplify configuration
- [#303] Improve error feedback when trying to use a misconfigured weapon

#### Bugs
- [#291] Remove bogus "Boxing Times (Copy)" from compendiums
- [#302] Creature Attribute and Creature Skill weapon settings can appear configured when they're not

#### Chores
- [#289] Merge Polish translation updates from Crowdin
- [#292] Merge French translation updates from Crowdin
- [#299] Merge German translation updates from Crowdin

*Many thanks to **VTTom** for their work on the German translations which now have 100% coverage at time of writing.*

---

# v11.7.0

#### Enhancements
- [#269] Add ability to map your own images onto core compendium items

An example custom module which is pre-configured with various empty compendiums and set up for item image mapping can be downloaded from here:

https://github.com/Muttley/foundryvtt-fallout-custom-module/releases/tag/v1.0.0

This can be used to help bootstrap your own custom data for Fallout.

---

# v11.6.1

#### Enhancements
- [#280] Cache available Ammo items in compendiums at startup to improve performance on slow systems with large amounts of compendium items
	* This will mean that if you add a new ammo item type it won't be available on Weapon item sheets until the system is reloaded.

---

# v11.6.0

#### Enhancements
- [#244] Add support for Minion NPC type
- [#254] Creature & NPC Poison DR can have locational values
	* The system will attempt to migrate existing Poison DR values, but as it was a free text field and there is no way of knowing the format people have used, it is advisable to check all NPC/Creature NPCs to ensure the Poison DR values are correct.
- [#255] Add shortcuts to fill whole DR column at once for Creatures / NPCs who have the same DR for all locations
- [#273] Add Salvage TN field to Creature sheets and rename Gear tab to Salvage

#### Bugfixes
- [#258] Typo on weapons mod tab
- [#260] Custom skill name localization failing and only displaying "FALLOUTUTILS" instead of name
- [#266] Attacking with Fire Rate does not work properly with ammunition charges
- [#270] Well Rested bonus causes issues with setting current health value

#### Chores
- [#259] Merged French translation updates from Crowdin
- [#262] Merged French and Polish translation updates from Crowdin

---

# v11.5.0

#### Enhancements
- [#222] Add Butchery section to Creature sheet
- [#227] Added 10mm Auto Pistol, Buzz-Saw, Flamer, Laser Emitter and Pincer robot arm attachment weapons
- [#229] Add ammo items for thrown and explosive weapons
- [#232] When adding a new item to a actor sheet with the add controls, auto-open the newly created item for editing
- [#233] Make weapon ammo a select option from available ammo types in compendiums
- [#234] Add draggable item shortcut for configured ammo on weapon sheet
- [#238] Tidy up the caps display on NPC sheets
- [#239] Add location to specify Wealth level on NPC sheet
- [#240] Make it easy to roll Caps owned from an NPC's Wealth rating
- [#241] Move weapon Qualities/Effects to their own tab
- [#245] Show the hover tooltips for Weapon Qualities and Damage Effects on all sheets and chat messages
- [#248] Add ability to specify quantity roll formula on Ammo items
- [#249] Add ability to roll new Ammo quantities directly from the Ammo item sheet

#### Bugfixes
- [#225] Weapon Qualities and Damage Effects not showing number in chat
- [#226] Bows using STR attribute when they should use AGI
- [#231] Default item sheet width needs to be wider as Quantity label wrapping
- [#236] Actor sheets containing items with NaN values for quantity or weight break encumbrance display and calculation
- [#237] Magazines chat message not displaying the Publication and still displaying which Issue
- [#247] No icon to consume consumables

#### Chores
- Merged various i18n changes from Crowdin

---

# v11.4.3

#### Enhancements
- [#220] Default Character, Robot and Settlement actor types to have linked actor data by default

#### Bugfixes
- [#221] Sort owned items on Creature/NPC sheets

#### Chores
- [#218] Merged i18n changes from Crowdin

---

# v11.4.2

#### Enhancements
- [#213] Add ability to toggle Radiation and Poison immunity on character and NPC sheets by clicking the Radiation or Poison icon in the resistance section character sheets.

#### Bugfixes
- [#212] Missing material consumables: Asbestos, Bloatfly Gland, Blood Sac, Bloodleaf, Glowing Fungus, Hubflower, Radscorpion Stinger, Stingwing Barb
- [#216] Don't show "undefined" if an out of date Weapon Quality or Damage Effect still exists in Weapon item

---

# v11.4.1

#### Enhancements
- [#197] Added new Bows weapon category

#### Bugfixes
- [#196] Added missing Placed, Recoil and Surge weapon qualities
- [#198] Apparel Missing Info
- [#199] Soups, Stews and Noodle Cup missing thirst reduction value
- [#202] Craftable foods missing the Prepared flag
- [#203] Raider Armor missing individual pieces
- [#204] Apparel that can have the Ballistic Weave mod have max mod set to "0" instead of "1"
- [#205] All Power Armor pieces are missing descriptions

---

# v11.4.0

#### Enhancements
- [#141] Add ability to specify Normal, Mighty/Notable, Legendary/Major categories on Creature and NPC sheets

	* The migration script will attempt to work out which category an NPC should be by correlating its level and XP reward.  If that's not possible a warning message will prompt you so you can manually check individual NPC sheets and set the correct category.

- [#142] Auto-calculate XP reward for NPCs

	* This field is now read-only and autocalculated from the Creature or NPC's Level and Category

- [#143] Allow configuration of thirst reduction on food consumables in order to handle Soups/Stews
- [#145] Add new Weapon Qualities from Fallout Wanderer's Guide
- [#149] Add default icons for all item types
- [#150] Add new default tokens for all actor types
- [#151] Add compendiums containing items from the core rulebook
- [#152] Added Addiction item compendium (12 items)
- [#153] Added Ammunition item compendium (20 items)
- [#154] Added Apparel item compendium (161 items)
- [#155] Added Apparel Mods item compendium (161 items)
- [#156] Added Books and Magazines item compendium (95 items)
- [#157] Added Consumable item compendium (137 items)
- [#158] Create Perks item compendium (190 items)
- [#161] Added Trait item compendium (10 items)
- [#162] Added Weapons item compendium (68 items)
- [#163] Added Weapon Mods item compendium (145 items)
- [#169] Allow settlement job assignment numbers to be modified by Active Effects

	* The following keys can be used to adjust the number of job assignments in a settlement:
		~~~
		system.assignments.build
		system.assignments.business
		system.assignments.guard
		system.assignments.hunting_and_gathering
		system.assignments.scavenging
		system.assignments.tend_crops
		system.assignments.trade_caravan
		system.assignments.unnasigned
		~~~

- [#171] Add new text enricher to detect `+/-nCD` or `+/-nDC` (where `+/-` is an optional symbol, and `n` is a number) and format the string with the Combat Dice icon
- [#172] Added Miscellany item compendium (19 items)
- [#178] Added Robot Modules item compendium (13 items)
- [#186] Create GM interface for triggering party sleep durations.  This can be launched with the new `Party Sleep (GM)` macro provided
- [#188] Automatic condition tracker tied to World time

	* When enabled in the system settings, Character's belonging to players will have their Hunger, Thirst and Sleep values adjusted automatically based on the passing with time in the world. **NOTE:** Your players will *really* have to be on the ball with managing their food & drink resources with this enabled
	* Without any modules installed, only the Party Sleep tool will advance world time
	* If you have the Simple Calendar (or similar) module installed, the GM can adjust world time and have the character's condition statuses update following the core rules (p.190)
	* There are three new system settings that can be used to adjust this behaviour:

		- **Sync Conditions with World Clock**: This enables you to toggle on/off the automatic condition updates
		- **Max Time Jump (hours)**: If the game time changes by more than this amount of hours in one step, then ignore it and set the last Hunger, Thirst and Sleep timestamps to the new time. This ensures that no unexpected spikes in Fatigue are added to characters
		- **Conditions Skip Missing Players**: If this is checked, only characters who's player owner is current online and logged in will have their conditions adjusted

	* **NOTE:** There is currently no automation around any diseases that adjust the condition time steps. This will hopefully be added at a later date

- [#191] Give ability to disable automatic XP calculation for people who wish to homebrew the level break points

#### Bugfixes
- [#144] Add conversion Lbs/Kgs for Materials
- [#147] Skill names not localized in skill roll chat messages
- [#165] Show correct weight system on encumbrance bar when system is set to Kg
- [#173] Inline rolls almost unreadable on item chat cards and sheet descriptions

#### Chores
- [#174] Tidy up Weapon Quality and Damage Effect data in schema
- [#175] Retire the hovers.json facility as we are allowed to have this information in the i18n files for use in tooltips
	* If you are able, please help out with translating these new tooltips (and other strings) via the [Crowdin Project](https://crowdin.com/project/foundryvtt-fallout).
- [#184] Deprecate the "Mouse Hover JSON file" setting

*Many thanks to Modiphius for allowing the inclusion of player facing item compendiums which contain various classes of item from the core rulebook. Thanks to their generosity the system now comes with compendiums containing 1031 items from the core rulebook.*

---

# v11.3.6

#### Bugfixes
- [#137] Ammo counting code can incorrectly match non-ammo items
- [#138] Character sheet rendered before all data ready

---

# v11.3.5

#### Bugfixes
- [#128] Modifying Creature actors fails

#### Chores
- [#127] Merge localization updates from Crowdin

---

# v11.3.4

#### Bugfixes
- [#125] Updating NPC name doesn't get reflected immediately in a related settlement sheet

---

# v11.3.3

#### Enhancements
- [#120] Group settlement stockpile items by type

#### Bugfixes
- [#121] Settler data getting corrupted after adding six or more

#### Chores
- [#118] Merged more language updates from Crowdin

*The French translation is now 100% complete.  Many thanks to Starbuck for their work on this.*

---

# v11.3.2

#### Chores
- [#113] Merged language updates from Crowdin

---

# v11.3.1

#### Bugfix
- [#110] Migrations not running correctly

---

# v11.3.0

#### Enhancements
- [#13] Add new Settlement Actor and corresponding sheet
- [#37] The following character sheet fields are now auto-calculated and have new variables that can be used to adjust them with Active Effects if needed:

	* **Defense** (adjusted by `system.defense.bonus`)
	* **Max Health** (adjusted by `system.health.bonus`)
	* **Initiative** (adjusted by `system.initiative.bonus`)
	* **Melee Damage** (adjusted by `system.meleeDamage.bonus`)
	* **Next Level XP** (*no adjustment available*)

- [#38] Automatically set the initiative for actors added to the combat tracker
- [#43] Add support for ammo types that have multiple charges/shots per item
- [#45] Added Junk, Common, Uncommon and Rare Material numeric fields to character sheet
- [#50] Display the system release notes the first time a world is loaded in a new version of the system
- [#55] Show the amount of remaining shots for each favourite weapon on the status page
- [#59] Added new Trait item and display them on the character sheet along with Perks
- [#61] Changes to Dialog2d20 class to help with possible module integrations (thanks to AngryBeaver of Beaver's Crafting fame)
- [#69] Add ability to consume Consumable items and adjust thirst, hunger, hp, rads, etc. accordingly.

	* This handles HP/Radiation damage healing, Chem addiction rolls, and also adjusts Hunger and Thirst levels appropriately.  Any other effects still need to be handled manually at the moment.

- [#71] Add new Intoxication condition field to help track the amount of alcoholic beverages consumed during a session
- [#75] Add Radiation Healed field to Consumable items, as they are all potentially able to heal Radiation damage
- [#77] Seperate consumable addictive field into a boolean Addictive checkbox and a numeric Addiction Number for clarity
- [#78] Add new Addiction item type, similar to Disease items, and displayed on the Status screen
- [#81] Non-Character weight calculations

	* NPCs and Creatures both now have their inventory weights calculated, and you are now able to set a carry capacity on Creatures

- [#85] Add Macro to start a new game session

	* This is called **"New Session"** and it resets the Party AP to zero, sets the GM AP to the number of players and resets the Intoxication (the number of alcoholic drinks consumed by the player during a session) and Chem Dose counters to zero ready for a new game session

- [#86] Add group field to Consumable items to allow for different items sharing the same addiction name
- [#87] Add flag to show whether food consumable items count as prepared or not
- [#88] Switch Chem consumable's Duration field to a drop-down

	* The migration script for this change will attempt to determine which Duration to use, but this will only work for non-abbreviated English language names that match (in a non-case-sensitive way) the names of these durations somewhere in the string.  Any items whose duration can't be migrated will be given the template default of "instant".

- [#91] Add Thirst Reduction value to Beverage consumables
- [#92] Create new interface for managing the amount of Chem doses a character has taken this session

	* This can be accessed by clicking the "pill" button in the Addictions table list (character sheet Status tab).  If the character already owns an "Addiction" item with the same name as the Chem (or Chem Group for Chems which share the same addiction), then rolls for addiction are no longer made

- [#94] Add new item type for settlement Objects and Structures
- [#99] Lock and add tooltips to sheet fields that are being overridden by active effects

#### Bugfixes
- [#34] Weapon Qualities and Damage Effects should be displayed in (localised) alphabetical order on Weapon item sheet
- [#51] Item quantity boxes polluting actor data when altered
- [#60] Use localized skill names to sort and display alphabetically on Character sheet
- [#65] Stash button alignment issue on Character sheet Apparel tab
- [#66] Power Armor health status showing values when no power armor in use
- [#68] New Consumable item sheet defaults to Food, but Food parameters not shown until selection changed
- [#70] Consumable chat card shows irrelevant details
- [#72] Consumable `system.addictive` field should be a numeric
- [#74] Chems are able to heal HP as well, so the field should be available on the item sheet for them
- [#93] Custom skill names not displayed correctly due to i18n translation missing

#### Chores
- [#33] Merged Polish language updates from Crowdin
- [#35] Remove usage of deprecated `ActiveEffect._getSourceName()`
- [#36] Remove usage of deprecated `ActiveEffect#label`
- [#46] Implement schema migration tools ready for likely schema changes
- [#64] Add ability to filter item compendiums by source ready for future work
- [#79] Merged some corrected Polish translations (thanks to Sanawabicz)
- [#89] Translate as much as possible of the config at startup
- [#97] Refactor sheet classes to more easily share code without constant type checking

---

# v11.2.6

#### Bugfixes
- [#27] Text for some item sheets seems to be broken
- [#28] Editing/Deleting items broken due to missing data tag
- [#29] Encumbrance not being calculated correctly

#### Chores
- Merged Polish translation updates from Crowdin

---

# v11.2.5

#### Chores
- Translation updates are now all handled via Crowdin to simplify the process of contributing translations.  See here for more details: https://github.com/Muttley/foundryvtt-fallout/wiki/Other-ways-to-contribute#translation

---

# v11.2.4

#### Bugfixes
- [#19] Actor skills being overwritten when an Actor is duplicated

---

# v11.2.3

#### Bugfixes
- [#17] Item preview/expansion on Actor sheets doesn't display anything

---

# v11.2.2

#### Bugfixes
- [#14] NPC / Creature inventory items messed up

#### Enhancements
- [#15] Tidy up hunger/thirst/sleep selector layout

---

#### v11.2.1

# Bugfixes
- [#9] AP Tracker not launching

---

# v11.2.0

- System migrated to new home and build process
- Compendiums now contained within a top-level system folder

---

# v11.1.0

- Added Weight unit in settings
- Added some translation fix for french
- Changed defense on charater to read defense.value instead of defense.base

---

# v11.0.3

- Fixed Unstable radiation weapon quality

---

# v11.0.2

- Added new weapon qualities and damage effects
- Added Polish and Deutsch languages

---

# v11.0.1

- Foundry v11 compatible

---

# v10.1.5

- Moved the TextEditor.enrichHTML to getData on the sheet

---

# v10.1.4

- updated FR translation
- Added a setting where you can define your custom skill compendium that will be used to populate your newly created characters with the skills from that compendium.
- Exposed the APTracker class if you want to make a macro to update gmAP or partyAP (special request by some users).
You can now call
`await fallout.APTracker.setAP("gmAP", 1)` or `await fallout.APTracker.setAP("partyAP", 1)` to set it to the custom value. Change "1" for some value you want.

---

# v10.1.3

- removed the **max** Foundry version from the system so you can test it on Foundry V11
- small modification to encumbrance so the system.carryWeight.base could be modified by Active Effects
- robot carryWeight modifications from armor is now only taking the equipped and not-stashed parts in to acount

---

# v10.1.2

- Lowering **max** version from **11** back to **10** since there are some problems in Foundry 11
- Small fix in weapons names (to show if weapon is damaged)
- Adding images and additional info to the Favorite Weapons Box.
- Small styling fixes on the character status tab

---

# v10.1.1

- Fixed encumbrance display.
- Adding **this.system.unofficalSpeed = Agi + athletics** in derivedData method. This can be used for grided maps and optional grided combat rules.
- Equipped apparel name now shows when you hover "body part status box" on the status screen
- **Diseases**. Added **disease** item. Those can also have Active effect on them that can be transfered to actors. Replaced Quick Apparel box on Character sheet with the diseases.
- Improved the styling of chat messages that detail item's properties
- Added Português (Brasil) translation

---

# v10.1.0

- Added new Block for Body Parts with resistances and Injuries to the NPC and Creature sheets. Unfortunately there is no way for me to migrate previous data so the resistances and the injuries of NPCs and Creatures must be repopulated.

---

# v10.0.9

- Added "perks" parameter to Robot Mods.
- Removed the background from the d6 so the color of the die can be customized in Dice So Nice module

---

# v10.0.8

- Added "Ammo Per Shoot" parameter to weapons.

---

# v10.0.7

- Small fix in the Enricher initialization

---

# v10.0.6

- Small changes to enable compatibility with the Maestro module

---

# v10.0.5

- Introducing a way to write fallout symbols in to the text fileds. Use "@fos[DC]" for DC die. Use @fos[PH], @fos[EN], @fos[PO], @fos[RA] for the damage types.

---

# v10.0.4

- Added game settting for the initial carry capacity for characters and robots

---

# v10.0.3

- Improved Condition status display
- Added system.complication value (initially 20). This can be further modified by Active Effects
- Weapons with unreliable quality now decrease Complication by 1 when you roll 2D20 from the weapon

---

# v10.0.2

- Adding vicious damage effect in to the weapon damage calculation

---

# v10.0.1

- Added Ammo Calculation
- Added Weapon Quality labels in the 2d20 chat message
- Cleared some old "data" instances

---

# v10.0.0

- Compatibility update for Foundry v10

---

# v9.0.6

- Fixed initial creation of caps and other valuables on Actor (Thanks to Haxxer)

---

# v9.0.5

- Send item details to chat

---

# v9.0.4

- Thanks to @e4g13 for making new images for the location die. Check out his cool fallout maps on http://www.patreon.com/e4g13

---

# v9.0.3

- Introduced the "Hit Location Die" that is automatically rolled when clicking on the weapon. You can also roll it by using the "h" identifier. (eg. /r 1dh or as inline [[1dh]])
- Added French translation

---

# v9.0.2

- Setting added: "Show Overseer's AP To Player"
- Setting added: "Players Can Setup Party's Max AP"

---

# v9.0.1

- Added mouse hovers for weapon Qualities and Effects. You can change the page numbers for the actual descriptions by creating your own json file and pointing the system to it in the settings.

---

# v9.0.0

- Bumping the manifest to Foundry v9

---

# v1.9.1

- Weight of an Item can now be a float. (You can now put for example 0.2 as a weight)
- Added Qualities and Effects to the Weapon List on the Character Sheet.
- Fixed total value of the Challenge Die rolls when you use standard roll formula (/r 1dc).
- Fixed quantity box so it doesn't disappear if the quantity is set to zero.

---

# v1.9

- Added quantity filed next to the item name/
- I am still trying to find and fix why sometimes the crit doesn't register and you get a wrong num of successes. I did put some safe measures around it but I still need more test data.

---

# v1.8

- Added the 'Wear & Tear' field in the weapon sheet. If it is populated the 'wrench' will apear next to the weapon name on the character sheet to remind you that you should fix it.

---

# v1.7

- Radiation tracker added to the chracter sheet

---

# v1.6

- Fixed encumbrance calculation. Now it should include item quantity too.

---

# v1.5

- Added skill delete option for characters, and blocked skill duplication.

---

# v1.4

- Fixed Book and Magazines Effect field

---

# v1.3

- Added dice term for Combat Die. "/r 1dc"
- Added Dice Modifier "ef" to count the effect results (5,6)
- Added Dice Modifier "sum" to count the results (1+2+0+0+1+1)

---

# v1.21

- Bug Fix: Show robot mod on the character sheet under "unsorted items".

---

# v1.2

- Merged Rosataker translation improvements.
- Bug Fix: show the Perk Rank on the character sheet list.
- Improvement: DC Roll Chat Message now displays weapon damage types and weapon damage effects.

---

# v1.1

- Weapon Mods: Changed the weapon type field to be a text input so more specific weapon types can be entered.
- Bug Fix: Items Sheet background bug fixed when installed on the Forge servers.
