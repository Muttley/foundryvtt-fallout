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
		this.options.classes = ["dice-icon"];
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.ready(e => {
			this.markDiceNumber(html, this.diceNum);
		});

		html.on("click", ".dice-icon", (e, i, a) => {
			let index = e.currentTarget.dataset.index;
			this.diceNum = parseInt(index);
			this.markDiceNumber(html, this.diceNum);
		});

		html.on("click", ".roll", event => {
			let attr = html.find('[name="attribute"]').val();
			let skill = html.find('[name="skill"]').val();
			let complication = html.find('[name="complication"]').val();
			let isTag = html.find('[name="tag"]').is(":checked");

			fallout.Roller2D20.rollD20({
				rollname: this.rollName,
				dicenum: this.diceNum,
				attribute: attr,
				skill: skill,
				tag: isTag,
				complication: complication,
				rollLocation: this.rollLocation,
				item: this.item,
				actor: this.actor,
			});

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
		});
	}

	markDiceNumber(html) {
		$(html).find(".dice-icon").removeClass("marked");
		$(html).find(`[data-index="${this.diceNum}"]`).addClass("marked");
	}

	static async createDialog({ rollName = "Roll D20", diceNum = 2, attribute = 0, skill = 0, tag = false, complication = 20, rollLocation=false, actor=null, item=null } = {}) {
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
			{
				title: rollName,
				content: html,
				buttons: {
					roll: {
						icon: '<i class="fas fa-check"></i>',
						label: "ROLL",
					},
				},
			}
		);

		d.render(true);
	}
}
