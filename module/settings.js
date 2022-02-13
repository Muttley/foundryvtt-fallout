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
		name: "JSON file",
        hint: "Location of the json file with the qualities and effects",
		scope: "world",
		config: true,
		default: "systems/fallout/assets/hovers.json",		
		type: String,
        filePicker: true,
        restricted: true,
        onChange: debounceReload
	});
}
