const debounceReload = debounce(() => window.location.reload(), 100)
export function registerSettings() {
    game.settings.register('fallout', 'partyAP', {
        name: 'Party AP',
        scope: 'world',
        config: false,
        default: 0,
        type: Number,
    });
    game.settings.register('fallout', 'gmAP', {
        name: 'GM AP',
        scope: 'world',
        config: false,
        default: 0,
        type: Number,
    });
    game.settings.register('fallout', 'maxAP', {
        name: 'Max AP',
        scope: 'world',
        config: false,
        default: 6,
        type: Number,
    });
    game.settings.register('fallout', "hoversJsonLocation",{
		name: "Mouse Hover JSON file",
        hint: "Location of the json file containing the text for qualities and damage effects.",
		scope: "world",
		config: true,
		default: "systems/fallout/assets/hovers.json",		
		type: String,
        filePicker: true,
        restricted: true,
        onChange: debounceReload
	});
    game.settings.register('fallout', 'gmMomentumShowToPlayers', {
        name: 'Show Overseer AP To Players',
        hint: "Shows the Overseer's AP window to everyone. Requires refresh on the players side.",
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
    });
    game.settings.register('fallout', 'maxAppShowToPlayers', {
        name: 'Players Can Setup Max AP',
        hint: "Allows players to settup the Party's MAX AP. Requires refresh on the players side.",
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
    });
    game.settings.register('fallout', 'automaticAmmunitionCalculation', {
        name:"Ammunition Calculation",
        hint:"Automatically reduces the ammo for the weapons that have the ammo name populated. It reduces the ammo on the initial shot (2d20 roll) as well as on the increasing DC in the damage roll or when adding more dice to the DC previously rolled. It takes in to the account Gatling quality but it does not automatically reduce the ammo for the burst effect.",
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
    })
}
