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
			1: "Head_Optics_Head_Head",
			2: "Head_Optics_Head_Head",
			3: "Torso_MainBody_Torso_Torso",
			4: "Torso_MainBody_Torso_Torso",
			5: "Torso_MainBody_Torso_Torso",
			6: "Torso_MainBody_Torso_Torso",
			7: "Torso_MainBody_Torso_Torso",
			8: "Torso_MainBody_Torso_Torso",
			9: "LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
			10: "LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
			11: "LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
			12: "RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
			13: "RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
			14: "RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
			15: "LeftLeg_Arm3_LeftHindLeg_Legs",
			16: "LeftLeg_Arm3_LeftHindLeg_Legs",
			17: "LeftLeg_Arm3_LeftHindLeg_Legs",
			18: "RightLeg_Thruster_RightHindLeg_Legs",
			19: "RightLeg_Thruster_RightHindLeg_Legs",
			20: "RightLeg_Thruster_RightHindLeg_Legs",
		}[result.result];
	}

	static values = {
		1: "Head_Optics_Head_Head",
		2: "Head_Optics_Head_Head",
		3: "Torso_MainBody_Torso_Torso",
		4: "Torso_MainBody_Torso_Torso",
		5: "Torso_MainBody_Torso_Torso",
		6: "Torso_MainBody_Torso_Torso",
		7: "Torso_MainBody_Torso_Torso",
		8: "Torso_MainBody_Torso_Torso",
		9: "LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
		10: "LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
		11: "LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
		12: "RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
		13: "RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
		14: "RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
		15: "LeftLeg_Arm3_LeftHindLeg_Legs",
		16: "LeftLeg_Arm3_LeftHindLeg_Legs",
		17: "LeftLeg_Arm3_LeftHindLeg_Legs",
		18: "RightLeg_Thruster_RightHindLeg_Legs",
		19: "RightLeg_Thruster_RightHindLeg_Legs",
		20: "RightLeg_Thruster_RightHindLeg_Legs",
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

