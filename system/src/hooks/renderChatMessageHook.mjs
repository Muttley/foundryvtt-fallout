import FalloutChat from "../system/FalloutChat.mjs";

export const renderChatMessageHook = {
	attach: () => {
		fallout.logger.debug("Attaching renderChatMessage hook");

		Hooks.on("renderChatMessage", FalloutChat.onRenderChatMessage);
	},
};
