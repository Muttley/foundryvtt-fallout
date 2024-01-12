/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class FalloutItem extends Item {
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
}
