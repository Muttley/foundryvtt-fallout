import FalloutChat from "../system/FalloutChat.mjs";

export const renderChatMessageHTMLHook = {
	attach: () => {
		fallout.debug("Attaching renderChatMessageHTML hook");

		Hooks.on("renderChatMessageHTML", FalloutChat.onRenderChatMessageHTML);
	},
};
