import { conditionTrackerHook } from "../hooks/conditionTrackerHook.mjs";
import { hotbarDropHook } from "../hooks/hotbarDropHook.mjs";
import { initiativeHooks } from "../hooks/initiativeHooks.mjs";
import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { readyHook } from "../hooks/readyHook.mjs";
import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";
import { settlementActorUpdateHooks } from "../hooks/settlementActorUpdateHooks.mjs";
import { setupHook } from "../hooks/setupHook.mjs";

export const FalloutHooks = {
	attach: () => {
		fallout.logger.debug("Attaching hooks");

		const listeners = [
			conditionTrackerHook,
			hotbarDropHook,
			initiativeHooks,
			preCreateItemHook,
			readyHook,
			renderChatMessageHook,
			settlementActorUpdateHooks,
			setupHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
