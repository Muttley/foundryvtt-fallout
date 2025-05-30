export class DialogD6 extends Dialog {

	constructor(rollName, diceNum, actor, weapon, falloutRoll, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.rollName = rollName;
		this.diceNum = diceNum;
		this.actor = actor;
		this.weapon = weapon;
		this.falloutRoll = falloutRoll;
		this.options.classes = ["dice-icon"];
	}

	activateListeners(html) {
		const me = this;

		// Check when the box is changed if actor has enough ammo
		super.activateListeners(html);
		// html.on('change', '.d-number', async (e, i, a) => {
		//     await this.checkAmmo(html)
		// })

		html.on("click", ".roll", async event => {
			let extraDiceNum = parseInt(html.find(".extra-dice")[0]?.value ?? 0);
			let fireRate = parseInt(html.find(".fire-rate")[0]?.value ?? 0);
			let diceNum = parseInt(html.find(".damage-dice")[0]?.value ?? 1);

			const gatlingWeapon = me.weapon?.hasWeaponQuality("gatling") ?? false;
			let multiplier = gatlingWeapon ? 2 : 1;

			if (!diceNum) {
				diceNum = this.diceNum;
			}

			if (fireRate && fireRate > 0) {
				diceNum += (fireRate * multiplier);
			}

			let additionalAmmo = 0;
			// CHECK IF THERE IS ENOUGH AMMO TO TRIGGER THE ROLL
			if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {
				if (this.weapon?.system.ammo) {
					let initDmg = this.falloutRoll
						? 0
						: this.weapon.system.damage.rating;

					additionalAmmo = await this.checkAmmo(diceNum, initDmg);

					if (additionalAmmo < 0) {
						return;
					}
				}
			}

			if (!this.falloutRoll) {
				fallout.Roller2D20.rollD6({
					rollname: this.rollName,
					dicenum: diceNum + extraDiceNum,
					weapon: this.weapon,
					actor: this.actor,
				});
			}
			else {
				fallout.Roller2D20.addD6({
					rollname: this.rollName,
					dicenum: diceNum + extraDiceNum,
					weapon: this.weapon,
					actor: this.actor,
					falloutRoll: this.falloutRoll,
				});
			}

			// REDUCE AMMO FOR CHARACTER AND ROBOT
			if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {
				if (!this.actor) {
					return;
				}

				let _actor;
				if (this.actor.startsWith("Actor")) {
					_actor = fromUuidSync(this.actor);
				}
				else if (this.actor.startsWith("Scene")) {
					_actor = fromUuidSync(this.actor).actor;
				}

				if (["character", "robot", "vehicle"].includes(_actor.type)) {
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

	static async createDialog({
		rollName = "DC Roll",
		diceNum = 2,
		falloutRoll = null,
		actor = null,
		weapon = null,
	} = {}) {
		let dialogData = {};

		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.falloutRoll = falloutRoll;
		dialogData.weapon = weapon;
		dialogData.actor = actor;

		let html;
		let dialogWidth = 300;
		if (weapon && !falloutRoll) {
			html = await foundry.applications.handlebars.renderTemplate("systems/fallout/templates/dialogs/dialogd6.hbs", dialogData);
			dialogWidth = 465;
		}
		else {
			html = await foundry.applications.handlebars.renderTemplate("systems/fallout/templates/dialogs/dialogd6-simple.hbs", dialogData);
		}

		let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll, {
			title: rollName,
			content: html,
			buttons: {
				roll: {
					icon: '<i class="fas fa-check"></i>',
					label: "ROLL",
				},
			},
			close: () => { },
		}, {width: dialogWidth});
		d.render(true);
	}

	async checkAmmo(diceNum, initDmg) {
		if (!game.settings.get("fallout", "automaticAmmunitionCalculation")) {
			return 0;
		}

		if (!this.actor) {
			return 0;
		}

		if (!this.weapon) {
			return 0;
		}

		if (this.weapon.system.ammo === "") {
			return 0;
		}

		// Check if there is ammo at all
		let _actor;
		if (this.actor.startsWith("Actor")) {
			_actor = fromUuidSync(this.actor);
		}
		else if (this.actor.startsWith("Scene")) {
			_actor = fromUuidSync(this.actor).actor;
		}

		if (!_actor) {
			return 0;
		}

		if (!["character", "robot", "vehicle"].includes(_actor.type)) {
			return 0;
		}

		const [ammoItems, shotsAvailable] =
			_actor._getAvailableAmmoType(
				this.weapon.system.ammo
			);

		if (!ammoItems) {
			ui.notifications.warn(`Ammo ${this.weapon.system.ammo} not found`);
			return -1;
		}

		// Check if there is enough ammo
		const totalDice = parseInt(diceNum);
		const weaponDmg = parseInt(initDmg);

		let additionalAmmo = Math.max(0, totalDice - weaponDmg)
			* this.weapon.system.ammoPerShot;

		// Gatling weird shit where you need to add 2DC and spend 10 ammmo...
		if (this.weapon && this.weapon.hasWeaponQuality("gatling")) {
			additionalAmmo = Math.floor(additionalAmmo * 0.5);
		}

		if (shotsAvailable < additionalAmmo) {
			ui.notifications.warn(`Not enough ${this.weapon.system.ammo} ammo`);
			return -1;
		}

		return additionalAmmo;
	}
}
