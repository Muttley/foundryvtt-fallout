import { FalloutModuleArtConfig } from "./apps/FalloutModuleArtConfig.mjs";

export default function registerSettings() {
	// -------------------
	//  INTERNAL SETTINGS
	// -------------------
	//
	game.settings.register(SYSTEM_ID, "partyAP", {
		name: "Party AP",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "gmAP", {
		name: "GM AP",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "maxAP", {
		name: "Max AP",
		scope: "world",
		config: false,
		default: 6,
		type: Number,
	});

	// ====================
	//  SETTINGS SUB-MENUS
	// ====================

	// -----------------
	//  DYNAMIC ARTWORK
	// -----------------
	//
	game.settings.registerMenu(SYSTEM_ID, "moduleArtConfiguration", {
		name: "Module-provided Art",
		label: "Configure Art",
		hint: "Configure which module-provided art should be used",
		icon: "fa-solid fa-palette",
		type: FalloutModuleArtConfig,
		restricted: true,
	});

	game.settings.register(SYSTEM_ID, "moduleArtConfiguration", {
		name: "Module Art Configuration",
		scope: "world",
		config: false,
		type: Object,
		default: {
			fallout: {
				items: true,
			},
		},
	});

	// ---------------------
	//  SCAVENGING SETTINGS
	// ---------------------
	//
	game.settings.registerMenu(SYSTEM_ID, "scavenging", {
		name: "Scavenging Settings",
		hint: "Configuration settings related to the roll tables used for Scavenging Locations",
		label: "Configure Scavenging Settings",
		icon: "fa-solid fa-magnifying-glass",
		type: fallout.apps.ScavengingTableSettings,
		restricted: true,
	});
	fallout.apps.ScavengingTableSettings.registerSetting();

	// ----------------
	//  SOURCE FILTERS
	// ----------------
	//
	game.settings.registerMenu(SYSTEM_ID, "sources", {
		name: "Source Filter",
		hint: "If populated, only sources included in this list will be used by any part of the system which automatically pulls items from Compendiums. Items with no Source set will always be included.",
		label: "Configure Source Filter",
		icon: "fa-solid fa-book",
		type: fallout.apps.SourceFilterSettings,
		restricted: true,
	});
	fallout.apps.SourceFilterSettings.registerSetting();

	// -----------------
	//  PUBLIC SETTINGS
	// -----------------
	//
	game.settings.register(SYSTEM_ID, "gmMomentumShowToPlayers", {
		name: "Show Overseer AP To Players",
		hint: "Shows the Overseer's AP window to everyone. Requires refresh on the players side.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "maxAppShowToPlayers", {
		name: "Players Can Setup Max AP",
		hint: "Allows players to settup the Party's MAX AP. Requires refresh on the players side.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "automaticAmmunitionCalculation", {
		name: "Ammunition Calculation",
		hint: "Automatically decreases the ammunition count on the character sheet for weapon Items that have the Ammo field populated. Ammunition is decreased: 1. on the initial shot (d20 roll dialog) 2. when adding more dice to the DC (d6 roll dialog) 3. when adding more dice to a previously-rolled DC result (-Add- button in Chat Dialog). It takes in to the account Gatling (x10 ammo consumed) quality. It does NOT automatically reduce the ammo for the Burst effects, Gun-Fu perk, nor for the Accurate qulity.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "applyWearAndTearToWeaponDamage", {
		name: "Apply Wear and Tear to Weapon Damage",
		hint: "Automatically decrease weapon damage dice by the amount of Wear and Tear on the weapon. Weapons become broken if their Base Damage, minus any Wear and Tear, is reduced to zero.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "syncConditionsWithWorldClock", {
		name: "Sync Conditions with World Clock",
		hint: "If enabled player Hunger, Thirst and Rested conditions will be synced with game time. For this to work fully you must have installed/enabled a 3rd party world time module, such as Simple Calendar, which can be used to adjust the game time.  Otherwise time will only be advanced by the Party Sleep tool.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "maxConditionCheckTimeJump", {
		name: "Max Time Jump (hours)",
		hint: "If the game time changes by more than this amount of hours in one step, then ignore it and set the last Hunger, Thirst and Sleep timestamps to the new time.",
		scope: "world",
		config: true,
		default: 13,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "conditionsSkipMissingPlayers", {
		name: "Conditions Skip Missing Players",
		hint: "Skip characters owned by players who are not logged in when changing party condition levels.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "useVariableInitiative", {
		name: "Use Variable Initiative",
		hint: "If enabled the Variable Initiative method as detailed in the Gamemaster's Guide will be used instead of the base game's fixed initiative method.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
		requiresReload: true,
	});


	// -----------------------------------
	//  HOMEBREW / CUSTOMISATION SETTINGS
	// -----------------------------------
	//
	game.settings.register(SYSTEM_ID, "carryUnit", {
		name: "Weight unit",
		hint: "The weight calculation formula will be different depending on the unit chosen",
		scope: "world",
		config: true,
		default: "lbs",
		type: String,
		choices: {
			lbs: "Lbs",
			kgs: "Kgs",
		},
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "carryBase", {
		name: "Base Carry Weight (Characters)",
		hint: "The base carry weight for characters before any STR modifiers are applied",
		scope: "world",
		config: true,
		default: 150,
		type: Number,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "carryBaseRobot", {
		name: "Base Carry Weight (Robots)",
		hint: "The base carry weight for robots before any STR modifiers are applied",
		scope: "world",
		config: true,
		default: 150,
		type: Number,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "baseSettlementStorage", {
		name: "Base Storage for Settlements",
		hint: "The base storage available at settlements before any modifiers from structures are applied",
		scope: "world",
		config: true,
		default: 300,
		type: Number,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "disableAutoXpTarget", {
		name: "Disable Auto-calculated Player Level XP",
		hint: "By default the system will auto-calculate the next level target XP for player characters based on the core rulebook.  Check this if would prefer to populate these values manually.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "disableAutoDerivedStats", {
		name: "Disable Auto-calculated Player Derived Stats",
		hint: "By default the system will auto-calculate derived stats for player characters based on the core rulebook.  Check this if would prefer to populate these values manually.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "disableAutoXpReward", {
		name: "Disable Auto-calculated NPC XP Reward",
		hint: "By default the system will auto-calculate the XP reward level of an NPC based on the core rulebook.  Check this if would prefer to populate these values manually.",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	// ------------------
	// GENERAL SETTINGS
	// ------------------

	// TODO Implement sourceFilters fully once background items and character
	// creation are implemented
	//
	game.settings.register(SYSTEM_ID, "sourceFilters", {
		name: game.i18n.localize("FALLOUT.SETTINGS.sourceFilters.title"),
		hint: game.i18n.localize("FALLOUT.SETTINGS.sourceFilters.hint"),
		config: false,
		scope: "world",
		type: Array,
		requiresReload: true,
		default: [],
	});

	// ----------------
	//  DEBUG SETTINGS
	// ----------------
	//
	game.settings.register(SYSTEM_ID, "debugEnabled", {
		name: "Enable/Disable Debug",
		hint: "Enable or Disable additional debug features",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "worldSchemaVersion", {
		name: "Schema Version",
		hint: "Records the current schema version for the Fallout RPG system data. (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: -1,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "systemVersion", {
		name: "System Version",
		hint: "Records the current Fallout RPG system version number (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: "",
		type: String,
	});

	game.settings.register(SYSTEM_ID, "migrateSystemCompendiums", {
		name: "Migrate System Compendiums",
		hint: "Perform data migration on the built in Fallout RPG system compendiums (don't modify this unless you know what you are doing)",
		scope: "world",
		type: Boolean,
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: false,
		requiresReload: true,
	});
}
