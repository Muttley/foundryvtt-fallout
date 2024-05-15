/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
export class DialogD6 extends Dialog {
	// eslint-disable-next-line max-len
	constructor(rollName, diceNum, actor, weapon, falloutRoll, otherdmgdice, firerateamo, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.rollName = rollName;
		this.diceNum = diceNum;
		this.actor = actor;
		this.weapon = weapon;
		this.falloutRoll = falloutRoll;
		this.otherdmgdice = otherdmgdice;
		this.firerateamo = firerateamo;
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
			let otherdmgdice = html.find(".otherd-number")[0].value;
			let firerateamo =html.find('[name="firerateamo"] option:selected').val();
			if (!this.falloutRoll) {
				fallout.Roller2D20.rollD6({
					rollname: this.rollName,
					diceNum: parseInt(CDnumber),
					weapon: this.weapon,
					actor: this.actor,
					otherdmgdice: parseInt(otherdmgdice),
					firerateamo: parseInt(firerateamo),

				});
			}
			else {
				fallout.Roller2D20.addD6({
					rollname: this.rollName,
					diceNum: parseInt(CDnumber),
					weapon: this.weapon,
					actor: this.actor,
					falloutRoll: this.falloutRoll,
					otherdmgdice: parseInt(otherdmgdice),
					firerateamo: parseInt(firerateamo),
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

					// eslint-disable-next-line eqeqeq
					// reduce party AP when use to increase damage in melee
					if (this.weapon.system.weaponType === "meleeWeapons" || this.weapon.system.weaponType === "unarmed") {
						const currentpartyap= game.settings.get("fallout", "partyAP");
						const newpartyap=currentpartyap-parseInt(firerateamo);
						const overseerap = game.settings.get("fallout", "gmAP");
						if (newpartyap<0) {
							fallout.APTracker.setAP("partyAP", 0);
							const newoverseerap = overseerap - newpartyap;
							fallout.APTracker.setAP("gmAP", newoverseerap);
						}
						else {
							fallout.APTracker.setAP("partyAP", newpartyap);
						}

					}

					// reduce amo wehn firrerate is used
					else {
						if (firerateamo > 0) {
							this.reduceadditionalAmmo(firerateamo, this.weapon, _actor);
						}
					}

				}
				else {
					// eslint-disable-next-line eqeqeq
					// reduce party AP when use to increase damage in melee
					if (this.weapon.system.weaponType === "meleeWeapons" || this.weapon.system.weaponType === "unarmed") {
						const currentoverseerap= game.settings.get("fallout", "gmAP");
						const newoverseerap=currentoverseerap-parseInt(firerateamo);
						fallout.APTracker.setAP("gmAP", newoverseerap);
					}

					else {
						if (firerateamo > 0) {
							this.reduceadditionalAmmo(firerateamo, this.weapon, _actor);
						}
					}

				}
			}

		});
		html.on("change", ".fire-rate-select", async event => {
			const actorId = this.actor.split(".")[1];
			const actortype= game.actors.get(actorId).type;
			const weapontype = this.weapon.system.weaponType;
			let firerateamo = html.find('[name="firerateamo"] option:selected').val();
			if (weapontype === "meleeWeapons" || weapontype === "unarmed") {
				if (actortype !== "character" && actortype !== "robot") {
					const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
					const part2 = game.i18n.localize("FALLOUT.TEMPLATES.OVERSEER_AP");
					const pulsingContainer = document.querySelector(".flexrow.resource.pulsing");
					const currentoverseerap = game.settings.get("fallout", "gmAP");
					if (firerateamo > currentoverseerap) {
						if (!pulsingContainer) {
							const pulsingHTML = `<div class="flexrow resource pulsing" style="padding:5px">
												<div class="pulsing-text">
												${part1} ${part2}
												</div>
											</div>`;
							html.find(".otherd-number").after(pulsingHTML);
							html.find(".fire-rate-select")[0].selectedIndex = 0;
						}
					}
					else if (pulsingContainer) {
						pulsingContainer.remove();
					}
				}
				else {
					const currentpartyap = game.settings.get("fallout", "partyAP");
					const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
					const part2 = game.i18n.localize("FALLOUT.TEMPLATES.PARTY_AP");
					const part3 = game.i18n.localize("FALLOUT.UI.Buy_from_Overseer");
					const pulsingContainer = document.querySelector(".flexrow.resource.pulsing");

					if (firerateamo > currentpartyap) {
						const buyap = parseInt(firerateamo) - currentpartyap;
						if (!pulsingContainer) {
							const pulsingHTML = `<div class="flexrow resource pulsing" style="padding:5px">
											<div class="pulsing-text">
											${part1} ${part2}, ${part3} ${buyap}
											</div>
										</div>`;
							html.find(".otherd-number").after(pulsingHTML);
						}
						else {
							pulsingContainer.remove();
							const pulsingHTML = `<div class="flexrow resource pulsing" style="padding:5px">
											<div class="pulsing-text">
											${part1} ${part2}, ${part3} ${buyap}
											</div>
										</div>`;
							html.find(".otherd-number").after(pulsingHTML);
						}
					}
					else if (pulsingContainer) {
						pulsingContainer.remove();
					}
				}
			}
			else {
				const usedamo = await this.checkfirerate(this.weapon, game.actors.get(actorId), firerateamo);
				if (usedamo === 1) {
					const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
					const part2 = game.i18n.localize("TYPES.Item.ammo");
					ui.notifications.warn(`${part1} ${part2}`);
					html.find(".fire-rate-select")[0].selectedIndex = 0;
				}
			}
		});

	}

	async rollD6() {
	}

	async addD6() {

	}

	static async createDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, actor= null, weapon = null, otherdmgdice = 0, firerateamo = 0} = {}) {
		let dialogData = {};
		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.falloutRoll = falloutRoll;
		dialogData.weapon = weapon;
		dialogData.actor = actor;
		const actorId = dialogData.actor.split(".")[1];
		const actortype= game.actors.get(actorId).type;
		let firerate=weapon.system.fireRate;
		const weapondmgdice = game.i18n.localize("FALLOUT.UI.Weapondamagedice");
		const bonusdmg=game.i18n.localize("FALLOUT.UI.Bonusdmg");
		let additionaludesamo="";
		if ((actortype!== "character" && actortype !== "robot") && (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed")) {
			firerate= 3;
			additionaludesamo=game.i18n.localize("FALLOUT.UI.AdditionalmeledmgOverseer");
		}
		else if (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed") {
			firerate= 3;
			additionaludesamo=game.i18n.localize("FALLOUT.UI.Additionalmeledmg");
		}
		else {
			additionaludesamo=game.i18n.localize("FALLOUT.UI.Additionalamo");
		}
		let optionsHtml = "";
		for (let i = 0; i <= firerate; i++) {
			if (i===0) {
				optionsHtml += `<option value="${i}" selected>${i}</option>`;
			}
			else {
				optionsHtml += `<option value="${i}">${i}</option>`;
			}
		}
		const html = `<div class="flexrow fallout-dialog">
		<div class="flexrow resource" style="padding:5px">
		<label class="title-label">${weapondmgdice}</label><input type="number" class="d-number" value="${diceNum}" disabled>
		<label class="title-label">${additionaludesamo}</label>
        <select class="fire-rate-select" name="firerateamo">
            ${optionsHtml}
        </select>
		<label class="title-label">${bonusdmg}</label><input type="number" class="otherd-number" value="${otherdmgdice}" >
		</div>`;
		// eslint-disable-next-line max-len
		let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll, otherdmgdice, firerateamo, {
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

	static async addcreateDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, actor= null, weapon = null, otherdmgdice = 0, firerateamo = 0} = {}) {
		let dialogData = {};
		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.falloutRoll = falloutRoll;
		dialogData.weapon = weapon;
		dialogData.actor = actor;
		const actorId = dialogData.actor.split(".")[1];
		const actortype= game.actors.get(actorId).type;
		let firerate=weapon.system.fireRate;
		const bonusdmg=game.i18n.localize("FALLOUT.UI.Bonusdmg");
		let additionaludesamo="";
		if ((actortype!== "character" && actortype !== "robot") && (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed")) {
			firerate= 3;
			additionaludesamo=game.i18n.localize("FALLOUT.UI.AdditionalmeledmgOverseer");
		}
		else if (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed") {
			firerate= 3;
			additionaludesamo=game.i18n.localize("FALLOUT.UI.Additionalmeledmg");
		}
		else {
			additionaludesamo=game.i18n.localize("FALLOUT.UI.Additionalamo");
		}
		let optionsHtml = "";
		for (let i = 0; i <= firerate; i++) {
			if (i===0) {
				optionsHtml += `<option value="${i}" selected>${i}</option>`;
			}
			else {
				optionsHtml += `<option value="${i}">${i}</option>`;
			}
		}
		const html = `<div class="flexrow fallout-dialog">
		<div class="flexrow resource" style="padding:5px">
		<label class="title-label">${additionaludesamo}</label>
        <select class="fire-rate-select" name="firerateamo">
            ${optionsHtml}
        </select>
		<label class="title-label">${bonusdmg}</label><input type="number" class="otherd-number" value="${otherdmgdice}" >
		</div>`;
		// eslint-disable-next-line max-len
		let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll, otherdmgdice, firerateamo, {
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
			// eslint-disable-next-line linebreak-style
			const [ammoItems, shotsAvailable] =	await _actor._getAvailableAmmoType(this.weapon.system.ammo);
			if (!ammoItems) {
				ui.notifications.warn(`Ammo ${this.weapon.system.ammo} not found`);
				return -1;
			}
			// Check if there is enough ammo
			const totalDice = parseInt(diceNum);
			// eslint-disable-next-line semi
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

	async checkfirerate(weapon, actor, firerate) {
		const ammoPerShot = weapon.system.ammoPerShot;
		const isgatling = weapon.system.damage.weaponQuality.gatling.value;
		const ammountofamo = await actor._getAvailableAmmoType(weapon.system.ammo);
		let usedammo = ammoPerShot*parseInt(firerate);
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

	async reduceadditionalAmmo(firarateamo, weapon, actor) {
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
