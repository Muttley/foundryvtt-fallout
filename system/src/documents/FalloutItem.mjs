export default class FalloutItem extends Item {

	get currentWeaponDamage() {
		if (this.type !== "weapon") {
			return undefined;
		}

		let damageDice = parseInt(this.system.damage?.rating ?? 0);

		if (["meleeWeapons", "unarmed"].includes(this.system.weaponType)) {
			let damageBonus = this.actor.system?.meleeDamage?.value ?? 0;
			damageDice += damageBonus;
		}

		if (game.settings.get(SYSTEM_ID, "applyWearAndTearToWeaponDamage")) {
			let wearAndTear = Number(this.system.tear);
			if (isNaN(wearAndTear)) {
				wearAndTear = 0;
			}

			damageDice -= wearAndTear;
		}

		return damageDice;
	}


	get isOwnedByCreature() {
		return this.isOwned && this.actor.type === "creature";
	}


	get isWeaponBroken() {
		if (this.type !== "weapon") {
			return false;
		}
		if (!game.settings.get(SYSTEM_ID, "applyWearAndTearToWeaponDamage")) {
			return false;
		}

		let damageDice = parseInt(this.system.damage?.rating ?? 0);

		let wearAndTear = Number(this.system.tear);
		if (isNaN(wearAndTear)) {
			wearAndTear = 0;
		}

		damageDice -= wearAndTear;

		return damageDice <= 0;
	}

	get shotsAvailable() {
		if (!this.actor) {
			return null;
		}

		if (this.type === "ammo") {
			let shotsAvailable = (this.system.quantity - 1) * this.system.shots.max;
			shotsAvailable += this.system.shots.current;

			return shotsAvailable;
		}
		else if (this.type === "weapon") {
			let shotsAvailable = 0;

			if (this.system.ammo !== "") {
				[, shotsAvailable] =
					this.actor._getAvailableAmmoType(
						this.system.ammo
					);
			}
			else if (this.system.consumedOnUse) {
				shotsAvailable = this.system.quantity;
			}

			return shotsAvailable;
		}
		else {
			return null;
		}
	}

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (data.img) {
			return;
		} // Already had an image set so we won"t change it

		const img = CONFIG.FALLOUT.DEFAULT_ICONS[data.type] ?? undefined;

		if (img) {
			this.updateSource({img});
		}
	}

	async deleteSettlementStructure() {
		if (!this.actor) {
			return null;
		}

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
		if (!this.actor) {
			return null;
		}
		const rollData = this.actor.getRollData();
		rollData.item = foundry.utils.deepClone(this.system);

		return rollData;
	}


	hasWeaponQuality(quality) {
		if (this.type !== "weapon") {
			return false;
		}

		return this.system.damage.weaponQuality[quality].value > 0;
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
		}
	}

	async rollQuantity(mode) {
		const formula = this.system.quantityRoll;

		const roll = new Roll(formula);
		const quantityRoll = await roll.evaluate();

		await fallout.Roller2D20.showDiceSoNice(quantityRoll);

		const quantity = parseInt(roll.total);

		switch (mode) {
			case "update":
				const update = {};
				if (this.system.multishot) {
					update["system.shots.current"] = quantity;
					update["system.shots.max"] = quantity;
				}
				else {
					update["system.quantity"] = quantity;
				}
				return this.update(update);
			case "create":
				const data = this.toObject();
				data.system.quantity = quantity;
				if (this.actor) {
					return this.actor.createEmbeddedDocuments("Item", [data]);
				}
				else {
					return Item.create(data);
				}
			case "chat":
				return fallout.chat.renderGeneralMessage(
					this,
					{
						title: game.i18n.localize("FALLOUT.dialog.roll_quantity.title"),
						body: game.i18n.format("FALLOUT.dialog.roll_quantity.chat.body",
							{
								itemName: this.name,
								quantity,
							}
						),
					}
				);
		}
	}

	/**
   * Handle send to chat clicks.
   * @param {Event} event   The originating click event
   * @private
   */
	async sendToChat(showQuantity=true) {

		const itemData = foundry.utils.duplicate(this.system);
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

		if (itemData.isWeaponMod) {
			itemData.modSummary = await this._sheet.getWeaponModSummary(this);
		}

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

		const html = await foundry.applications.handlebars.renderTemplate("systems/fallout/templates/chat/item.hbs", itemData);
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
		if (this.type !== "weapon") {
			return "";
		}

		const qualities = [];
		for (const key in CONFIG.FALLOUT.WEAPON_QUALITIES) {
			if (this.system.damage?.weaponQuality[key]?.value) {
				qualities.push(CONFIG.FALLOUT.WEAPON_QUALITIES[key]);
			}
		}

		return qualities.join(", ");
	}

	/** @inheritdoc */
	_initializeSource(source, options={}) {
		source = super._initializeSource(source, options);

		if (!source._id || !options.pack || fallout.moduleArt.suppressArt) {
			return source;
		}

		const uuid = `Compendium.${options.pack}.Item.${source._id}`;

		const art = fallout.moduleArt.map.get(uuid);

		if (art?.img) {
			if (art.img) {
				source.img = art.img;
			}
		}
		return source;
	}

	_prepareAmmoData() {
		if (this.system.fusionCore) {
			// Fusion Cores provide 50 shots per charge
			this.system.shots.max = this.system.charges.max * 50;

			// Cap current shots to max in case it's changed
			this.system.shots.current = Math.min(
				this.system.shots.max,
				this.system.shots.current
			);

			this.system.charges.current = Math.min(
				this.system.charges.max,
				this.system.charges.current,
				Math.ceil(this.system.shots.current / 50)
			);
		}
	}


	_prepareConsumableData() {
		this.system.consumeIcon = CONFIG.FALLOUT.CONSUMABLE_USE_ICONS[
			this.system.consumableType
		];
	}

	_prepareSkillData() {
		this.localizedName = fallout.utils.getLocalizedSkillName(this);
		this.localizedDefaultAttribute = fallout.utils.getLocalizedSkillAttribute(this);
	}

}
