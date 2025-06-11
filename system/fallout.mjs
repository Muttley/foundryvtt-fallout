import { diceSoNiceReadyHook } from "./src/hooks/diceSoNiceReadyHook.mjs";
import { itemPilesReadyHook } from "./src/hooks/itemPilesReadyHook.mjs";
import { initHook } from "./src/hooks/initHook.mjs";

Hooks.once("init", initHook);
Hooks.once("diceSoNiceReady", diceSoNiceReadyHook);
Hooks.once("item-piles-ready", itemPilesReadyHook);
