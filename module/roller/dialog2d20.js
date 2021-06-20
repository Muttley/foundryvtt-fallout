export class Dialog2d20 extends Dialog {


    constructor(rollName, diceNum, attribute, skill, tag, complication, dialogData = {}, options = {}) {
        super(dialogData, options);
        this.rollName = rollName;
        this.diceNum = diceNum;
        this.attribute = attribute;
        this.skill = skill;
        this.tag = tag;
        this.complication = complication;
        this.options.classes = ["dice-icon"];
    }

    //override
    activateListeners(html) {
        super.activateListeners(html);
        html.ready((e) => {
            this.markDiceNumber(html, this.diceNum);
        })
        html.on('click', '.dice-icon', (e, i, a) => {
            let index = e.currentTarget.dataset.index;
            this.diceNum = parseInt(index);
            this.markDiceNumber(html, this.diceNum);
        });
        html.on('click', '.roll', (event) => {
            let attr = html.find('[name="attribute"]').val();
            let skill = html.find('[name="skill"]').val();
            let complication = html.find('[name="complication"]').val();
            let isTag = html.find('[name="tag"]').is(':checked');
            game.fallout.Roller2D20.rollD20({ rollname: this.rollName, dicenum: this.diceNum, attribute: attr, skill: skill, tag: isTag, complication: complication })
        });
    }

    markDiceNumber(html) {
        $(html).find('.dice-icon').removeClass('marked');
        $(html).find(`[data-index="${this.diceNum}"]`).addClass('marked');
    }

    static async createDialog({ rollName = "Roll D20", diceNum = 2, attribute = 0, skill = 0, tag = false, complication = 20 } = {}) {
        let dialogData = {}
        dialogData.rollName = rollName;
        dialogData.diceNum = diceNum;
        dialogData.attribute = attribute;
        dialogData.skill = skill;
        dialogData.tag = tag;
        dialogData.complication = complication;
        const html = await renderTemplate("systems/fallout/templates/dialogs/dialog2d20.html", dialogData);
        let d = new Dialog2d20(rollName, diceNum, attribute, skill, tag, complication, {
            title: rollName,
            content: html,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "ROLL"
                }
            }
        });
        d.render(true);
    }
}