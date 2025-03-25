export const getChatLogEntryContextHook = {
	attach: () => {
		fallout.logger.debug("Attaching getChatLogEntryContext hook");

		Hooks.on("getChatLogEntryContext", (html, options) => {
			fallout.logger.debug("Running getChatLogEntryContext hook");

			const canAdvanceTime = function(li) {
				const message = game.messages.get(li.attr("data-message-id"));
				const messageData = message.flags.data;

				return (game.user.isGM && messageData?.type === "salvage-junk");
			};

			options.push({
				name: game.i18n.localize("FALLOUT.APP.SalvageJunk.AdvanceGameTime"),
				icon: "<i class=\"fas fa-clock\"></i>",
				condition: canAdvanceTime,
				callback: li => {
					const message = game.messages.get(li.attr("data-message-id"));
					const messageData = message.flags.data;

					if (messageData.type !== "salvage-junk") {
						return;
					}

					game.time.advance(messageData.timeToSalvageMins * 60);

					return ui.notifications.info(
						game.i18n.format(
							"FALLOUT.APP.SalvageJunk.gameTimeAdvanced",
							{time: messageData.timeToSalvage}
						),
						{permanent: false}
					);
				},
			});

			options.sort((a, b) => a.name.localeCompare(b.name));
		});
	},
};
