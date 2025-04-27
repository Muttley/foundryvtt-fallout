import FalloutChat from "../system/FalloutChat.mjs";

export const renderChatMessageHook = {
	attach: () => {
		fallout.debug("Attaching renderChatMessage hook");

		Hooks.on("renderChatMessage", FalloutChat.onRenderChatMessage);
	},
};
