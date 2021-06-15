export class Roller2D20 {
    dicesRolled = [];
    successTreshold = 0;
    critTreshold = 0;
    complicationTreshold = 20;
    successes = 0;

    static async rollD20({ rollname = "Roll xD20", dicenum = 2, attribute = 0, skill = 0, tag = false, difficulty = 1, complication = 20 } = {}) {
        let dicesRolled = [];
        let successTreshold = attribute + skill;
        let critTreshold = tag ? skill : 1;
        let complicationTreshold = complication;
        let formula = `${dicenum}d20`;
        let roll = new Roll(formula);
        await roll.evaluate();
        await Roller2D20.parseD20Roll({
            rollname: rollname,
            roll: roll,
            successTreshold: successTreshold,
            critTreshold: critTreshold,
            complicationTreshold: complicationTreshold
        });
    }

    static async parseD20Roll({ rollname = "Roll xD20", roll = null, successTreshold = 0, critTreshold = 1, complicationTreshold = 20, dicesRolled = [], rerollIndexes = [] }) {
        let i = 0;
        roll.dice.forEach(d => {
            d.results.forEach(r => {
                let diceSuccess = 0;
                let diceComplication = 0;
                if (r.result <= successTreshold) {
                    diceSuccess++;
                }
                if (r.result <= critTreshold) {
                    diceSuccess++;
                }
                if (r.result >= complicationTreshold) {
                    diceComplication = 1;
                }
                // if there are no rollIndexes sent then it is a new roll. Otherwise it's a re-roll and we should replace dices at given indexes
                if (!rerollIndexes.length) {
                    dicesRolled.push({ success: diceSuccess, reroll: false, result: r.result, complication: diceComplication });
                }
                else {
                    dicesRolled[rerollIndexes[i]] = { success: diceSuccess, reroll: true, result: r.result, complication: diceComplication };
                    i++;
                }
            })
        });
        //let successesNum = Roller2D20.getNumOfSuccesses(dicesRolled);
        //console.warn(successesNum);
        await Roller2D20.sendToChat({
            rollname: rollname,
            roll: roll,
            successTreshold: successTreshold,
            critTreshold: critTreshold,
            complicationTreshold: complicationTreshold,
            dicesRolled: dicesRolled,
            rerollIndexes: rerollIndexes
        });
    }

    static async rerollD20({ rollname = "Roll xD20", roll = null, successTreshold = 0, critTreshold = 1, complicationTreshold = 20, dicesRolled = [], rerollIndexes = [] } = {}) {
        if (!rerollIndexes.length) {
            ui.notifications.notify('Select Dice you want to Reroll');
            return;
        }
        let numOfDice = rerollIndexes.length;
        let formula = `${numOfDice}d20`;
        let _roll = new Roll(formula);
        await _roll.evaluate();
        await Roller2D20.parseD20Roll({
            rollname: `${rollname} re-roll`,
            roll: _roll,
            successTreshold: successTreshold,
            critTreshold: critTreshold,
            complicationTreshold: complicationTreshold,
            dicesRolled: dicesRolled,
            rerollIndexes: rerollIndexes
        });

    }

    static async sendToChat({ rollname = "Roll xD20", roll = null, successTreshold = 0, critTreshold = 1, complicationTreshold = 20, dicesRolled = [], rerollIndexes = [] } = {}) {
        let successesNum = Roller2D20.getNumOfSuccesses(dicesRolled);
        let complicationsNum = Roller2D20.getNumOfComplications(dicesRolled);
        let rollData = {
            rollname: rollname,
            successes: successesNum,
            complications: complicationsNum,
            results: dicesRolled,
            successTreshold: successTreshold
        }
        const html = await renderTemplate("systems/fallout/templates/chat/roll2d20.html", rollData);
        let falloutRoll = {}
        falloutRoll.rollname = rollname;
        falloutRoll.dicesRolled = dicesRolled;
        falloutRoll.successTreshold = successTreshold;
        falloutRoll.critTreshold = critTreshold;
        falloutRoll.complicationTreshold = complicationTreshold;
        falloutRoll.rerollIndexes = rerollIndexes;


        let chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            flags: { falloutroll: falloutRoll },
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: roll,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        await ChatMessage.create(chatData);
    }

    static getNumOfSuccesses(results) {
        let s = 0;
        results.forEach(d => {
            s += d.success;
        });
        return s;
    }

    static getNumOfComplications(results) {
        let r = 0;
        results.forEach(d => {
            r += d.complication;
        });
        return r;
    }

}

Hooks.on('renderChatMessage', (message, html, data) => {
    let rrlBtn = html.find('.reroll-button');
    if (rrlBtn.length > 0) {
        rrlBtn[0].setAttribute('data-messageId', message._id);
        rrlBtn.click((el) => {
            let selectedDiceForReroll = $(el.currentTarget).parent().find('.dice-selected');
            let rerollIndex = [];
            for (let d of selectedDiceForReroll) {
                rerollIndex.push($(d).data('index'));
            }
            if (!rerollIndex.length) {
                ui.notifications.notify('Select Dice you want to Reroll');
            }
            else {
                let falloutRoll = message.data.flags.falloutroll;
                Roller2D20.rerollD20({
                    rollname: falloutRoll.rollname,
                    rerollIndexes: rerollIndex,
                    successTreshold: falloutRoll.successTreshold,
                    critTreshold: falloutRoll.critTreshold,
                    complicationTreshold: falloutRoll.complicationTreshold,
                    dicesRolled: falloutRoll.dicesRolled
                });
            }
        })
    }
    html.find('.dice-icon').click((el) => {
        if ($(el.currentTarget).hasClass('reroll'))
            return;
        if ($(el.currentTarget).hasClass('dice-selected')) {
            $(el.currentTarget).removeClass('dice-selected');
        } else {
            $(el.currentTarget).addClass('dice-selected')
        }
    })
})