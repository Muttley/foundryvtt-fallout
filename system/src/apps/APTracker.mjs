export class APTracker extends Application {

	constructor(options={}) {
		if (APTracker._instance) {
			throw new Error("APTracker already has an instance!!!");
		}

		super(options);

		APTracker._instance = this;
		APTracker.closed = true;

		this.data = {};
	}


	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fallout", "ap-tracker"],
			height: "200",
			id: "ap-tracker-app",
			popOut: false,
			resizable: false,
			template: "systems/fallout/templates/apps/ap-tracker.hbs",
			title: "AP Tracker",
			width: "auto",
		});
	}

	// override
	getData() {
		super.getData();

		const maxAppShowToPlayers = game.settings.get(
			"fallout", "maxAppShowToPlayers"
		);
		this.data.maxAppShowToPlayers = game.user.isGM || maxAppShowToPlayers;

		const showGMMomentumToPlayers = game.settings.get(
			"fallout", "gmMomentumShowToPlayers"
		);
		this.data.showGMMomentumToPlayers =
			game.user.isGM || showGMMomentumToPlayers;

		this.data.gmAP = game.settings.get("fallout", "gmAP");
		this.data.maxAP = game.settings.get("fallout", "maxAP");
		this.data.partyAP = game.settings.get("fallout", "partyAP");

		this.data.isGM = game.user.isGM;

		return this.data;
	}

	static async initialise() {
		if (this._instance) return;

		fallout.logger.debug("Initialising APTracker");
		new APTracker();

		this.renderApTracker();
		this.registerSocketEvents();
	}

	static renderApTracker() {
		if (APTracker._instance) APTracker._instance.render(true);
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (APTracker.closed) {
			html.find(".ap-resource.maxAP-box").css("display", "none");
		}

		html.find(".ap-input").change(ev => {
			const type = $(ev.currentTarget).parents(".ap-resource").attr("data-type");
			const value = ev.target.value;

			APTracker.setAP(type, value);
		});

		html.find(".ap-add, .ap-sub").click(ev => {
			const type = $(ev.currentTarget).parents(".ap-resource").attr("data-type");

			const change = $(ev.currentTarget).hasClass("ap-add") ? 1 : -1;

			const currentValue = game.settings.get("fallout", type);

			const maxAP = game.settings.get("fallout", "maxAP");

			if (parseInt(currentValue) < maxAP || parseInt(currentValue) > 0) {
				const newValue = parseInt(currentValue) + change;
				APTracker.setAP(type, newValue);
			}

		});

		html.find(".toggle-maxAp").click(ev => {
			html.find(".ap-resource.maxAP-box").slideToggle("fast", function() {
				APTracker.closed = !APTracker.closed;
			});
		});
	}

	static async registerSocketEvents() {
		fallout.logger.debug("Registering APTracker socket events");

		game.socket.on("system.fallout", ev => {
			if (ev.operation === "setAP") {
				if (game.user.isGM) {
					this.setAP(ev.data.type, ev.data.value);
				}
			}

			if (ev.operation === "updateAP") this.updateAP();
		});
	}

	static async setAP(type, value) {
		value = Math.round(value);

		if (!game.user.isGM) {
			game.socket.emit("system.fallout", {
				operation: "setAP",
				data: { value: value, type: type },
			});
			return;
		}

		let maxAP = game.settings.get("fallout", "maxAP");
		let partyAP = game.settings.get("fallout", "partyAP");

		if (partyAP > value && type === "maxAP") {
			await game.settings.set("fallout", "maxAP", value);
			await game.settings.set("fallout", "partyAP", value);

			APTracker.renderApTracker();

			game.socket.emit("system.fallout", { operation: "updateAP" });
			return;
		}

		if (value > maxAP && type === "partyAP") {
			await game.settings.set("fallout", type, maxAP);

			APTracker.renderApTracker();
		}
		else if (value < 0) {
			await game.settings.set("fallout", type, 0);

			APTracker.renderApTracker();
		}
		else {
			await game.settings.set("fallout", type, value);

			APTracker.renderApTracker();
		}

		// emit socket event for the players to update
		game.socket.emit("system.fallout", { operation: "updateAP" });
	}

	static updateAP() {
		APTracker.renderApTracker();
	}
}
