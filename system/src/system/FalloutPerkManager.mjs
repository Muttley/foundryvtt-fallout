export default class FalloutPerkManager {
	constructor(actor, options={}) {
		this.actorOwnedPerksLut = {};
		this.actorAttributes = [];
		this.actorSkills = [];
	}

	async getAvailablePerks() {
		const selectedPerks = new Collection();

		const allPerks = await fallout.compendiums.perks();
		for (const perk of allPerks) {
			perk.system.multiRank = perk.system.rank.max > 1;
			perk.system.perkIdentifier = perk.name.slugify();

			// Make sure we meet the requirements
			const meetsRequirements = await this._meetsRequirements(perk);

			if (meetsRequirements) {
				let rank = 1;

				if (Object.hasOwn(
					this.actorOwnedPerksLut, perk.system.perkIdentifier
				)) {
					const current = this.actorOwnedPerksLut[
						perk.system.perkIdentifier
					];

					rank = current + 1;
				}

				selectedPerks.set(perk._id, {item: perk, rank});
			}
		}

		return selectedPerks;
	}

	async setActorAttributes(attributes) {
		this.actorAttributes = attributes;
	}

	async setKnownPerks(perks) {
		this.actorOwnedPerksLut = {};

		for (const perk of perks) {
			this.actorOwnedPerksLut[perk.identifier] = perk.rank;
		}
	}

	async _meetsRequirements(perk) {
		let requirementsMet = true;

		// First make sure that if the character already knows the talent that
		// they have not maxed it out
		const knownTalent = this.actorOwnedPerksLut[
			perk.system.perkIdentifier
		];

		if (knownTalent) {
			if (knownTalent >= perk.system.rank.max) {
				requirementsMet = false;
			}
		}

		// Are we the correct level for the next rank of the perk?
		//
		const playerLevel = this.actor?.system?.level?.value ?? 1;
		if (perk.system.multiRank) {
			const nextPerkRank = (knownTalent ?? 0) + 1;

			const startLevel = perk.system?.requirementsEx?.level ?? 1;
			const rankLevelStep = perk.system?.requirementsEx?.levelIncrease ?? 1;

			const levelRequired = startLevel + ((nextPerkRank - 1) * rankLevelStep);

			if (playerLevel < levelRequired) requirementsMet = false;
		}
		else if (playerLevel < perk.system?.requirementsEx?.level ?? 1) {
			requirementsMet = false;
		}


		// Do we meet the attribute requirements?
		//
		for (const attribute of perk.system.requirementsEx.attributes) {
			const actorValue = this.actorAttributes[attribute].value ?? 0;
			const perkValue = perk.system.requirementsEx.attributes[attribute] ?? 0;

			if (actorValue < perkValue) requirementsMet = false;
		}

		return requirementsMet;
	}
}
