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
			1: "Head | Optics | Head | Head",
			2: "Head | Optics | Head | Head",
			3: "Torso | Main Body | Torso | Torso",
			4: "Torso | Main Body | Torso | Torso",
			5: "Torso | Main Body | Torso | Torso",
			6: "Torso | Main Body | Torso | Torso",
			7: "Torso | Main Body | Torso | Torso",
			8: "Torso | Main Body | Torso | Torso",
			9: "Left Arm | Arm 1 | Left Front Leg | Left Wing (as Leg)",
			10: "Left Arm | Arm 1 | Left Front Leg | Left Wing (as Leg)",
			11: "Left Arm | Arm 1 | Left Front Leg | Left Wing (as Leg)",
			12: "Right Arm | Arm 2 | Right Front Leg | Right Wing (as Leg)",
			13: "Right Arm | Arm 2 | Right Front Leg | Right Wing (as Leg)",
			14: "Right Arm | Arm 2 | Right Front Leg | Right Wing (as Leg)",
			15: "Left Leg | Arm 3 | Left Hind Leg | Legs",
			16: "Left Leg | Arm 3 | Left Hind Leg | Legs",
			17: "Left Leg | Arm 3 | Left Hind Leg | Legs",
			18: "Right Leg | Thruster | Right Hind Leg | Legs",
			19: "Right Leg | Thruster | Right Hind Leg | Legs",
			20: "Right Leg | Thruster | Right Hind Leg | Legs",
		}[result.result];
	}

	static values = {
		1: "Head | Optics | Head | Head",
		2: "Head | Optics | Head | Head",
		3: "Torso | Main Body | Torso | Torso",
		4: "Torso | Main Body | Torso | Torso",
		5: "Torso | Main Body | Torso | Torso",
		6: "Torso | Main Body | Torso | Torso",
		7: "Torso | Main Body | Torso | Torso",
		8: "Torso | Main Body | Torso | Torso",
		9: "Left Arm | Arm 1 | Left Front Leg | Left Wing (as Leg)",
		10: "Left Arm | Arm 1 | Left Front Leg | Left Wing (as Leg)",
		11: "Left Arm | Arm 1 | Left Front Leg | Left Wing (as Leg)",
		12: "Right Arm | Arm 2 | Right Front Leg | Right Wing (as Leg)",
		13: "Right Arm | Arm 2 | Right Front Leg | Right Wing (as Leg)",
		14: "Right Arm | Arm 2 | Right Front Leg | Right Wing (as Leg)",
		15: "Left Leg | Arm 3 | Left Hind Leg | Legs",
		16: "Left Leg | Arm 3 | Left Hind Leg | Legs",
		17: "Left Leg | Arm 3 | Left Hind Leg | Legs",
		18: "Right Leg | Thruster | Right Hind Leg | Legs",
		19: "Right Leg | Thruster | Right Hind Leg | Legs",
		20: "Right Leg | Thruster | Right Hind Leg | Legs",
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
			1: "Op",
			2: "Op",
			3: "MB",
			4: "MB",
			5: "MB",
			6: "MB",
			7: "MB",
			8: "MB",
			9: "A1",
			10: "A1",
			11: "A1",
			12: "A2",
			13: "A2",
			14: "A2",
			15: "A3",
			16: "A3",
			17: "A3",
			18: "Th",
			19: "Th",
			20: "Th",
		}[result.result];
	}

	static values = {
		1: "H",
		2: "H",
		3: "T",
		4: "T",
		5: "T",
		6: "T",
		7: "T",
		8: "T",
		9: "LA",
		10: "LA",
		11: "LA",
		12: "RA",
		13: "RA",
		14: "RA",
		15: "LL",
		16: "LL",
		17: "LL",
		18: "RL",
		19: "RL",
		20: "RL",
	};
}

