export class DieFalloutDamage extends Die {
    constructor(termData ) {
        termData.faces=6;
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
}
