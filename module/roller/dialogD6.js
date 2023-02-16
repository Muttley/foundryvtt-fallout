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
        // Check when the box is changed if actor has enough ammo
        super.activateListeners(html);
        // html.on('change', '.d-number', async (e, i, a) => {
        //     await this.checkAmmo(html)        
        // })

        html.on('click', '.roll', async (event) => {
            let diceNum = html.find('.d-number')[0].value;

            let additionalAmmo = 0;

            if(this.weapon?.system.ammo){
                let initDmg = this.falloutRoll ? 0 : this.weapon.system.damage.rating
                additionalAmmo = this.checkAmmo(diceNum, initDmg)
                if(additionalAmmo<0)
                    return;
            }
            
            
            if (!this.falloutRoll){                            
                game.fallout.Roller2D20.rollD6({ rollname: this.rollName, dicenum: parseInt(diceNum), weapon: this.weapon, actor: this.actor });
                if(additionalAmmo>0)
                    await this.actor.reduceAmmo(this.weapon.system.ammo, additionalAmmo)
            }
            else{
                game.fallout.Roller2D20.addD6({ rollname: this.rollName, dicenum: parseInt(diceNum), weapon: this.weapon, actor: this.actor, falloutRoll: this.falloutRoll });
                if(additionalAmmo>0){
                    //! IT ONLY WORKS FOR LINKED ACTORS SINCE THE CHAT MESSAGE TRUCATES ACTOR IN THE FLAGS
                    const _actor = game.actors.get(this.actor._id)
                    await _actor.reduceAmmo(this.weapon.system.ammo, additionalAmmo)
                }
            }
        })
    }

    async rollD6(){

    }

    async addD6(){

    }

    static async createDialog({ rollName = "DC Roll", diceNum = 2, falloutRoll = null, actor= null, weapon = null } = {}) {
        let dialogData = {}
        dialogData.rollName = rollName;
        dialogData.diceNum = diceNum;
        dialogData.falloutRoll = falloutRoll;
        dialogData.weapon = weapon;
        dialogData.actor = actor;
        const html = `<div class="flexrow fallout-dialog">
        <div class="flexrow resource" style="padding:5px">
        <label class="title-label">Number of Dice:</label><input type="number" class="d-number" value="${diceNum}">
        </div>
        </div>`
        // let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll,{
        //     title: rollName,
        //     content: html,
        //     buttons: {
        //         roll: {
        //             icon: '<i class="fas fa-check"></i>',
        //             label: "ROLL",
        //             callback: async (html) => {                       
        //                 let diceNum = html.find('.d-number')[0].value;
        //                 if (!falloutRoll){                            
        //                     game.fallout.Roller2D20.rollD6({ rollname: rollName, dicenum: parseInt(diceNum), weapon: weapon });
        //                 }
        //                 else{
        //                     game.fallout.Roller2D20.addD6({ rollname: rollName, dicenum: parseInt(diceNum), weapon: weapon, falloutRoll: falloutRoll });
        //                 }
        //             }
        //         }
        //     },
        //     default: "roll",
        //     close: () => { },
        // });
        let d = new DialogD6(rollName, diceNum, actor, weapon, falloutRoll, {
            title: rollName,
            content: html,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "ROLL"
                }
            },
            close: () => { },
        });
        d.render(true);
    }

    checkAmmo(diceNum, initDmg){
        if(!this.actor)
            return 0;
        if(!this.weapon)
            return 0;
        if(this.weapon.system.ammo == "")
            return 0;

        //! Check if there is ammo at all
        const ammo = this.actor.items.find(i => i.name ==this.weapon.system.ammo)
        if(!ammo){
            ui.notifications.warn(`Ammo ${this.weapon.system.ammo} not found`)
            return -1;
        }

        //! Check if there is enough ammo
        const totalDice = parseInt(diceNum);        
        const weaponDmg = parseInt(initDmg)
        const additionalAmmo = Math.max(0, totalDice - weaponDmg)
       
        if(parseInt(ammo.system.quantity)<additionalAmmo){
            ui.notifications.warn(`Not enough ${this.weapon.system.ammo} ammo`)
            return -1;
        }

        
        return additionalAmmo;
        
    }
}