export default class FalloutChat {

	static async _renderChatMessage(
		actor,
		data,
		template,
		mode
	) {
		const html = await foundry.applications.handlebars.renderTemplate(template, data);

		if (!mode) {
			mode = game.settings.get("core", "rollMode");
		}

		const messageStyles = fallout.utils.getMessageStyles();

		const chatData = {
			user: game.user.id,
			speaker: ChatMessage.getSpeaker({
				actor: actor,
			}),
			rollMode: mode,
			content: html,
			type: messageStyles.OTHER,
		};

		ChatMessage.applyRollMode(chatData, mode);

		await ChatMessage.create(chatData);
	}

	static async renderGeneralMessage(actor, data, mode) {
		this._renderChatMessage(actor, data,
			"systems/fallout/templates/chat/general.hbs",
			mode
		);
	}

	static async renderConditionChangeMessage(actor, data, mode) {
		this._renderChatMessage(actor, data,
			"systems/fallout/templates/chat/condition-change.hbs",
			mode
		);
	}

	static async renderConsumptionMessage(actor, data, mode) {
		this._renderChatMessage(actor, data,
			"systems/fallout/templates/chat/consumption.hbs",
			mode
		);
	}

	static async renderPartySleepMessage(data, mode) {
		this._renderChatMessage(null, data,
			"systems/fallout/templates/chat/party-sleep.hbs",
			mode
		);
	}

	static async renderReadMagazineMessage(actor, data, mode) {
		this._renderChatMessage(actor, data,
			"systems/fallout/templates/chat/read-magazine.hbs",
			mode
		);
	}

	static async renderResetLuckPointsMessage(data, mode) {
		this._renderChatMessage(null, data,
			"systems/fallout/templates/chat/reset-luck-points.hbs",
			mode
		);
	}

	static async onRenderChatMessageHTML(message, html, context) {
		fallout.debug("Running renderChatMessage hook");

		html.querySelectorAll(".reroll-button").forEach(element => {
			element.setAttribute("data-messageId", message.id);

			element.addEventListener("click", async event => {
				const selectedDiceForReroll =
					html.querySelectorAll(".dice-selected");

				const rerollIndex = [];

				for (let d of selectedDiceForReroll) {
					rerollIndex.push($(d).data("index"));
				}

				if (!rerollIndex.length) {
					return ui.notifications.notify(
						"Select Dice you want to Reroll"
					);
				}

				let falloutRoll = message.flags.falloutroll;

				if (falloutRoll.diceFace === "d20") {
					fallout.Roller2D20.rerollD20({
						complicationTreshold: falloutRoll.complicationTreshold,
						critTreshold: falloutRoll.critTreshold,
						dicesRolled: falloutRoll.dicesRolled,
						rerollIndexes: rerollIndex,
						rollname: falloutRoll.rollname,
						successTreshold: falloutRoll.successTreshold,
					});
				}
				else if (falloutRoll.diceFace === "d6") {
					let weapon = message.flags.weapon;
					if (message.flags.weapon) {
						weapon = await fromUuid(message.flags.weapon.uuid);
					}

					fallout.Roller2D20.rerollD6({
						actor: message.flags.actor,
						dicesRolled: falloutRoll.dicesRolled,
						rerollIndexes: rerollIndex,
						rollname: falloutRoll.rollname,
						weapon,
					});
				}
				else {
					ui.notifications.notify("No dice face recognised");
				}

			});
		});

		html.querySelectorAll(".dice-icon").forEach(element => {
			element.addEventListener("click", event => {
				const target = event.currentTarget;
				if (target.classList.contains("dice-selected")) {
					target.classList.remove("dice-selected");
				}
				else {
					target.classList.add("dice-selected");
				}
			});
		});

		html.querySelectorAll(".add-button").forEach(element => {
			element.setAttribute("data-messageId", message.id);

			element.addEventListener("click", ev => {
				const actor = message.flags.actor;
				const falloutRoll = message.flags.falloutroll;
				const weapon = message.flags.weapon;

				fallout.DialogD6.createDialog({
					rollname: falloutRoll.rollname,
					diceNum: 1,
					falloutRoll: falloutRoll,
					weapon: weapon,
					actor: actor,
				});
			});
		});
	}
}
