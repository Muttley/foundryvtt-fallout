export class DialogD6 extends Dialog {

    constructor(rollName, diceNum, dialogData = {}, options = {}) {
        super(dialogData, options);
        this.rollName = rollName;
        this.diceNum = diceNum;
        this.options.classes = ["dice-icon"];
    }

    static async createDialog({ rollName = "DC Roll", diceNum = 2 } = {}) {
        let dialogData = {}
        dialogData.rollName = rollName;
        dialogData.diceNum = diceNum;
        const html = `<div class="flexrow fallout-dialog">
        <div class="flexrow resource" style="padding:5px">
        <label class="title-label">Number of Dice:</label><input type="number" class="d-number" value="1">
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
                        game.fallout.Roller2D20.rollD6({ rollname: "DC Roll", dicenum: parseInt(diceNum) });
                    }
                }
            },
            default: "roll",
            close: () => { },
        });
        d.render(true);
    }
}