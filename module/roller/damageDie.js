export class DieFalloutDamage extends Die {
    constructor(termData) {
        termData.faces = 6;
        super(termData);
    }

    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "c";


    /* -------------------------------------------- */

    /** @override */
    getResultLabel(result) {
        return {
            "1": '<img src="systems/fallout/assets/dice/d1.webp" />',
            "2": '<img src="systems/fallout/assets/dice/d2.webp" />',
            "3": '<img src="systems/fallout/assets/dice/d3.webp" />',
            "4": '<img src="systems/fallout/assets/dice/d4.webp" />',
            "5": '<img src="systems/fallout/assets/dice/d5.webp" />',
            "6": '<img src="systems/fallout/assets/dice/d6.webp" />'
        }[result.result];
    }

    static values = {
        1: 1,
        2: 2,
        3: 0,
        4: 0,
        5: "<img width='24' height='24' style='border: none' src='systems/conan2d20/assets/dice/d5.webp'/>",
        6: "<img width='24' height='24' style='border: none' src='systems/conan2d20/assets/dice/d6.webp'/>",
    };

    get total() {
        if (!this._evaluated) return null;
        return this.results.reduce((t, r) => {
            if (!r.active) return t;
            if (r.count !== undefined) return t + r.count;
            return t + DieFalloutDamage.getValue(r.result);
        }, 0);
    }

    /** @override */
    roll(options) {
        const roll = super.roll(options);
        roll.effect = roll.result === 5 || roll.result === 6;
        return roll;
    }

    get resultValues() {
        return this.results.map(result => {
            return DieFalloutDamage.getResultLabel(result.result);
        });
    }

    static getValue(dieSide) {
        // 1 if Effect, otherwise take the value
        return typeof DieFalloutDamage.values[dieSide] === 'string'
            ? 1
            : DieFalloutDamage.values[dieSide];
    }
}
