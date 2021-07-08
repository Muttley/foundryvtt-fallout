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
}