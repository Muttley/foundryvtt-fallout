const debounceReload = debounce(() => window.location.reload(), 100);

export function registerSettings() {
	game.settings.register("fallout", "skillsCompendium", {
		name: "Skills Compendium",
		hint: "Compendium of skills to be used at character's creation. World compendiums should start with the 'world' prefix (ex. world.my-skills). The default compendium is 'fallout.skills'.",
		scope: "world",
		config: true,
		default: "fallout.skills",
		type: String,
	});

	game.settings.register("fallout", "partyAP", {
		name: "Party AP",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register("fallout", "gmAP", {
		name: "GM AP",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register("fallout", "maxAP", {
		name: "Max AP",
		scope: "world",
		config: false,
		default: 6,
		type: Number,
	});

	game.settings.register("fallout", "hoversJsonLocation", {
		name: "Mouse Hover JSON file",
		hint: "Location of the json file containing the text for qualities and damage effects.",
		scope: "world",
		config: true,
		default: "systems/fallout/assets/hovers.json",
		type: String,
		filePicker: true,
		restricted: true,
		onChange: debounceReload,
	});

	game.settings.register("fallout", "gmMomentumShowToPlayers", {
		name: "Show Overseer AP To Players",
		hint: "Shows the Overseer's AP window to everyone. Requires refresh on the players side.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("fallout", "maxAppShowToPlayers", {
		name: "Players Can Setup Max AP",
		hint: "Allows players to settup the Party's MAX AP. Requires refresh on the players side.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register("fallout", "automaticAmmunitionCalculation", {
		name: "Ammunition Calculation",
		hint: "Automatically decreases the ammunition count on the character sheet for weapon Items that have the Ammo field populated. Ammunition is decreased: 1. on the initial shot (d20 roll dialog) 2. when adding more dice to the DC (d6 roll dialog) 3. when adding more dice to a previously-rolled DC result (-Add- button in Chat Dialog). It takes in to the account Gatling (x10 ammo consumed) quality. It does NOT automatically reduce the ammo for the Burst effects, Gun-Fu perk, nor for the Accurate qulity.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register("fallout", "carryUnit", {
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
		onChange: s => {},
	});

	game.settings.register("fallout", "carryBase", {
		name: "Starting Carry Base for Characters",
		hint: "Starting Carry Weight unmodified by STR",
		scope: "world",
		config: true,
		default: 150,
		type: Number,
		onChange: debounceReload,
	});

	game.settings.register("fallout", "carryBaseRobot", {
		name: "Starting Carry Base for Robots",
		hint: "Starting Carry Weight unmodified by STR",
		scope: "world",
		config: true,
		default: 150,
		type: Number,
		onChange: debounceReload,
	});
}
