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

	// -----------------
	//  PUBLIC SETTINGS
	// -----------------
	//
	game.settings.register(SYSTEM_ID, "skillsCompendium", {
		name: "Skills Compendium",
		hint: "Compendium of skills to be used at character's creation. World compendiums should start with the 'world' prefix (ex. world.my-skills). The default compendium is 'fallout.skills'.",
		scope: "world",
		config: true,
		default: "fallout.skills",
		type: String,
	});


	game.settings.register(SYSTEM_ID, "hoversJsonLocation", {
		name: "Mouse Hover JSON file",
		hint: "Location of the json file containing the text for qualities and damage effects.",
		scope: "world",
		config: true,
		default: "systems/fallout/assets/hovers.json",
		type: String,
		filePicker: true,
		restricted: true,
		requiresReload: true,
	});

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
		hint: "Records the current schema version for the Fallout 2d20 system data. (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: -1,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "systemVersion", {
		name: "System Version",
		hint: "Records the current Fallout 2d20 system version number (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: "",
		type: String,
	});

}
