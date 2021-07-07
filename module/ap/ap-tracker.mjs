export class APTracker extends Application {
    constructor(options = {}) {
        if (APTracker._instance) {
            throw new Error("APTracker already has an instance!!!");
        }
        super(options);
        APTracker._instance = this;
        this.data = {};
    }
    // override
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "AP Tracker",
            template: "systems/fallout/templates/ap/ap-tracker.html",
            classes: ["fallout", "ap-tracker"],
            id: "ap-tracker-app",
            popOut: false,
            resizable: false,
            width: "auto",
            height: "200"
        });
    }
    // override
    getData() {
        super.getData();
        this.data["isGM"] = game.user.isGM;
        this.data["partyAP"] = game.settings.get('fallout', 'partyAP');
        this.data["gmAP"] = game.settings.get('fallout', 'gmAP');
        return this.data;
    }

    static renderApTracker() {
        if (APTracker._instance)
            APTracker._instance.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.ap-input').change(ev => {
            const type = $(ev.currentTarget).parents('.ap-resource').attr('data-type');
            const value = ev.target.value;
            APTracker.setAP(type, value);
        });

        html.find('.ap-add, .ap-sub').click(ev => {
            const type = $(ev.currentTarget).parents('.ap-resource').attr('data-type');
            const change = $(ev.currentTarget).hasClass('ap-add') ? 1 : -1;
            let currentValue = game.settings.get('fallout', type);
            if (parseInt(currentValue) < 10 || parseInt(currentValue) > 0) {
                let newValue = parseInt(currentValue) + change;
                APTracker.setAP(type, newValue);
            }

        });
    }

    static async setAP(type, value) {
        value = Math.round(value);
        if (!game.user.isGM) {
            game.socket.emit('system.fallout', {
                operation: 'setAP',
                data: { 'value': value, 'type': type },
            });
            return;
        }

        if (value > 10 && type === 'partyAP') {
            await game.settings.set('fallout', type, 10);
            APTracker.renderApTracker();
        } else if (value < 0) {
            await game.settings.set('fallout', type, 0);
            APTracker.renderApTracker();
        } else {
            await game.settings.set('fallout', type, value);
            APTracker.renderApTracker();
        }

        // emit socket event for the players to update
        game.socket.emit('system.fallout', { operation: 'updateAP' });
    }

    static updateAP() {
        APTracker.renderApTracker();
    }
}

Hooks.once("ready", () => {
    if (APTracker._instance) return;
    let ap = new APTracker();
    APTracker.renderApTracker();
    game.socket.on("system.fallout", (ev) => {
        if (ev.operation === "setAP") {
            if (game.user.isGM)
                APTracker.setAP(ev.data.type, ev.data.value);
        }
        if (ev.operation === "updateAP") APTracker.updateAP();
    });
});