import { diceSoNiceReadyHook } from "./src/hooks/diceSoNiceReadyHook.mjs";
import { initHook } from "./src/hooks/initHook.mjs";

Hooks.once("init", initHook);
Hooks.once("diceSoNiceReady", diceSoNiceReadyHook);
