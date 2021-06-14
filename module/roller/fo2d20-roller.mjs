export class Roller2D20 {

    dicesRolled = [];
    successTreshold = 0;
    critTreshold = 0;
    complicationTreshold = 20;
    successes = 0;

    async roll20({ dicenum = 2, attribute = 0, skill = 0, tag = false, difficulty = 1, complication = 20 } = {}) {
        this.dicesRolled = [];
        this.successes = 0;
        this.successTreshold = attribute + skill;
        this.critTreshold = tag ? skill : 1;
        this.complicationTreshold = complication;
        let formula = `${dicenum}d20`;
        let roll = new Roll(formula);
        await roll.evaluate();
        this.parseRoll(roll);
    }

    parseRoll(roll, rerollIndexes) {
        let i = 0; // use to track reroll index
        roll.dice.forEach(d => {
            d.results.forEach(r => {
                console.log(r);
                let diceSuccess = 0;
                let diceComplication = 0;
                if (r.result <= this.successTreshold) {
                    diceSuccess++;
                }
                if (r.result <= this.critTreshold) {
                    diceSuccess++;
                }
                if (r.result >= this.complicationTreshold) {
                    diceComplication = 1;
                }
                // if there are no rollIndexes sent then it is a new roll. Otherwise it's a re-roll and we should replace dices at given indexes
                if (!rerollIndexes) {
                    this.dicesRolled.push({ success: diceSuccess, reroll: false, result: r.result, complication: diceComplication });
                }
                else {
                    this.dicesRolled[rerollIndexes[i]] = { success: diceSuccess, reroll: true, result: r.result, complication: diceComplication };
                    i++;
                }

            })
        });
        this.countSuccesses();
        console.warn(`Rolling ${roll.formula} with scsTr=${this.successTreshold} and crit=${this.critTreshold} getting SUCCESS=${this.successes}`)
        console.log(this.dicesRolled);
        roll.toMessage();
        this.sendToChat(roll);
    }

    async reroll20({ indexes = [0, 2] }) {
        //replace dices in dicesRolled
        if (!indexes.length) {
            ui.notifications.notify('Nothing to Reroll');
        }
        let numOfDice = indexes.length;
        let formula = `${numOfDice}d20`;
        let roll = new Roll(formula);
        await roll.evaluate();
        this.parseRoll(roll, indexes);
    }

    countSuccesses() {
        this.successes = 0;
        this.dicesRolled.forEach(d => {
            this.successes += d.success;
        });
    }

    async sendToChat(_roll) {
        let rollData = {
            successes: this.successes,
            results: this.dicesRolled
        }
        const html = await renderTemplate("systems/fallout/templates/chat/roll2d20.html", rollData);
        let chatData = {
            user: game.user.id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll: _roll,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        await ChatMessage.create(chatData);
    }

}