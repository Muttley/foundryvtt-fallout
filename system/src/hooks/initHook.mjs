import { FALLOUT, SYSTEM_ID, SYSTEM_NAME } from "../helpers/config.mjs";

import { APTracker } from "../ap/ap-tracker.mjs";
import { Dialog2d20 } from "../roller/dialog2d20.mjs";
import { DialogD6 } from "../roller/dialogD6.mjs";
import { DieFalloutDamage } from "../roller/damageDie.mjs";
import { DieFalloutLocation } from "../roller/locationDie.mjs";
import { FalloutHooks } from "../system/FalloutHooks.mjs";
import { FOHovers } from "../helpers/hovers.mjs";
import { Roller2D20 } from "../roller/fo2d20-roller.mjs";

import * as documents from "../documents/_module.mjs";
import * as sheets from "../sheets/_module.mjs";

import FalloutMacros from "../system/FalloutMacros.mjs";
import Logger from "../utils/Logger";

import { preloadHandlebarsTemplates } from "../helpers/templates.mjs";
import { registerHandlebarsHelpers } from "../helpers/handlebars.mjs";
import { registerSettings } from "../settings.mjs";
import { registerTextEditorEnrichers } from "../enrichers.mjs";

export async function initHook() {
	console.debug(`${SYSTEM_NAME} | Running init hook`);

	// Add custom constants for configuration.
	CONFIG.FALLOUT = FALLOUT;

	globalThis.SYSTEM_ID = SYSTEM_ID;
	globalThis.SYSTEM_NAME = SYSTEM_NAME;

	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	globalThis.fallout = {
		APTracker,
		Dialog2d20,
		DialogD6,
		FOHovers,
		Roller2D20,
		logger: Logger,
		macros: FalloutMacros,
	};

	CONFIG.Combat.initiative = {
		formula: "@initiative.value",
		decimals: 0,
	};

	registerSettings();

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

	// eslint-disable-next-line func-names
	Die.MODIFIERS.ef = function minResult(modifier) {
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
	Die.MODIFIERS.sum = function minResult(modifier) {
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
	Actors.unregisterSheet("core", ActorSheet);
	Items.unregisterSheet("core", ItemSheet);

	Actors.registerSheet("fallout", sheets.FalloutActorSheet, { makeDefault: true });
	Items.registerSheet("fallout", sheets.FalloutItemSheet, { makeDefault: true });
}
