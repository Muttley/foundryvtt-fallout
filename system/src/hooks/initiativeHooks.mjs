export const initiativeHooks = {
	attach: () => {
		fallout.logger.debug("Attaching createCombatant hook");

		Hooks.on("createCombatant", (combatant, options, userId) => {
			fallout.logger.debug("Running createCombatant hook");

			if (!game.user.isGM) return;

			combatant.combat.setInitiative(
				combatant._id,
				combatant.actor?.system?.initiative?.value ?? 0
			);
		});

		fallout.logger.debug("Attaching updateActor hook");

		Hooks.on("updateActor", (actor, updateData, options, userId) => {
			if (!game.user.isGM) return;
			if (!actor.inCombat) return;

			let newInitiative = updateData.system?.initiative?.value ?? null;

			const updateInititive = Number.isInteger(parseInt(newInitiative))
				|| Object.hasOwn(updateData.system, "attributes");

			if (updateInititive) {
				for (const combat of game.combats) {
					const combatant = combat.combatants.find(
						c => c.actor.id === actor.id
					);

					if (combatant) {
						combatant.combat.setInitiative(
							combatant._id,
							actor.system.initiative.value
						);
					}
				}
			}
		});
	},
};
