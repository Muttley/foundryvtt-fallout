export const preCreateItemHook = {
	attach: () => {
		fallout.logger.debug("Attaching preCreateItem hook");

		/* -------------------------------------------- */
		/*  Omit Specific Items on Specific Actors      */
		/* -------------------------------------------- */
		Hooks.on("preCreateItem", item => {
			fallout.logger.debug("Running preCreateItem hook");

			if (item.parent) {
				const parentType = item.parent.type;

				let warningMessage = null;

				switch (item.type) {
					case "addiction":
						if (parentType === "character") return true;
						warningMessage = "ONLY CHARACTERS CAN HAVE ADDICTIONS";
						break;
					case "disease":
						if (parentType === "character") return true;
						warningMessage = "ONLY CHARACTERS CAN HAVE DISEASES";
						break;
					case "object_or_structure":
						if (parentType === "settlement") return true;
						warningMessage = "ONLY SETTLEMENTS CAN HAVE OBJECTS OR STRUCTURES";
						break;
					case "perk":
						if (["character", "robot"].includes(parentType)) return true;
						warningMessage = "ONLY PLAYERS CAN HAVE PERKS";
						break;
					case "trait":
						if (["character", "robot"].includes(parentType)) return true;
						warningMessage = "ONLY PLAYERS CAN HAVE TRAITS";
						break;
					case "skill":
						const correctParentType =
							["character", "robot", "npc"].includes(parentType);

						const existingItem = item.parent.items.find(i =>
							i.name === item.name && i.type === item.type
						);

						if (correctParentType && !existingItem) return true;

						if (!correctParentType) {
							warningMessage = "ONLY CHARACTERS, ROBOTS AND NPCs CAN HAVE SKILLS";
						}
						else if (existingItem) {
							warningMessage = "THERE IS ALREADY A SKILL WITH THAT NAME";
						}
						break;
					case "special_ability":
						if (["creature", "npc"].includes(parentType)) return true;
						warningMessage = "ONLY NPCs AND CREATURES CAN HAVE SPECIAL ABILITIES";
						break;
					default:
				}

				if (warningMessage !== null) {
					ui.notifications.warn(warningMessage);
					return false;
				}
			}
		});
	},
};
