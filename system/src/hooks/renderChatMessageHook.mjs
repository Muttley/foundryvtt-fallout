import { FalloutChat } from "../system/FalloutChat.mjs";

export const renderChatMessageHook = {
	attach: () => {
		game.fallout.logger.debug("Hook Attach: renderChatMessage");

		Hooks.on("renderChatMessage", FalloutChat.onRenderChatMessage);
	},
};
