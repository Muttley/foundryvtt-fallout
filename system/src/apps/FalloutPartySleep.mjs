import { SYSTEM_ID } from "../config.mjs";

export default class FalloutPartySleep extends Application {

	constructor(object, options={}) {
		super(object, options);

		this.lengthOfSleep = 6;
		this.safeLocation = false;
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			id: "party-sleep",
			classes: ["fallout", "party-sleep"],
			template: "systems/fallout/templates/apps/party-sleep.hbs",
			width: 300,
			height: "auto",
			// width: "auto",
			submitOnChange: false,
		});
	}

	get title() {
		return `${game.i18n.localize("FALLOUT.APP.PartySleep.title")}`;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find("#lengthOfSleep").on("input", event => {
			event.preventDefault();
			this.lengthOfSleep = parseInt(event.target.value);
			html.find("#sleepSubmitButton").html(this._buttonText());
		});

		html.find("#safeLocation").on("input", event => {
			event.preventDefault();
			this.safeLocation = event.target.value === "on" ? true : false;
		});

		html.find("#lengthOfSleep").keyup(event => {
			event.preventDefault();

			let currentValue = this.lengthOfSleep;

			if (event.keyCode === 37) {
				currentValue = currentValue > 1
					? currentValue--
					: currentValue;
			}
			else if (event.keyCode === 39) {
				currentValue = currentValue < 25
					? currentValue++
					: currentValue;
			}

			if (currentValue !== this.lengthOfSleep) {
				this.lengthOfSleep = currentValue;
				html.find("#sleepSubmitButton").html(this._buttonText());
			}
		});

		html.find("#lengthOfSleep").on("wheel", event => {
			event.preventDefault();

			let currentValue = this.lengthOfSleep;

			if (event.originalEvent.deltaY > 0) currentValue--;
			if (event.originalEvent.deltaY < 0) currentValue++;

			if (currentValue < 1) currentValue = 1;
			if (currentValue > 24) currentValue = 24;

			if (currentValue !== this.lengthOfSleep) {
				this.lengthOfSleep = currentValue;
				html.find("#sleepSubmitButton").html(this._buttonText());
			}
		});

		html.find("#sleepSubmitButton").click(event => {
			event.preventDefault();
			this._applyPartySleep();
		});
	}

	getData() {
		const data = {
			lengthOfSleep: this.lengthOfSleep,
			safeLocation: this.safeLocation,
		};

		return data;
	}

	_buttonText() {
		return `<i class="fa-solid fa-bed"></i>&nbsp;${this._durationText()}`;
	}

	_durationText() {
		if (this.lengthOfSleep > 1) {
			return game.i18n.format("FALLOUT.APP.PartySleep.hours", {
				length: this.lengthOfSleep,
			});
		}
		else {
			return game.i18n.format("FALLOUT.APP.PartySleep.hour");
		}
	}

	async _applyPartySleep() {
		fallout.logger.debug(`Party Sleep: The party sleeps for ${this.lengthOfSleep} hours`);

		const actors = game.actors.filter(
			a => a.hasPlayerOwner && a.type === "character"
		).sort(
			(a, b) => a.name.localeCompare(b.name)
		);

		const skipMissingPlayers = game.settings.get(
			SYSTEM_ID, "conditionsSkipMissingPlayers"
		);

		const newRestedStatus = [];

		const hasActiveFatigue = {};

		// Flag these actors as sleeping to avoid spurious sleep condition
		// changes while we're processing the sleep period
		//
		for (const actor of actors) {
			actor.isSleeping = true;

			const hungerFatigue = actor.system.conditions.hunger
				>= CONFIG.FALLOUT.CONDITIONS.hunger.starving;

			const thirstFatigue = actor.system.conditions.thirst
				>= CONFIG.FALLOUT.CONDITIONS.thirst.dehydrated;

			const activeEffectFatigue = actor.isFieldOverridden(
				"system.conditions.fatigue"
			);

			hasActiveFatigue[actor._id] =
				hungerFatigue || thirstFatigue || activeEffectFatigue;

		}

		await game.time.advance(this.lengthOfSleep * 60 * 60);

		for (const actor of actors) {
			let actorCanBeProcessed = true;

			if (skipMissingPlayers) actorCanBeProcessed = actor.ownerIsOnline;

			if (actorCanBeProcessed) {
				await actor.sleep(
					this.lengthOfSleep,
					this.safeLocation,
					hasActiveFatigue[actor._id]
				);

				const newSleep = actor.system.conditions?.sleep ?? 0;

				newRestedStatus.push({
					fatigue: actor.system.conditions?.fatigue ?? 0,
					name: actor.name,
					sleep: CONFIG.FALLOUT.SLEEP_BY_NUMBER[newSleep],
					wellRested: actor.isWellRested,
				});
			}
			else {
				fallout.logger.debug(
					`Party Sleep: The owner of ${actor.name} is not online so they will not sleep.`
				);
			}

			actor.isSleeping = false;
		}

		fallout.chat.renderPartySleepMessage({
			title: this.title,
			body: game.i18n.format(
				"FALLOUT.APP.PartySleep.chat_message",
				{
					duration: this._durationText(),
				}
			),
			actors: newRestedStatus,
		});

		this.close();
	}
}
