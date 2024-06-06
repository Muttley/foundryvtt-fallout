/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
export class DialogD6 extends Dialog {
	constructor(rollName, diceNum, actor, weapon, falloutRoll, otherDmgDice, fireRateAmo, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.rollName = rollName;
		this.diceNum = diceNum;
		this.actor = actor;
		this.weapon = weapon;
		this.falloutRoll = falloutRoll;
		this.otherDmgDice = otherDmgDice;
		this.fireRateAmo = fireRateAmo;
		this.options.classes = ["dice-icon"];
	}

	activateListeners(html) {
		// Check when the box is changed if actor has enough ammo
		super.activateListeners(html);
		// html.on('change', '.d-number', async (e, i, a) => {
		//     await this.checkAmmo(html)
		// })

		html.on("click", ".rolldamage", async event => {
			let CDnumber = 0;
			const isadd =html.find(".d-number");
			const isaddl = isadd.length;
			if (isaddl !== 0) {
				CDnumber = html.find(".d-number")[0].value;
			}
			const isMacor = html.find(".otherd-number").length;
			let fireRateAmo = 0;
			let otherDmgDice = 0;

			if (isMacor !== 0) {
				otherDmgDice = html.find(".otherd-number")[0].value;
				fireRateAmo =html.find('[name="fireRateAmo"] option:selected').val();
			}

			if (!this.falloutRoll) {
				fallout.Roller2D20.rollD6({
					rollname: this.rollName,
					diceNum: parseInt(CDnumber),
					weapon: this.weapon,
					actor: this.actor,
					otherDmgDice: parseInt(otherDmgDice),
					fireRateAmo: parseInt(fireRateAmo),

				});
			}
			else {
				fallout.Roller2D20.addD6({
					rollname: this.rollName,
					diceNum: parseInt(CDnumber),
					weapon: this.weapon,
					actor: this.actor,
					falloutRoll: this.falloutRoll,
					otherDmgDice: parseInt(otherDmgDice),
					fireRateAmo: parseInt(fireRateAmo),
				});
			}
			// REDUCE AMMO FOR CHARACTER AND ROBOT
			if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {
				if (!this.actor) return;

				let _actor;
				if (this.actor.startsWith("Actor")) {
					_actor = fromUuidSync(this.actor);
				}
				else if (this.actor.startsWith("Scene")) {
					_actor = fromUuidSync(this.actor).actor;
				}
				if (_actor.type === "character" || _actor.type === "robot") {
					// reduce party AP when use to increase damage in melee
					if (this.weapon.system.weaponType === "meleeWeapons" || this.weapon.system.weaponType === "unarmed") {
						const currentPartyAp= game.settings.get("fallout", "partyAP");
						const newPartyAp=currentPartyAp-parseInt(fireRateAmo);
						const overseerAp = game.settings.get("fallout", "gmAP");
						if (newPartyAp<0) {
							fallout.APTracker.setAP("partyAP", 0);
							const newoverseerAp = overseerAp - newPartyAp;
							fallout.APTracker.setAP("gmAP", newoverseerAp);
						}
						else {
							fallout.APTracker.setAP("partyAP", newPartyAp);
						}

					}

					// reduce amo wehn firrerate is used
					else {
						if (fireRateAmo > 0) {
							this.reduceAdditionalAmmo(fireRateAmo, this.weapon, _actor);
						}
					}

				}
				else {
					// reduce party AP when use to increase damage in melee
					if (this.weapon.system.weaponType === "meleeWeapons" || this.weapon.system.weaponType === "unarmed") {
						const currentoverseerAp= game.settings.get("fallout", "gmAP");
						const newoverseerAp=currentoverseerAp-parseInt(fireRateAmo);
						fallout.APTracker.setAP("gmAP", newoverseerAp);
					}

					else {
						if (fireRateAmo > 0) {
							this.reduceAdditionalAmmo(fireRateAmo, this.weapon, _actor);
						}
					}

				}
			}

		});
		html.on("change", ".fire-rate-select", async event => {
			const actorId = this.actor.split(".")[1];
			const actortype= game.actors.get(actorId).type;
			const weapontype = this.weapon.system.weaponType;
			let fireRateAmo = html.find('[name="fireRateAmo"] option:selected').val();

			if (weapontype === "meleeWeapons" || weapontype === "unarmed") {
				if (actortype !== "character" && actortype !== "robot") {
					const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
					const part2 = game.i18n.localize("FALLOUT.TEMPLATES.OVERSEER_AP");
					const pulsingContainer = document.querySelector(".flexrow.resource.pulsing");
					const currentoverseerAp = game.settings.get("fallout", "gmAP");
					if (fireRateAmo > currentoverseerAp) {
						if (!pulsingContainer) {
							const pulsingHTML = `<div class="flexrow resource pulsing" style="padding:5px">
												<div class="pulsing-text">
												${part1} ${part2}
												</div>
											</div>`;
							html.find(".otherd-number").after(pulsingHTML);
							html.find(".fire-rate-select")[0].selectedIndex = 0;
							const selector = `.app.window-app.dice-icon[data-appid="${this.appId}"]`;
							const element = document.querySelector(selector);
							element.style.height = "230px";
						}
					}
					else if (pulsingContainer) {
						pulsingContainer.remove();
						const selector = `.app.window-app.dice-icon[data-appid="${this.appId}"]`;
						const element = document.querySelector(selector);
						element.style.height = "184px";
					}
				}
				else {
					const currentPartyAp = game.settings.get("fallout", "partyAP");
					const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
					const part2 = game.i18n.localize("FALLOUT.TEMPLATES.PARTY_AP");
					const part3 = game.i18n.localize("FALLOUT.UI.Buy_from_Overseer");
					const pulsingContainer = document.querySelector(".flexrow.resource.pulsing");

					if (fireRateAmo > currentPartyAp) {
						const buyap = parseInt(fireRateAmo) - currentPartyAp;
						if (!pulsingContainer) {
							const pulsingHTML = `<div class="flexrow resource pulsing" style="padding:5px">
											<div class="pulsing-text">
											${part1} ${part2}, ${part3} ${buyap}
											</div>
										</div>`;
							html.find(".otherd-number").after(pulsingHTML);
							const selector = `.app.window-app.dice-icon[data-appid="${this.appId}"]`;
							const element = document.querySelector(selector);
							element.style.height = "230px";
						}
						else {
							pulsingContainer.remove();
							const pulsingHTML = `<div class="flexrow resource pulsing" style="padding:5px">
											<div class="pulsing-text">
											${part1} ${part2}, ${part3} ${buyap}
											</div>
										</div>`;
							html.find(".otherd-number").after(pulsingHTML);
							const selector = `.app.window-app.dice-icon[data-appid="${this.appId}"]`;
							const element = document.querySelector(selector);
							element.style.height = "230px";
						}
					}
					else if (pulsingContainer) {
						pulsingContainer.remove();
						const selector = `.app.window-app.dice-icon[data-appid="${this.appId}"]`;
						const element = document.querySelector(selector);
						element.style.height = "184px";
					}
				}
			}

			else {
				if ((game.settings.get(SYSTEM_ID, "automaticAmmunitionCalculationGM") && (actortype !== "character" && actortype !== "robot")) || (game.settings.get(SYSTEM_ID, "automaticAmmunitionCalculation") && (actortype === "character" || actortype === "robot"))) {
					const usedamo = await this.checkfireRate(this.weapon, game.actors.get(actorId), fireRateAmo);
					if (usedamo === 1) {
						const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
						const part2 = game.i18n.localize("TYPES.Item.ammo");
						ui.notifications.warn(`${part1} ${part2}`);
						html.find(".fire-rate-select")[0].selectedIndex = 0;
					}
				}
			}
		});

	}

	async rollD6() {
	}

	async addD6() {

	}

	static async createDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, actor= null, weapon = null, otherDmgDice = 0, fireRateAmo = 0} = {}) {
		let dialogData = {};
		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.falloutRoll = falloutRoll;
		dialogData.weapon = weapon;
		dialogData.actor = actor;
		let html;
		if (actor !== null) {
			const actorId = dialogData.actor.split(".")[1];
			const actortype= game.actors.get(actorId).type;
			let fireRate=weapon.system.fireRate;
			let additionalUdesAmo="";
			if ((actortype!== "character" && actortype !== "robot") && (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed")) {
				fireRate= 3;
				additionalUdesAmo=game.i18n.localize("FALLOUT.UI.Additional_mele_dmg_overseer");
			}
			else if (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed") {
				fireRate= 3;
				additionalUdesAmo=game.i18n.localize("FALLOUT.UI.Additional_mele_dmg");
			}
			else {
				additionalUdesAmo=game.i18n.localize("FALLOUT.UI.Additional_amo");
			}
			let dialogDataDmg ={};
			dialogDataDmg.additionalUdesAmo = additionalUdesAmo;
			dialogDataDmg.fireRate = fireRate;
			dialogDataDmg.diceNum = diceNum;
			dialogDataDmg.otherDmgDice = 0;
			html =  await renderTemplate("systems/fallout/templates/dialogs/damage-options.hbs", dialogDataDmg);
		}
		else {
			 html =  await renderTemplate("systems/fallout/templates/dialogs/dialogd6.hbs", dialogData);
		}
		let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll, otherDmgDice, fireRateAmo, {
			title: rollName,
			content: html,
			buttons: {
				rolldamage: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize("FALLOUT.UI.Roll"),
				},
			},
			close: () => { },
		});
		d.render(true);
	}

	static async addcreateDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, actor= null, weapon = null, otherDmgDice = 0, fireRateAmo = 0} = {}) {
		let dialogData = {};
		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.falloutRoll = falloutRoll;
		dialogData.weapon = weapon;
		dialogData.actor = actor;
		const actorId = dialogData.actor.split(".")[1];
		const actortype= game.actors.get(actorId).type;
		let fireRate=weapon.system.fireRate;
		let additionalUdesAmo="";
		if ((actortype!== "character" && actortype !== "robot") && (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed")) {
			fireRate= 3;
			additionalUdesAmo=game.i18n.localize("FALLOUT.UI.Additional_mele_dmg_overseer");
		}
		else if (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed") {
			fireRate= 3;
			additionalUdesAmo=game.i18n.localize("FALLOUT.UI.Additional_mele_dmg");
		}
		else {
			additionalUdesAmo=game.i18n.localize("FALLOUT.UI.Additional_amo");
		}
		let dialogDataDmg ={};
		dialogDataDmg.additionalUdesAmo = additionalUdesAmo;
		dialogDataDmg.fireRate = fireRate;
		dialogDataDmg.diceNum = diceNum;
		dialogDataDmg.otherDmgDice = otherDmgDice;
		const html =  await renderTemplate("systems/fallout/templates/dialogs/damage-options.hbs", dialogDataDmg);
		let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll, otherDmgDice, fireRateAmo, {
			title: rollName,
			content: html,
			buttons: {
				rolldamage: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize("FALLOUT.UI.Roll"),
				},
			},
			close: () => { },
		});
		d.render(true);
	}

	async checkAmmo(diceNum, initDmg) {
		if (!game.settings.get("fallout", "automaticAmmunitionCalculation")) return 0;

		if (!this.actor) return 0;

		if (!this.weapon) return 0;

		if (this.weapon.system.ammo === "") return 0;

		// Check if there is ammo at all
		let _actor;
		if (this.actor.startsWith("Actor")) {
			_actor = fromUuidSync(this.actor);
		}
		else if (this.actor.startsWith("Scene")) {
			_actor = fromUuidSync(this.actor).actor;
		}

		if (!_actor) return 0;

		if (_actor.type !== "character" && _actor.type !== "robot") return 0;
		let additionalAmmo = "0";
		if (this.weapon.system.weaponType !== "meleeWeapons" && this.weapon.system.weaponType !== "unarmed") {
			const [ammoItems, shotsAvailable] =	await _actor._getAvailableAmmoType(this.weapon.system.ammo);
			if (!ammoItems) {
				ui.notifications.warn(`Ammo ${this.weapon.system.ammo} not found`);
				return -1;
			}
			// Check if there is enough ammo
			const totalDice = parseInt(diceNum);
			const weaponDmg = parseInt(initDmg);
			additionalAmmo = Math.max(0, totalDice - weaponDmg) * this.weapon.system.ammoPerShot;
			// Gatling weird shit where you need to add 2DC and spend 10 ammmo...
			if (this.weapon.system.damage.weaponQuality.gatling.value) {
				additionalAmmo = Math.floor(additionalAmmo * 0.5);
			}
			if (this.weapon.system.damage.weaponQuality.gatling.value === true) {
				additionalAmmo = additionalAmmo*10;
			}
			if (shotsAvailable < additionalAmmo) {
				ui.notifications.warn(`Not enough ${this.weapon.system.ammo} ammo`);
				return -1;
			}
			return additionalAmmo;

		}
	}

	async checkfireRate(weapon, actor, fireRate) {
		const ammoPerShot = weapon.system.ammoPerShot;
		const isgatling = weapon.system.damage.weaponQuality.gatling.value;
		const ammountofamo = await actor._getAvailableAmmoType(weapon.system.ammo);
		let usedammo = ammoPerShot*parseInt(fireRate);
		if (isgatling === true) {
			usedammo = 10*usedammo;
		}
		if (usedammo <= ammountofamo[1]) {
			return 0;
		}
		else {
			return 1;
		}
	}

	async reduceAdditionalAmmo(firarateamo, weapon, actor) {
		const [ammoItem, shotsAvailable] = await actor._getAvailableAmmoType(weapon.system.ammo);
		const ammoPerShot = weapon.system.ammoPerShot;
		const isgatling = weapon.system.damage.weaponQuality.gatling.value;
		let usedammo = ammoPerShot*parseInt(firarateamo);
		if (isgatling === true) {
			usedammo = 10*usedammo;
		}
		const ammo = ammoItem[0];
		const itemid = ammo._id;
		const leftammo = shotsAvailable - usedammo;
		await actor.updateEmbeddedDocuments("Item", [{
			"_id": itemid,
			"system.quantity": leftammo,
		}]);


	}
}
