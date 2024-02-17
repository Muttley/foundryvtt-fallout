/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class FalloutItem extends Item {

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (data.img) return; // Already had an image set so we won"t change it

		const img = CONFIG.FALLOUT.DEFAULT_ICONS[data.type] ?? undefined;

		if (img) {
			this.updateSource({img});
		}
	}

	async deleteSettlementStructure() {
		if (!this.actor) return null;

		const directDescendants = this.actor.items.filter(
			i => i.system.parentItem === this._id
		);

		for (const item of directDescendants) {
			await item.update({"system.parentItem": ""});
		}
	}

	/**
	 * Prepare a data object which is passed to any Roll formulas which are
	 * created related to this Item
	 * @private
	 */
	getRollData() {
		// If present, return the actor's roll data.
		if (!this.actor) return null;
		const rollData = this.actor.getRollData();
		rollData.item = foundry.utils.deepClone(this.system);

		return rollData;
	}

	/**
	 * Augment the basic Item data model with additional dynamic data.
	 */
	prepareData() {
		// As with the actor class, items are documents that can have their data
		// preparation methods overridden (such as prepareBaseData()).
		super.prepareData();

		switch (this.type) {
			case "ammo":
				this._prepareAmmoData();
				break;
			case "consumable":
				this._prepareConsumableData();
				break;
			case "skill":
				this._prepareSkillData();
				break;
			case "weapon":
				this._prepareWeaponData();
				break;
		}
	}

	/**
   * Handle send to chat clicks.
   * @param {Event} event   The originating click event
   * @private
   */
	async sendToChat(showQuantity=true) {

		const itemData = duplicate(this.system);
		itemData._id = this._id;
		itemData.img = this.img;

		itemData.isApparel = this.type === "apparel";
		itemData.isApparelMod = this.type === "apparel_mod";
		itemData.isBook = this.type === "books_and_magz";
		itemData.isConsumable = this.type === "consumable";
		itemData.isDisease = this.type === "disease";
		itemData.isPerk = this.type === "perk";
		itemData.isPhysical = this.system.hasOwnProperty("weight");
		itemData.isRobotArmor = this.type === "robot_armor";
		itemData.isRobotMod = this.type === "robot_mod";
		itemData.isSettlementItem = this.type === "object_or_structure";
		itemData.isSkill = this.type === "skill";
		itemData.isWeapon = this.type === "weapon";
		itemData.isWeaponMod = this.type === "weapon_mod";

		itemData.name = this.name;
		itemData.showQuantity = showQuantity;
		itemData.type = this.type;

		if (itemData.isWeapon) {
			itemData.weaponQualities = this.weaponQualitiesString();
		}

		if (itemData.isSettlementItem) {
			itemData.materials = [];
			for (const material of ["common", "uncommon", "rare"]) {
				itemData.materials.push({
					label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
					value: this.system.materials[material] ?? 0,
				});
			}
		}

		const html = await renderTemplate("systems/fallout/templates/chat/item.hbs", itemData);
		const chatData = {
			user: game.user.id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
		};
		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		}
		else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		ChatMessage.create(chatData);
	}

	weaponQualitiesString() {
		if (this.type !== "weapon") return "";

		const qualities = [];
		for (const key in CONFIG.FALLOUT.WEAPON_QUALITIES) {
			if (this.system.damage?.weaponQuality[key]?.value) {
				qualities.push(CONFIG.FALLOUT.WEAPON_QUALITIES[key]);
			}
		}

		return qualities.join(", ");
	}

	_prepareAmmoData() {
		let shotsAvailable = (this.system.quantity - 1) * this.system.shots.max;
		shotsAvailable += this.system.shots.current;

		this.shotsAvailable = shotsAvailable;
	}

	_prepareConsumableData() {
		this.consumeIcon = CONFIG.FALLOUT.CONSUMABLE_USE_ICONS[
			this.system.consumableType
		];
	}

	_prepareSkillData() {
		// Get the localized name of a skill, if there is no
		// localization then it is likely a custom skill, in which
		// case we will just use it's original name
		//
		const nameKey = `FALLOUT.SKILL.${this.name}`;
		this.localizedName = game.i18n.localize(nameKey);

		if (this.localizedName === nameKey) this.localizedName = this.name;

		this.localizedDefaultAttribute = game.i18n.localize(
			`FALLOUT.AbilityAbbr.${this.system.defaultAttribute}`
		);
	}

	async _prepareWeaponData() {
		if (!this.actor) return;

		if (this.system.ammo !== "") {
			const [, shotsAvailable] =
				await this.actor._getAvailableAmmoType(
					this.system.ammo
				);

			this.shotsAvailable = shotsAvailable;
		}
	}

}
