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
			let diceNum = html.find(".d-number")[0].value;
			let otherdmgdice = html.find(".otherd-number")[0].value;
			let firerateamo =html.find('[name="firerateamo"] option:selected').val();
			let additionalAmmo = 0;
			// CHECK IF THERE IS ENOUGH AMMO TO TRIGGER THE ROLL
			if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {
				if (this.weapon?.system.ammo) {

					let initDmg = this.falloutRoll
						? 0
						: this.weapon.system.damage.rating;

					additionalAmmo = await this.checkAmmo(diceNum, initDmg);

					if (additionalAmmo < 0) return;
				}
			}

			if (!this.falloutRoll) {
				fallout.Roller2D20.rollD6({
					rollname: this.rollName,
					diceNum: parseInt(diceNum),
					weapon: this.weapon,
					actor: this.actor,
					otherdmgdice: parseInt(otherdmgdice),
					firerateamo: parseInt(firerateamo),
				});
			}
			else {
				fallout.Roller2D20.addD6({
					rollname: this.rollName,
					diceNum: parseInt(diceNum),
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
					if (this.weapon.system.weaponType === "meleeWeapons" || this.weapon.system.weaponType === "unarmed") {
						const currentpartyap= game.settings.get("fallout", "partyAP");
						const newpartyap=currentpartyap-parseInt(firerateamo);
						fallout.APTracker.setAP("partyAP", newpartyap);

					}
					if (additionalAmmo > 0) {
						await _actor.reduceAmmo(this.weapon.system.ammo, additionalAmmo);
					}
				}
			}
		});
	}

	async rollD6() {

	}

	async addD6() {

	}

	static async createDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, actor= null, weapon = null, otherdmgdice = 0, firerateamo = 0} = {}) {
		let firerate=weapon.system.fireRate;
		const weapondmgdice = game.i18n.localize("FALLOUT.Weapondamagedice");
		const bonusdmg=game.i18n.localize("FALLOUT.Bonusdmg");
		let additionaludesamo="";
		const partyap=game.settings.get("fallout", "partyAP");
		if (weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed") {
			firerate=partyap;
			additionaludesamo=game.i18n.localize("FALLOUT.Additionalmeledmg");
		}
		else {
			additionaludesamo=game.i18n.localize("FALLOUT.Additionalamo");
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
					label: game.i18n.localize("FALLOUT.Roll"),
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
		// eslint-disable-next-line eqeqeq

		if (_actor.type !== "character" && _actor.type !== "robot") return 0;
		let additionalAmmo = "0";
		if (this.weapon.system.weaponType !== "meleeWeapons" && this.weapon.system.weaponType !== "unarmed") {
			const ammo = _actor.items.find(i => i.name === this.weapon.system.ammo);

		const [ammoItems, shotsAvailable] =
			await _actor._getAvailableAmmoType(
				this.weapon.system.ammo
			);

		if (!ammoItems) {
			ui.notifications.warn(`Ammo ${this.weapon.system.ammo} not found`);
			return -1;
		}

		// Check if there is enough ammo
		const totalDice = parseInt(diceNum);
		const weaponDmg = parseInt(initDmg);

		let additionalAmmo = Math.max(0, totalDice - weaponDmg) * this.weapon.system.ammoPerShot;

		// Gatling weird shit where you need to add 2DC and spend 10 ammmo...
		if (this.weapon.system.damage.weaponQuality.gatling.value) {
			additionalAmmo = Math.floor(additionalAmmo * 0.5);
		}

		if (shotsAvailable < additionalAmmo) {
			ui.notifications.warn(`Not enough ${this.weapon.system.ammo} ammo`);
			return -1;

		}
		return additionalAmmo;
	}
}
