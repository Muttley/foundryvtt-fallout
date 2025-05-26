import { FALLOUT, SYSTEM_ID, SYSTEM_NAME } from "../config.mjs";

import * as apps from "../apps/_module.mjs";
import * as documents from "../documents/_module.mjs";
import * as sheets from "../sheets/_module.mjs";

import { APTracker } from "../apps/APTracker.mjs";
import { Dialog2d20 } from "../roller/Dialog2d20.mjs";
import { DialogD6 } from "../roller/DialogD6.mjs";
import { DieFalloutDamage } from "../roller/DieFalloutDamage.mjs";
import { DieFalloutLocation } from "../roller/DieFalloutLocation.mjs";
import { FalloutHooks } from "../system/FalloutHooks.mjs";
import { FalloutModuleArt } from "../utils/FalloutModuleArt.mjs";
import { Roller2D20 } from "../roller/Roller2D20.mjs";
import FalloutChat from "../system/FalloutChat.mjs";
import FalloutCompendiums from "../documents/FalloutCompendiums.mjs";
import FalloutConditionTracker from "../system/FalloutConditionTracker.mjs";
import FalloutLoading from "../apps/FalloutLoading.mjs";
import FalloutMacros from "../system/FalloutMacros.mjs";
import FalloutUtils from "../utils/FalloutUtils.mjs";
import Logger from "../utils/Logger.mjs";

import preloadHandlebarsTemplates from "../templates.mjs";
import registerHandlebarsHelpers from "../handlebars.mjs";
import registerSettings from "../settings.mjs";
import registerTextEditorEnrichers from "../enrichers.mjs";

export async function initHook() {
	console.debug(`${SYSTEM_NAME} | Running init hook`);

	CONFIG.debug.hooks = true;

	// Add custom constants for configuration.
	CONFIG.FALLOUT = FALLOUT;

	// Override the default status effects
	CONFIG.statusEffects = CONFIG.FALLOUT.statusEffects;

	globalThis.SYSTEM_ID = SYSTEM_ID;
	globalThis.SYSTEM_NAME = SYSTEM_NAME;

	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	globalThis.fallout = {
		APTracker,
		Dialog2d20,
		DialogD6,
		FalloutLoading,
		Roller2D20,
		apps,
		chat: FalloutChat,
		compendiums: FalloutCompendiums,
		conditionTracker: new FalloutConditionTracker(),
		debug: Logger.debug,
		error: Logger.error,
		log: Logger.log,
		macros: FalloutMacros,
		moduleArt: new FalloutModuleArt(),
		utils: FalloutUtils,
		warn: Logger.warn,
	};

	registerSettings();

	const useVariableInitiative = game.settings.get(SYSTEM_ID, "useVariableInitiative");
	CONFIG.Combat.initiative = {
		formula: useVariableInitiative ? "(@initiative.value)dc" : "@initiative.value",
		decimals: 0,
	};

	CONFIG.ActiveEffect.legacyTransferral = false;

	registerDocumentClasses();
	registerDocumentSheets();

	registerDiceSettings();

	registerHandlebarsHelpers();
	registerTextEditorEnrichers();

	preloadHandlebarsTemplates();

	FalloutHooks.attach();
}

function registerDiceSettings() {
	CONFIG.Dice.terms.c = DieFalloutDamage;
	CONFIG.Dice.terms.h = DieFalloutLocation;

	const dieModifiers = fallout.utils.foundryMinVersion(12)
		? foundry.dice.terms.Die.MODIFIERS
		: Die.MODIFIERS;

	// eslint-disable-next-line func-names
	dieModifiers.ef = function minResult(modifier) {
		this.results = this.results.flatMap(result => {
			if (result.result < 5) {
				result.active = false;
				result.discarded = true;
			}
			DiceTerm._applyCount(this.results, ">", 4, { flagSuccess: true });
			return [result];
		});
	};

	// eslint-disable-next-line func-names
	dieModifiers.sum = function minResult(modifier) {
		this.results = this.results.flatMap(result => {
			if (result.result === 1 || result.result === 5 || result.result === 6) {
				result.active = true;
				result.discarded = false;
				result.success = true;
				result.count = 1;
			}
			else if (result.result === 2) {
				result.active = true;
				result.discarded = false;
				result.success = true;
				result.count = 2;
			}
			else {
				result.active = true;
				result.discarded = true;
				result.success = false;
				result.count = 0;
			}

			return [result];
		});
	};
}

function registerDocumentClasses() {
	CONFIG.Actor.documentClass = documents.FalloutActor;
	CONFIG.Item.documentClass = documents.FalloutItem;
}

function registerDocumentSheets() {
	const documentCollections = foundry.documents.collections;

	documentCollections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
	documentCollections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);

	documentCollections.Actors.registerSheet("fallout", sheets.FalloutCreatureSheet, {
		makeDefault: true,
		types: ["creature"],
	});

	documentCollections.Actors.registerSheet("fallout", sheets.FalloutNpcSheet, {
		makeDefault: true,
		types: ["npc"],
	});

	documentCollections.Actors.registerSheet("fallout", sheets.FalloutPcSheet, {
		makeDefault: true,
		types: ["character", "robot"],
	});

	documentCollections.Actors.registerSheet("fallout", sheets.FalloutScavengingLocationSheet, {
		makeDefault: true,
		types: ["scavenging_location"],
	});

	documentCollections.Actors.registerSheet("fallout", sheets.FalloutSettlementSheet, {
		makeDefault: true,
		types: ["settlement"],
	});

	documentCollections.Actors.registerSheet("fallout", sheets.FalloutVehicleSheet, {
		makeDefault: true,
		types: ["vehicle"],
	});

	documentCollections.Items.registerSheet("fallout", sheets.FalloutItemSheet, { makeDefault: true });
}
