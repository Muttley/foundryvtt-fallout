import { SYSTEM_ID } from "../config.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class APTrackerV2
	extends HandlebarsApplicationMixin(ApplicationV2) {

	static #instance;

	static #maxClosed;

	constructor(options = {}) {
		if (APTrackerV2.#instance) {
			throw new Error("Attempted to create multiple instances of the APTrackerV2 singleton.");
		}

		super(options);

		APTrackerV2.#instance = this;
		APTrackerV2.#maxClosed = true;
	}


	static get instance() {
		if (!APTrackerV2.#instance) {
			new APTrackerV2(APTrackerV2.DEFAULT_OPTIONS);
		}

		return APTrackerV2.#instance;
	}


	static DEFAULT_OPTIONS = {
		actions: {
			decrementPool: APTrackerV2._onDecrementPool,
			incrementPool: APTrackerV2._onIncrementPool,
			toggleMaxAP: APTrackerV2._onToggleMaxAP,
		},
		id: "ap-tracker-app",
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
			handler: APTrackerV2.#onSubmit,
		},
		tag: "form",
		classes: ["fallout", "ap-tracker"],
		window: {
			frame: false,
			positioned: false,
		},
	};


	static PARTS = {
		form: {
			root: true,
			template: templatePath("apps/ap-tracker"),
		},
	};


	async #onChange(event, form, formData) {
		const type = event.target.dataset?.type;
		const value = parseInt(event.target.value);

		await APTrackerV2.setAP(type, value);

		return this.render(true);
	}


	static async #onSubmit(event, form, formData) {
		if (event.type === "change") {
			return this.#onChange(event, form, formData);
		}
	}


	static async _onDecrementPool(event, target) {
		const {type} = target?.dataset ?? undefined;

		if (type) {
			APTrackerV2.adjustAP(type, -1);
		}
	}


	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);

		// Move the element into the ui-left stack.
		const uiBottom = document.querySelector("#ui-bottom");
		if (!uiBottom) {
			fallout.error("Error: Could not find #ui-bottom!");
			return;
		}

		const hotbar = uiBottom.querySelector("#hotbar");
		if (!hotbar) {
			fallout.warn(
				"Could not find hotbar HTML element, appending Momentum Tracker to end of ui-bottom."
			);
			uiBottom.appendChild(this.element);
			return;
		}

		uiBottom.insertBefore(this.element, hotbar);
	}


	static async _onIncrementPool(event, target) {
		const {type} = target?.dataset ?? undefined;

		if (type) {
			APTrackerV2.adjustAP(type, 1);
		}
	}


	async _onRender(context, options) {
		const maxAP = this.element.querySelector(".maxAP-box");
		if (maxAP) {
			maxAP.hidden = APTrackerV2.#maxClosed;
		}
	}


	static async _onToggleMaxAP(event, target) {
		APTrackerV2.#maxClosed = !APTrackerV2.#maxClosed;
		this.element.querySelector(".maxAP-box").hidden = APTrackerV2.#maxClosed;
	}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		context.gmAP = game.settings.get(SYSTEM_ID, "gmAP");
		context.isGM = game.user.isGM;
		context.maxAP = game.settings.get(SYSTEM_ID, "maxAP");
		context.partyAP = game.settings.get(SYSTEM_ID, "partyAP");

		context.showGMMomentumToPlayers = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "gmMomentumShowToPlayers");

		context.maxAppShowToPlayers = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "maxAppShowToPlayers");

		return context;
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


	static async initialise() {
		fallout.debug("Initialising APTrackerV2");

		if (this.instance) {
			this.renderApTracker();
			this.registerSocketEvents();
		}

	}


	static async registerSocketEvents() {
		fallout.debug("Registering APTracker socket events");

		game.socket.on("system.fallout", ev => {
			if (ev.operation === "adjustAP") {
				if (game.user.isGM) {
					APTrackerV2.adjustAP(ev.data.type, ev.data.diff);
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
		if (APTrackerV2.#instance) {
			APTrackerV2.#instance.render(true);
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

		APTrackerV2.renderApTracker();

		// emit socket event for the players to update
		game.socket.emit("system.fallout", { operation: "updateAP" });
	}


	static updateAP() {
		APTrackerV2.renderApTracker();
	}
}
