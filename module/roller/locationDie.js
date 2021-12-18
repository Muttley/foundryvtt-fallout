export class DieFalloutLocation extends Die {
    constructor(termData) {
        termData.faces = 20;
        super(termData);
    }

    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "h";


    /* -------------------------------------------- */

    /** @override */
    getResultLabel(result) {
        return {
            "1": 'He',
            "2": 'He',
            "3": 'To',
            "4": 'To',
            "5": 'To',
            "6": 'To',
            "7": 'To',
            "8": 'To',
            "9": 'LA',
            "10": 'LA',
            "11": 'LA',
            "12": 'RA',
            "13": 'RA',
            "14": 'RA',
            "15": 'LL',
            "16": 'LL',
            "17": 'LL',
            "18": 'RL',
            "19": 'RL',
            "20": 'RL'
        }[result.result];
    }

    static values = {
        1: 'He',
        2: 'He',
        3: 'To',
        4: 'To',
        5: 'To',
        6: 'To',
        7: 'To',
        8: 'To',
        9: 'LA',
        10: 'LA',
        11: 'LA',
        12: 'RA',
        13: 'RA',
        14: 'RA',
        15: 'LL',
        16: 'LL',
        17: 'LL',
        18: 'RL',
        19: 'RL',
        20: 'RL'
    };
}

export class DieFalloutRobotLocation extends Die {
    constructor(termData) {
        termData.faces = 20;
        super(termData);
    }

    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "r";


    /* -------------------------------------------- */

    /** @override */
    getResultLabel(result) {
        return {
            "1": 'Op',
            "2": 'Op',
            "3": 'MB',
            "4": 'MB',
            "5": 'MB',
            "6": 'MB',
            "7": 'MB',
            "8": 'MB',
            "9": 'A1',
            "10": 'A1',
            "11": 'A1',
            "12": 'A2',
            "13": 'A2',
            "14": 'A2',
            "15": 'A3',
            "16": 'A3',
            "17": 'A3',
            "18": 'Th',
            "19": 'Th',
            "20": 'Th'
        }[result.result];
    }

    static values = {
        1: 'H',
        2: 'H',
        3: 'T',
        4: 'T',
        5: 'T',
        6: 'T',
        7: 'T',
        8: 'T',
        9: 'LA',
        10: 'LA',
        11: 'LA',
        12: 'RA',
        13: 'RA',
        14: 'RA',
        15: 'LL',
        16: 'LL',
        17: 'LL',
        18: 'RL',
        19: 'RL',
        20: 'RL'
    };
}

