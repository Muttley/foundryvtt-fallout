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
		apcost,
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
		this.apcost = apcost;
		this.options.classes = ["dice-icon"];
		this.deferred = new Deferred();
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.ready(e => {
			this.markDiceNumber(html, this.diceNum);
			if (this.actor.type !== ("charakter" || "robot")) {
				this.gmroll(html);
			}
			this.freed20(html);
		});

		html.on("click", ".dice-icon", (e, i, a) => {
			let index = e.currentTarget.dataset.index;
			this.diceNum = parseInt(index);
			this.markDiceNumber(html, this.diceNum);
			if (this.actor.type === ("charakter" || "robot")) {
				this.apmanagment(html);
			}
			else {
				this.gmapmanagment(html);
			}

		});
		html.on("click", '[name="freed20"]', () => {
			this.freed20(html);
			let numberofdice = 0;
			for (let i = 2; i <= 5; i++) {
				const diceElement =this.element.find(`[data-index="${i}"]`);
				const containsMarked = diceElement.hasClass("marked");
				if (containsMarked) {
					numberofdice = i;
				}
			}
			if (this.actor.type === ("charakter" || "robot")) {
				this.apmanagment(html, numberofdice);
			}
			else {
				this.gmapmanagment(html, numberofdice);
			}

		});
		html.on("click", () => {
			if (this.actor.type === ("charakter" || "robot")) {
				let ap = game.settings.get("fallout", "partyAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.apmanagment(html);
			}
			else {
				let ap = game.settings.get("fallout", "gmAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.gmapmanagment(html);
			}
		});


		this.data.buttons.roll.callback = () => {
			if (this.actor.type === ("charakter" || "robot")) {
				let ap = game.settings.get("fallout", "partyAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.apmanagment(html);
			}
			else {
				let ap = game.settings.get("fallout", "gmAP");
				this.element.find('[name="current_ap"]').val(ap);
				this.gmapmanagment(html);
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
		let apspend = this.element.find('[name="spend_ap"]').val();
		let apbuy = parseInt(this.element.find('[name="by_from_gm"]').val());
		this.rolling = true;
		let numberofdice = 0;
		for (let i = 2; i <= 5; i++) {
			const diceElement =this.element.find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberofdice = i;
			}
		}
		fallout.Roller2D20.rollD20({
			rollname: this.rollName,
			dicenum: numberofdice,
			attribute: attr,
			skill: skill,
			tag: isTag,
			complication: complication,
			rollLocation: this.rollLocation,
			item: this.item,
			actor: this.actor,
			apspend: apspend,
			apbuy: apbuy,
		}).then(result => this.deferred.resolve(result));

		let ap = game.settings.get("fallout", "partyAP");
		let gmap = parseInt(game.settings.get("fallout", "gmAP"));

		if (apbuy>0) {
			ap = 0;
			fallout.APTracker.setAP("partyAP", ap);
			let givegmap = apbuy + gmap;
			fallout.APTracker.setAP("gmAP", givegmap);
		}
		else {
			// eslint-disable-next-line no-lonely-if
			if (this.actor.type === ("charakter" || "robot")) {
				let leftpartyap = ap - apspend;
				fallout.APTracker.setAP("partyAP", leftpartyap);
			}
			else {
				let leftpartyap = gmap - apspend;
				fallout.APTracker.setAP("gmAP", leftpartyap);
			}

		}
		if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {
			const actorType = this.actor?.type;
			if (actorType !== "character" && actorType !== "robot") return;

			// REDUCE AMMO
			if (this.actor && this.item?.system.ammo !== "" ) {
				try {
					this.actor.reduceAmmo(
						this.item.system.ammo,
						this.item.system.ammoPerShot
					);
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
		let apbuy = this.element.find('[name="by_from_gm"]').val();
		let apspend = this.element.find('[name="spend_ap"]').val();
		let isTag = this.element.find('[name="tag"]').is(":checked");
		this.rolling = true;
		let nameroll = "";
		if (this.item !== null) {
			nameroll = `${game.i18n.localize("FALLOUT.ASSISTANCE")} ${game.i18n.localize("FALLOUT.With")} ${game.i18n.localize("TYPES.Item.weapon").toLowerCase()} ${this.rollName}`;
		}
		else {
			nameroll = `${game.i18n.localize("FALLOUT.ASSISTANCE")} ${game.i18n.localize("FALLOUT.With")} ${game.i18n.localize("TYPES.Item.skill").toLowerCase()} ${this.rollName}`;
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
			apspend: apspend,
			apbuy: apbuy,
		}).then(result => this.deferred.resolve(result));

		if (game.settings.get("fallout", "automaticAmmunitionCalculation")) {
			const actorType = this.actor?.type;
			if (actorType !== "character" && actorType !== "robot") return;

			// REDUCE AMMO
			if (this.actor && this.item?.system.ammo !== "") {
				try {
					this.actor.reduceAmmo(
						this.item.system.ammo,
						this.item.system.ammoPerShot
					);
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

	markDiceNumber(html, numberofdice, gmerror) {
		let nextdice;
		let markeddice = 0;
		for (let i = 2; i <= 5; i++) {
			const diceElement =this.element.find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				markeddice = i;
			}
		}
		if ((numberofdice === 2 || ($(html).find('[name="freed20"]').is(":checked") && numberofdice === 3)) && markeddice === numberofdice) {
			const diceElement = $(html).find(`[data-index="${numberofdice}"]`);
			diceElement.addClass("marked");
		 }
		else {
			const currentdice = $(html).find(`[data-index="${numberofdice}"]`).hasClass("marked");
			if (numberofdice+1 >5) {
				nextdice = false;
			}
			else {
				nextdice = $(html).find(`[data-index="${numberofdice + 1}"]`).hasClass("marked");
			}
			for (let i = 2; i <= 5; i++) {
				const diceElement = $(html).find(`[data-index="${i}"]`);
				if (i<=this.diceNum && currentdice === false) {
					diceElement.addClass("marked");
				}
				if (i> this.diceNum && nextdice === true) {
					diceElement.removeClass("marked");
				}
				if (i === this.diceNum && nextdice === false && currentdice === true) {
					diceElement.removeClass("marked");
				}
			}
		}
		if (gmerror) {
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


	freed20(html) {
		const regular = game.i18n.localize("FALLOUT.REGULAR");
		const pay1ap = game.i18n.localize("FALLOUT.PAYAP1");
		const pay3ap = game.i18n.localize("FALLOUT.PAYAP3");
		const pay6ap = game.i18n.localize("FALLOUT.PAYAP6");
		const li2d20 = document.querySelector('[name="2d20"]');
		let numberofdice = 0;
		for (let i = 2; i <= 5; i++) {
			const diceElement =this.element.find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberofdice = i;
			}
		}

		if ($(html).find('[name="freed20"]').is(":checked")) {
			li2d20.style.display = "none";
			$(html).find("ul[name='currentap'] li:nth-child(2) label").text(regular);
			if (numberofdice === 2) {
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
			if (numberofdice === 3) {
				$(html).find("[data-index= 3]").removeClass("marked");
			}

		}
	}

	apmanagment(html) {
		let apcostd = 0;
		let left = 0;
		let numberofdice = 0;
		let ap =this.element.find('[name="current_ap"]').val();
		for (let i = 2; i <= 5; i++) {
			const diceElement = $(html).find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberofdice = i;
			}
		}
		if ($(html).find('[name="freed20"]').is(":checked")) {
			switch (numberofdice) {
				case 2:
					apcostd = 0;
					$(html).find('[name="by_from_gm"]').val(0);
					break;
				case 3:
					apcostd = 0;
					$(html).find('[name="by_from_gm"]').val(0);
					break;
				case 4:
					apcostd = 1;
					left = ap - apcostd;
					break;
				case 5:
					apcostd = 3;
					left = ap - apcostd;
					break;
			}
		}
		else {
			switch (numberofdice) {
				case 2:
					apcostd = 0;
					$(html).find('[name="by_from_gm"]').val(0);
					break;
				case 3:
					apcostd = 1;
					left = ap - apcostd;
					break;
				case 4:
					apcostd = 3;
					left = ap - apcostd;
					break;
				case 5:
					apcostd = 6;
					left = ap - apcostd;
					break;
			}
		}
		if (left<0) {
			const part1 = game.i18n.localize("FALLOUT.Not_Enough");
			const part2 = game.i18n.localize("FALLOUT.TEMPLATES.PARTY_AP");
			const warexist =ui.notifications.active.length;
			if (warexist === 0) {
				ui.notifications.warn(`${part1} ${part2}`);
			}
			$(html).find('[name="spend_ap"]').val(ap);
			$(html).find('[name="by_from_gm"]').val(-1*left);
		}
		else {
			$(html).find('[name="spend_ap"]').val(apcostd);
			$(html).find('[name="by_from_gm"]').val(0);
		}
	}

	gmapmanagment(html) {
		let apcostd = 0;
		let left = 0;
		let numberofdice = 0;
		let ap =this.element.find('[name="current_ap"]').val();
		for (let i = 2; i <= 5; i++) {
			const diceElement = $(html).find(`[data-index="${i}"]`);
			const containsMarked = diceElement.hasClass("marked");
			if (containsMarked) {
				numberofdice = i;
			}
		}
		if ($(html).find('[name="freed20"]').is(":checked")) {
			switch (numberofdice) {
				case 2:
					apcostd = 0;
					break;
				case 3:
					apcostd = 0;
					break;
				case 4:
					apcostd = 1;
					left = ap - apcostd;
					break;
				case 5:
					apcostd = 3;
					left = ap - apcostd;
					break;
			}
		}
		else {
			switch (numberofdice) {
				case 2:
					apcostd = 0;
					break;
				case 3:
					apcostd = 1;
					left = ap - apcostd;
					break;
				case 4:
					apcostd = 3;
					left = ap - apcostd;
					break;
				case 5:
					apcostd = 6;
					left = ap - apcostd;
					break;
			}
		}
		if (left<0) {
			const part1 = game.i18n.localize("FALLOUT.Not_Enough");
			const part2 = game.i18n.localize("FALLOUT.TEMPLATES.OVERSEER_AP");
			const warexist =ui.notifications.active.length;
			if (warexist === 0) {
				ui.notifications.warn(`${part1} ${part2}`);
			}
			let numberofdice = 2;
			let gmerror = true;
			this.markDiceNumber(html, numberofdice, gmerror);
		}
		else {
			$(html).find('[name="spend_ap"]').val(apcostd);
		}

	}

	gmroll(html) {
		const divbuy = document.querySelector('[name="buy_from_gm"]');
		divbuy.style.display = "none";
		let gmap = game.settings.get("fallout", "gmAP");
		this.element.find('[name="current_ap"]').val(gmap);
		$(html).find('[name="party_ap"] .title-label').text(game.i18n.localize("FALLOUT.TEMPLATES.OVERSEER_AP"));
		$(html).find('[name="spend_ap"] .title-label').text(game.i18n.localize("FALLOUT.Spend_Overseer_AP"));
	}


	static async  createDialog({ rollName = "Roll D20", diceNum = 2, attribute = 0, skill = 0, tag = false, complication = 20, rollLocation=false, actor=null, item=null, ap = 0, apcost = 0 } = {}) {
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
		dialogData.apcost = apcost;
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
			apcost,
			{
				title: rollName,
				content: html,
				buttons: {
					roll: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("FALLOUT.Roll"),
					},
					help: {
						icon: '<i class="fas fa-check"></i>',
						label: game.i18n.localize("FALLOUT.ASSISTANCE"),
					},

				},
			}
		);
		d.render(true, {width: 550, height: 290});
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
