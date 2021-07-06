class APTracker extends Application {
    constructor(options = {}) {
        if (APTracker._instance) {
            throw new Error("APTracker already has an instance!!!");
        }
        super(options);
        APTracker._instance = this;
        this.data = { select1: null, select2: null, submitted: false, opponentSelect1: null, opponentSelect2: null, reveal1: false, reveal2: false };
    }

    // override
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "AP Tracker",
            template: "systems/fallout/templates/ap/ap-tracker.html",
            classes: ["fallout", "ap-tracker", "sheet"],
            id: "ap-tracker-app",
            width: "300",
            height: "400",
        });
    }

    getData() {
        this.data["isGM"] = game.user.isGM;
        return this.data;
    }

    static renderApTracker() {
        APTracker._instance.render(true);
    }
}