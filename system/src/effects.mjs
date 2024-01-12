/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning entity which manages this effect
 */
export function onManageActiveEffect(event, owner) {
	event.preventDefault();

	const a = event.currentTarget;
	const li = a.closest("li");

	const effect = li.dataset.effectId
		? owner.effects.get(li.dataset.effectId)
		: null;

	switch (a.dataset.action) {
		case "create":
			return owner.createEmbeddedDocuments("ActiveEffect", [{
				"disabled": li.dataset.effectType === "inactive",
				"duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
				"icon": "icons/svg/aura.svg",
				"label": "New Effect",
				"origin": owner.uuid,
			}]);
		case "edit":
			return effect.sheet.render(true);
		case "delete":
			return effect.delete();
		case "toggle":
			return effect.update({disabled: !effect.disabled});
	}
}

/**
 * Prepare the data structure for Active Effects which are currently applied to
 * an Actor or Item.
 * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
 * @return {object}                   Data for rendering
 */
export function prepareActiveEffectCategories(effects) {
	const categories = {
		temporary: {
			type: "temporary",
			label: "Temporary Effects",
			effects: [],
		},
		passive: {
			type: "passive",
			label: "Passive Effects",
			effects: [],
		},
		inactive: {
			type: "inactive",
			label: "Inactive Effects",
			effects: [],
		},
	};

	for (const e of effects) {
		if (e.disabled) {
			categories.inactive.effects.push(e);
		}
		else if (e.isTemporary) {
			categories.temporary.effects.push(e);
		}
		else {
			categories.passive.effects.push(e);
		}
	}

	return categories;
}
