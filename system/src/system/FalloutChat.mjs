export class FalloutChat {

	static async onRenderChatMessage(message, html, data) {
		fallout.logger.debug("Running renderChatMessage hook");

		const rerollButton = html.find(".reroll-button");

		if (rerollButton.length > 0) {
			rerollButton[0].setAttribute("data-messageId", message.id);

			rerollButton.click(el => {
				const selectedDiceForReroll = html.find(".dice-selected");
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
					fallout.Roller2D20.rerollD6({
						dicesRolled: falloutRoll.dicesRolled,
						rerollIndexes: rerollIndex,
						rollname: falloutRoll.rollname,
						weapon: message.flags.weapon,
					});
				}
				else {
					ui.notifications.notify("No dice face recognised");
				}
			});
		}

		html.find(".dice-icon").click(el => {
			if ($(el.currentTarget).hasClass("dice-selected")) {
				$(el.currentTarget).removeClass("dice-selected");
			}
			else {
				$(el.currentTarget).addClass("dice-selected");
			}
		});

		const addButton = html.find(".add-button");

		if (addButton.length > 0) {
			addButton[0].setAttribute("data-messageId", message.id);

			addButton.click(ev => {
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
		}
	}
}
