export class Dialog2d20 extends Dialog {


    constructor(diceNum, attribute, skill, tag, complication, dialogData = {}, options = {}) {
        super(dialogData, options);
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
            game.fallout.Roller2D20.rollD20({ rollname: "SOME SKILL", dicenum: this.diceNum, attribute: attr, skill: skill, tag: isTag, complication: complication })
        });
    }

    markDiceNumber(html) {
        $(html).find('.dice-icon').removeClass('marked');
        $(html).find(`[data-index="${this.diceNum}"]`).addClass('marked');
    }

    static async createDialog({ diceNum = 2, attribute = 0, skill = 0, tag = false, complication = 20 } = {}) {
        let dialogData = {}
        dialogData.diceNum = diceNum;
        dialogData.attribute = attribute;
        dialogData.skill = skill;
        dialogData.tag = tag;
        dialogData.complication = complication;
        const html = await renderTemplate("systems/fallout/templates/dialogs/dialog2d20.html", dialogData);
        let d = new Dialog2d20(diceNum, attribute, skill, tag, complication, {
            title: "D20 Dialog",
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