export class APTracker extends Application {

	constructor(options={}) {
		if (APTracker._instance) {
			throw new Error("APTracker already has an instance!!!");
		}

		super(options);

		APTracker._instance = this;
		APTracker.closed = true;
	}


	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
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

			const currentValue = game.settings.get(SYSTEM_ID, type);
			const newValue = parseInt(currentValue) + change;

			APTracker.setAP(type, newValue);
		});

		html.find(".toggle-maxAp").click(ev => {
			html.find(".ap-resource.maxAP-box").slideToggle("fast", function() {
				APTracker.closed = !APTracker.closed;
			});
		});
	}


	static async adjustAP(type, diff) {
		if (!game.user.isGM) {
			game.socket.emit("system.fallout", {
				operation: "adjustAP",
				data: { diff, type },
			});
			return;
		}

		diff = Math.round(diff);

		let momentum = game.settings.get(SYSTEM_ID, type);
		momentum += diff;

		this.setAP(type, momentum);
	}


	getData() {
		const data = {
			gmAP: game.settings.get(SYSTEM_ID, "gmAP"),
			isGM: game.user.isGM,
			maxAP: game.settings.get(SYSTEM_ID, "maxAP"),
			partyAP: game.settings.get(SYSTEM_ID, "partyAP"),
		};

		data.showGMMomentumToPlayers = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "gmMomentumShowToPlayers");

		data.maxAppShowToPlayers = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "maxAppShowToPlayers");

		return data;
	}


	static async initialise() {
		if (this._instance) {
			return;
		}

		fallout.logger.debug("Initialising APTracker");
		new APTracker();

		this.renderApTracker();
		this.registerSocketEvents();
	}


	static async registerSocketEvents() {
		fallout.logger.debug("Registering APTracker socket events");

		game.socket.on("system.fallout", ev => {
			if (ev.operation === "adjustAP") {
				if (game.user.isGM) {
					this.adjustAP(ev.data.type, ev.data.diff);
				}
			}

			if (ev.operation === "setAP") {
				if (game.user.isGM) {
					this.setAP(ev.data.type, ev.data.value);
				}
			}

			if (ev.operation === "updateAP") {
				this.updateAP();
			}
		});
	}


	static renderApTracker() {
		if (APTracker._instance) {
			APTracker._instance.render(true);
		}
	}


	static async setAP(type, value) {
		if (!game.user.isGM) {
			game.socket.emit("system.fallout", {
				operation: "setAP",
				data: { value: value, type: type },
			});
			return;
		}

		value = Math.round(value);
		value = Math.max(0, value);

		const maxAP = await game.settings.get(SYSTEM_ID, "maxAP");

		if (type === "partyAP") {
			value = Math.min(value, maxAP);
		}

		if (type === "maxAP") {
			const currentPartyAP =
				await game.settings.get(SYSTEM_ID, "partyAP");

			const newPartyAP = Math.min(value, currentPartyAP);

			await game.settings.set(SYSTEM_ID, "partyAP", newPartyAP);
		}

		await game.settings.set(SYSTEM_ID, type, value);

		APTracker.renderApTracker();

		// emit socket event for the players to update
		game.socket.emit("system.fallout", { operation: "updateAP" });
	}


	static updateAP() {
		APTracker.renderApTracker();
	}
}
