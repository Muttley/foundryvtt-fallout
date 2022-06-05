export class FOHovers{
    static LIST = {}
    static async loadList(){
        const listLocation = await game.settings.get('fallout', 'hoversJsonLocation')
        const jsonFile = await fetch(listLocation)
        const content = await jsonFile.json();
        FOHovers.LIST = content;  
    }  
}

// INITIALIZE SETTINGS in settings.js
// allow a path to hovers.json to be changed


// Load JSON List
Hooks.on('ready', async () => {
    await game.fallout.FOHovers.loadList();
});

Hooks.on('renderActorSheet', (app, html, options) => {
    html.find('.hover').each(function(i){
        const title = game.fallout.FOHovers.LIST[$(this).data('key')]
        $(this).prop('title', title)
    })
});

Hooks.on('renderItemSheet', (app, html, options) => {
    html.find('.hover').each(function(i){
        const title = game.fallout.FOHovers.LIST[$(this).data('key')]
        $(this).prop('title', title)
    })
});