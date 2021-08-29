export class DialogD6 extends Dialog {

    constructor(rollName, diceNum, dialogData = {}, options = {}) {
        super(dialogData, options);
        this.rollName = rollName;
        this.diceNum = diceNum;
        this.options.classes = ["dice-icon"];
    }

    static async createDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, weapon = null } = {}) {
        let dialogData = {}
        dialogData.rollName = rollName;
        dialogData.diceNum = diceNum;
        dialogData.falloutRoll = falloutRoll;
        dialogData.weapon = weapon;
        const html = `<div class="flexrow fallout-dialog">
        <div class="flexrow resource" style="padding:5px">
        <label class="title-label">Number of Dice:</label><input type="number" class="d-number" value="${diceNum}">
        </div>
        </div>`
        let d = new DialogD6(rollName, diceNum, {
            title: rollName,
            content: html,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "ROLL",
                    callback: (html) => {
                        let diceNum = html.find('.d-number')[0].value;
                        if (!falloutRoll)
                            game.fallout.Roller2D20.rollD6({ rollname: rollName, dicenum: parseInt(diceNum), weapon: weapon });
                        else
                            game.fallout.Roller2D20.addD6({ rollname: rollName, dicenum: parseInt(diceNum), weapon: weapon, falloutRoll: falloutRoll });
                    }
                }
            },
            default: "roll",
            close: () => { },
        });
        d.render(true);
    }
}