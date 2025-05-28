import { conditionTrackerHook } from "../hooks/conditionTrackerHook.mjs";
import { getChatLogEntryContextHook } from "../hooks/getChatLogEntryContextHook.mjs";
import { hotbarDropHook } from "../hooks/hotbarDropHook.mjs";
import { initiativeHooks } from "../hooks/initiativeHooks.mjs";
import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { readyHook } from "../hooks/readyHook.mjs";
import { renderChatMessageHTMLHook } from "../hooks/renderChatMessageHTMLHook.mjs";
import { settlementActorUpdateHooks } from "../hooks/settlementActorUpdateHooks.mjs";
import { setupHook } from "../hooks/setupHook.mjs";

export const FalloutHooks = {
	attach: () => {
		fallout.debug("Attaching hooks");

		const listeners = [
			conditionTrackerHook,
			getChatLogEntryContextHook,
			hotbarDropHook,
			initiativeHooks,
			preCreateItemHook,
			readyHook,
			renderChatMessageHTMLHook,
			settlementActorUpdateHooks,
			setupHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
