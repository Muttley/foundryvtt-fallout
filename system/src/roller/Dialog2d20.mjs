export class Dialog2d20 extends Dialog {

	constructor(
		rollName,
		diceNum,
		attribute,
		skill,
		tag,
		complication,
		rollLocation,
		actor,
		item,
		ap,
		apCost,
		dialogData={},
		options={}
	) {
		super(dialogData, options);
		this.rollName = rollName;
		this.diceNum = diceNum;
		this.attribute = attribute;
		this.skill = skill;
		this.tag = tag;
		this.complication = complication;
		this.rollLocation = rollLocation;
		this.actor = actor;
		this.item = item;
		this.ap = ap;
		this.apCost = apCost;
		this.options.classes = ["dice-icon"];
		this.deferred = new Deferred();
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.ready(e => {
			this.markDiceNumber(html, this.diceNum);
			if (this.actor.type !== "character" && this.actor.type !== "robot") {
				this.gmRoll(html);
			}
			this.freeD20(html);
		});

		html.on("click", ".dice-icon", (e, i, a) => {
			let index = e.currentTarget.dataset.index;
			this.diceNum = parseInt(index);
			this.markDiceNumber(html, this.diceNum);
			if (this.actor.type === ("character" || "robot")) {
				this.apManagment(html);
			}
			else {
				this.gmApManagment(html);
			}

		});
		html.on("click", '[name="freed20"]', () => {
			this.freeD20(html);
			let numberOfDice = 0;
			for (let i = 2; i <= 5; i++) {
				const diceElement =this.element.find(`[data-index="${i}"]`);
				const containsMarked = diceElement.hasClass("marked");
				if (containsMarked) {
					numberOfDice = i;
				}
			}
			if (this.actor.type === ("character" || "robot")) {
				this.apManagment(html, numberOfDice);
			}
			else {
				this.gmApManagment(html, numberOfDice);
			}

		});
		html.on("click", () => {
			if (this.actor.type === ("character" || "robot")) {
				let ap = game.settings.get("fallout", "partyAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.apManagment(html);
			}
			else {
				let ap = game.settings.get("fallout", "gmAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.gmApManagment(html);
			}
		});


		this.data.buttons.roll.callback = () => {
			if (this.actor.type === ("character" || "robot")) {
				let ap = game.settings.get("fallout", "partyAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.apManagment(html);
			}
			else {
				let ap = game.settings.get("fallout", "gmAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.gmApManagment(html);
			}

			this.rollButton(this);
		};

		this.data.buttons.help.callback=this.AssistanceButton.bind(this);
	}

	rollButton() {
		let attr = this.element.find('[name="attribute"]').val();
		let skill = this.element.find('[name="skill"]').val();
		let complication = this.element.find('[name="complication"]').val();
		let isTag = this.element.find('[name="tag"]').is(":checked");
		let apSpend = this.element.find('[name="spend_ap"]').val();
		let apBuy = parseInt(this.element.find('[name="by_from_gm"]').val());
		this.rolling = true;
		let numberOfDice = 0;
		for (let i = 2; i <= 5; i++) {
			const diceElement =this.element.find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberOfDice = i;
			}
		}
		fallout.Roller2D20.rollD20({
			rollname: this.rollName,
			dicenum: numberOfDice,
			attribute: attr,
			skill: skill,
			tag: isTag,
			complication: complication,
			rollLocation: this.rollLocation,
			item: this.item,
			actor: this.actor,
			apSpend: apSpend,
			apBuy: apBuy,
		}).then(result => this.deferred.resolve(result));

		let ap = game.settings.get("fallout", "partyAP");
		let gmAP = parseInt(game.settings.get("fallout", "gmAP"));

		if (apBuy>0) {
			ap = 0;
			fallout.APTracker.setAP("partyAP", ap);
			let giveGmAP = apBuy + gmAP;
			fallout.APTracker.setAP("gmAP", giveGmAP);
		}
		else {
			// eslint-disable-next-line no-lonely-if
			if (this.actor.type === ("character" || "robot")) {
				let leftPartyAp = ap - apSpend;
				fallout.APTracker.setAP("partyAP", leftPartyAp);
			}
			else {
				let leftPartyAp = gmAP - apSpend;
				fallout.APTracker.setAP("gmAP", leftPartyAp);
			}

		}
		if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {

			// REDUCE AMMO
			if (this.actor && this.item?.system.ammo !== "" ) {
				try {
					if (this.item.system.damage.weaponQuality.gatling.value === true) {
						this.actor.reduceAmmo(
							this.item.system.ammo,
							this.item.system.ammoPerShot*10
						);

					}
					else {
						this.actor.reduceAmmo(
							this.item.system.ammo,
							this.item.system.ammoPerShot
						);
					}
				}
				catch(er) {
					console.warn(er);
				}
			}
		}
	}

	AssistanceButton() {
		let attr = this.element.find('[name="attribute"]').val();
		let skill = this.element.find('[name="skill"]').val();
		let complication = this.element.find('[name="complication"]').val();
		let apBuy = 0;
		let apSpend = 0;
		let isTag = this.element.find('[name="tag"]').is(":checked");
		this.rolling = true;
		let nameroll = "";
		if (this.item !== null) {
			nameroll = `${game.i18n.localize("FALLOUT.UI.ASSISTANCE")} ${game.i18n.localize("FALLOUT.UI.With")} ${game.i18n.localize("TYPES.Item.weapon").toLowerCase()} ${this.rollName}`;
		}
		else {
			nameroll = `${game.i18n.localize("FALLOUT.UI.ASSISTANCE")} ${game.i18n.localize("FALLOUT.UI.With")} ${game.i18n.localize("TYPES.Item.skill").toLowerCase()} ${this.rollName}`;
		}
		fallout.Roller2D20.rollD20({
			rollname: nameroll,
			dicenum: 1,
			attribute: attr,
			skill: skill,
			tag: isTag,
			complication: complication,
			rollLocation: this.rollLocation,
			item: this.item,
			actor: this.actor,
			apSpend: apSpend,
			apBuy: apBuy,
		}).then(result => this.deferred.resolve(result));

		if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {

			// REDUCE AMMO
			if (this.actor && this.item?.system.ammo !== "") {
				try {
					if (this.item.system.damage.weaponQuality.gatling.value === true) {
						this.actor.reduceAmmo(
							this.item.system.ammo,
							this.item.system.ammoPerShot*10
						);

					}
					else {
						this.actor.reduceAmmo(
							this.item.system.ammo,
							this.item.system.ammoPerShot
						);
					}
				}
				catch(er) {
					console.warn(er);
				}
			}
		}
	}

	async close(options={}) {
		super.close(options);
		if (!this.rolling) {
			this.deferred.resolve(null);
		}
	}

	markDiceNumber(html, numberOfDice, gmError) {
		let nextDice;
		let markedDice = 0;
		for (let i = 2; i <= 5; i++) {
			const diceElement =this.element.find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				markedDice = i;
			}
		}
		if ((numberOfDice === 2 || ($(html).find('[name="freed20"]').is(":checked") && numberOfDice === 3)) && markedDice === numberOfDice) {
			const diceElement = $(html).find(`[data-index="${numberOfDice}"]`);
			diceElement.addClass("marked");
		 }
		else {
			const currentdice = $(html).find(`[data-index="${numberOfDice}"]`).hasClass("marked");
			if (numberOfDice+1 >5) {
				nextDice = false;
			}
			else {
				nextDice = $(html).find(`[data-index="${numberOfDice + 1}"]`).hasClass("marked");
			}
			for (let i = 2; i <= 5; i++) {
				const diceElement = $(html).find(`[data-index="${i}"]`);
				if (i<=this.diceNum && currentdice === false) {
					diceElement.addClass("marked");
				}
				if (i> this.diceNum && nextDice === true) {
					diceElement.removeClass("marked");
				}
				if (i === this.diceNum && nextDice === false && currentdice === true) {
					diceElement.removeClass("marked");
				}
			}
		}
		if (gmError) {
			let i = 0;
			if ($(html).find('[name="freed20"]').is(":checked") ) {
				i = 4;
			}
			else {
				i = 3;
			}
			for (i; i <= 5; i++) {
				const diceElement = $(html).find(`[data-index="${i}"]`);
				diceElement.removeClass("marked");
			}

		}
	}


	freeD20(html) {
		const regular = game.i18n.localize("FALLOUT.UI.REGULAR");
		const pay1ap = game.i18n.localize("FALLOUT.UI.PAYAP1");
		const pay3ap = game.i18n.localize("FALLOUT.UI.PAYAP3");
		const pay6ap = game.i18n.localize("FALLOUT.UI.PAYAP6");
		const li2d20 = document.querySelector('[name="2d20"]');
		let numberOfDice = 0;
		for (let i = 2; i <= 5; i++) {
			const diceElement =this.element.find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberOfDice = i;
			}
		}

		if ($(html).find('[name="freed20"]').is(":checked")) {
			li2d20.style.display = "none";
			$(html).find("ul[name='currentap'] li:nth-child(2) label").text(regular);
			if (numberOfDice === 2) {
				$(html).find("[data-index= 3]").addClass("marked");
			}
			$(html).find("ul[name='currentap'] li:nth-child(3) label").text(pay1ap);
			$(html).find("ul[name='currentap'] li:nth-child(4) label").text(pay3ap);
		}
		else {
			li2d20.style.display = "";
			$(html).find("ul[name='currentap'] li:nth-child(1) label").text(regular);
			$(html).find("ul[name='currentap'] li:nth-child(2) label").text(pay1ap);
			$(html).find("ul[name='currentap'] li:nth-child(3) label").text(pay3ap);
			$(html).find("ul[name='currentap'] li:nth-child(4) label").text(pay6ap);
			if (numberOfDice === 3) {
				$(html).find("[data-index= 3]").removeClass("marked");
			}

		}
	}

	apManagment(html) {
		let apCost = 0;
		let left = 0;
		let numberOfDice = 0;
		let ap =this.element.find('[name="current_ap"]').val();
		for (let i = 2; i <= 5; i++) {
			const diceElement = $(html).find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberOfDice = i;
			}
		}
		if ($(html).find('[name="freed20"]').is(":checked")) {
			switch (numberOfDice) {
				case 2:
					apCost = 0;
					$(html).find('[name="by_from_gm"]').val(0);
					break;
				case 3:
					apCost = 0;
					$(html).find('[name="by_from_gm"]').val(0);
					break;
				case 4:
					apCost = 1;
					left = ap - apCost;
					break;
				case 5:
					apCost = 3;
					left = ap - apCost;
					break;
			}
		}
		else {
			switch (numberOfDice) {
				case 2:
					apCost = 0;
					$(html).find('[name="by_from_gm"]').val(0);
					break;
				case 3:
					apCost = 1;
					left = ap - apCost;
					break;
				case 4:
					apCost = 3;
					left = ap - apCost;
					break;
				case 5:
					apCost = 6;
					left = ap - apCost;
					break;
			}
		}
		if (left<0) {
			const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
			const part2 = game.i18n.localize("FALLOUT.TEMPLATES.PARTY_AP");
			const warexist =ui.notifications.active.length;
			if (warexist === 0) {
				ui.notifications.warn(`${part1} ${part2}`);
			}
			$(html).find('[name="spend_ap"]').val(ap);
			$(html).find('[name="by_from_gm"]').val(-1*left);
		}
		else {
			$(html).find('[name="spend_ap"]').val(apCost);
			$(html).find('[name="by_from_gm"]').val(0);
		}
	}

	gmApManagment(html) {
		let apCost = 0;
		let left = 0;
		let numberOfDice = 0;
		let ap =this.element.find('[name="current_ap"]').val();
		for (let i = 2; i <= 5; i++) {
			const diceElement = $(html).find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberOfDice = i;
			}
		}
		if ($(html).find('[name="freed20"]').is(":checked")) {
			switch (numberOfDice) {
				case 2:
					apCost = 0;
					break;
				case 3:
					apCost = 0;
					break;
				case 4:
					apCost = 1;
					left = ap - apCost;
					break;
				case 5:
					apCost = 3;
					left = ap - apCost;
					break;
			}
		}
		else {
			switch (numberOfDice) {
				case 2:
					apCost = 0;
					break;
				case 3:
					apCost = 1;
					left = ap - apCost;
					break;
				case 4:
					apCost = 3;
					left = ap - apCost;
					break;
				case 5:
					apCost = 6;
					left = ap - apCost;
					break;
			}
		}
		if (left<0) {
			const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
			const part2 = game.i18n.localize("FALLOUT.TEMPLATES.OVERSEER_AP");
			const warExist =ui.notifications.active.length;
			if (warExist === 0) {
				ui.notifications.warn(`${part1} ${part2}`);
			}
			let numberOfDice = 2;
			let gmError = true;
			this.markDiceNumber(html, numberOfDice, gmError);
		}
		else {
			$(html).find('[name="spend_ap"]').val(apCost);
		}

	}

	gmRoll(html) {
		const divbuy = document.querySelector('[name="buy_from_gm"]');
		divbuy.style.display = "none";
		let gmAP = game.settings.get("fallout", "gmAP");
		this.element.find('[name="current_ap"]').val(gmAP);
		$(html).find('[name="party_ap"] .title-label').text(game.i18n.localize("FALLOUT.TEMPLATES.OVERSEER_AP"));
		$(html).find('[name="spend_ap"] .title-label').text(game.i18n.localize("FALLOUT.UI.Spend_Overseer_AP"));
	}


	static async  createDialog({ rollName = "Roll D20", diceNum = 2, attribute = 0, skill = 0, tag = false, complication = 20, rollLocation=false, actor=null, item=null, ap = 0, apCost = 0 } = {}) {
		let dialogData = {};

		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.attribute = attribute;
		dialogData.skill = skill;
		dialogData.tag = tag;
		dialogData.complication = complication;
		dialogData.rollLocation = rollLocation;
		dialogData.actor = actor;
		dialogData.item = item;
		dialogData.ap = ap;
		dialogData.apCost = apCost;
		const html = await renderTemplate("systems/fallout/templates/dialogs/dialog2d20.hbs", dialogData);

		let d = new Dialog2d20(
			rollName,
			diceNum,
			attribute,
			skill,
			tag,
			complication,
			rollLocation,
			actor,
			item,
			ap,
			apCost,
			{
				title: rollName,
				content: html,
				buttons: {
					roll: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("FALLOUT.UI.Roll"),
					},
					help: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("FALLOUT.UI.ASSISTANCE"),
					},

				},
			}
		);
		d.render(true, {width: 620, height: 320});
		return d.deferred.promise;
	}


}


class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}
