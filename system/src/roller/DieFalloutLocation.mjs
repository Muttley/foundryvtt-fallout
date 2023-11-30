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
