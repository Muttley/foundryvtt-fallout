export const SYSTEM_ID = "fallout";
export const SYSTEM_NAME = "Fallout 2d20";

export const FALLOUT = {};

FALLOUT.APPAREL_TYPES = {
	clothing: "FALLOUT.APPAREL.clothing",
	outfit: "FALLOUT.APPAREL.outfit",
	armor: "FALLOUT.APPAREL.armor",
	headgear: "FALLOUT.APPAREL.headgear",
	powerArmor: "FALLOUT.APPAREL.powerArmor",
};

FALLOUT.ATTRIBUTES = {
	str: "FALLOUT.AbilityStr",
	per: "FALLOUT.AbilityPer",
	end: "FALLOUT.AbilityEnd",
	cha: "FALLOUT.AbilityCha",
	int: "FALLOUT.AbilityInt",
	agi: "FALLOUT.AbilityAgi",
	luc: "FALLOUT.AbilityLuc",
};

FALLOUT.BODY_LOCATION_LABELS = {
	Head_Optics_Head_Head: "FALLOUT.BODYLOCATION.labels.Head_Optics_Head_Head",
	LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg: "FALLOUT.BODYLOCATION.labels.LeftArm_Arm1_LeftFrontLeg_LeftWingAsLeg",
	LeftLeg_Arm3_LeftHindLeg_Legs: "FALLOUT.BODYLOCATION.labels.LeftLeg_Arm3_LeftHindLeg_Legs",
	RightArm_Arm2_RightFrontLeg_RightWingAsLeg: "FALLOUT.BODYLOCATION.labels.RightArm_Arm2_RightFrontLeg_RightWingAsLeg",
	RightLeg_Thruster_RightHindLeg_Legs: "FALLOUT.BODYLOCATION.labels.RightLeg_Thruster_RightHindLeg_Legs",
	Torso_MainBody_Torso_Torso: "FALLOUT.BODYLOCATION.labels.Torso_MainBody_Torso_Torso",
};

FALLOUT.BODY_TYPES = {
	humanoid: "FALLOUT.BodyTypes.humanoid.label",
	robot: "FALLOUT.BodyTypes.robot.label",
	quadruped: "FALLOUT.BodyTypes.quadruped.label",
	flyingInsect: "FALLOUT.BodyTypes.flyingInsect.label",
};

FALLOUT.BODY_VALUES = {
	head: "1-2",
	torso: "3-8",
	armL: "9-11",
	armR: "12-14",
	legL: "15-17",
	legR: "18-20",
};

FALLOUT.CHEM_DURATIONS = {
	instant: "FALLOUT.ChemDuration.instant",
	brief: "FALLOUT.ChemDuration.brief",
	lasting: "FALLOUT.ChemDuration.lasting",
};

FALLOUT.CONDITIONS = {
	hunger: {
		full: 0,
		sated: 1,
		peckish: 2,
		hungry: 3,
		starving: 4,
	},
	thirst: {
		quenched: 0,
		hydrated: 1,
		thirsty: 2,
		dehydrated: 3,
	},
	sleep: {
		rested: 0,
		tired: 1,
		weary: 2,
		exhausted: 3,
	},
};

FALLOUT.CONSUMABLE_TYPES = {
	food: "FALLOUT.FOOD",
	beverage: "FALLOUT.BEVERAGE",
	chem: "FALLOUT.CHEM",
	other: "FALLOUT.OTHER",
};

FALLOUT.CREATURE_ATTRIBUTES = {
	body: "FALLOUT.CREATURE.body",
	mind: "FALLOUT.CREATURE.mind",
};

FALLOUT.CREATURE_SKILLS = {
	melee: "FALLOUT.CREATURE.melee",
	guns: "FALLOUT.CREATURE.guns",
	other: "FALLOUT.CREATURE.other",
};

FALLOUT.DAMAGE_EFFECTS = {
	arc: "FALLOUT.WEAPONS.damageEffect.arc",
	breaking: "FALLOUT.WEAPONS.damageEffect.breaking",
	burst: "FALLOUT.WEAPONS.damageEffect.burst",
	freeze: "FALLOUT.WEAPONS.damageEffect.freeze",
	persistent: "FALLOUT.WEAPONS.damageEffect.persistent",
	piercing: "FALLOUT.WEAPONS.damageEffect.piercing",
	radioactive: "FALLOUT.WEAPONS.damageEffect.radioactive",
	spread: "FALLOUT.WEAPONS.damageEffect.spread",
	stun: "FALLOUT.WEAPONS.damageEffect.stun",
	vicious: "FALLOUT.WEAPONS.damageEffect.vicious",
};

FALLOUT.DAMAGE_TYPES = {
	physical: "FALLOUT.WEAPONS.damageType.physical",
	energy: "FALLOUT.WEAPONS.damageType.energy",
	radiation: "FALLOUT.WEAPONS.damageType.radiation",
	poison: "FALLOUT.WEAPONS.damageType.poison",
};

FALLOUT.HUNGER_BY_NUMBER = {
	0: "FALLOUT.TEMPLATES.conditions.full",
	1: "FALLOUT.TEMPLATES.conditions.sated",
	2: "FALLOUT.TEMPLATES.conditions.peckish",
	3: "FALLOUT.TEMPLATES.conditions.hungry",
	4: "FALLOUT.TEMPLATES.conditions.starving",
};

FALLOUT.JOURNAL_UUIDS = {
	releaseNotes: "Compendium.fallout.system-documentation.JournalEntry.7650UDxM6aehgB21",
};

FALLOUT.NPC_TYPES = {
	normal: "FALLOUT.NPC_TYPES.normal",
	mighty: "FALLOUT.NPC_TYPES.mighty",
	legendary: "FALLOUT.NPC_TYPES.legendary",
	notable: "FALLOUT.NPC_TYPES.notable",
	major: "FALLOUT.NPC_TYPES.major",
};

FALLOUT.OFFICIAL_SOURCES = {
	core_rulebook: "FALLOUT.SOURCE_TITLE.core_rulebook",
	quickstart: "FALLOUT.SOURCE_TITLE.quickstart",
	rust_devils: "FALLOUT.SOURCE_TITLE.rust_devils",
	settlers_guide: "FALLOUT.SOURCE_TITLE.settlers_guide",
	winter_of_atom: "FALLOUT.SOURCE_TITLE.winter_of_atom",
};

FALLOUT.RANGES = {
	close: "FALLOUT.RANGE.close",
	medium: "FALLOUT.RANGE.medium",
	long: "FALLOUT.RANGE.long",
	extreme: "FALLOUT.RANGE.extreme",
};

FALLOUT.ROBOT_APPAREL_TYPE = {
	plating: "FALLOUT.APPAREL.plating",
	armor: "FALLOUT.APPAREL.armor",
};

FALLOUT.SLEEP_BY_NUMBER = {
	0: "FALLOUT.TEMPLATES.conditions.rested",
	1: "FALLOUT.TEMPLATES.conditions.tired",
	2: "FALLOUT.TEMPLATES.conditions.weary",
	3: "FALLOUT.TEMPLATES.conditions.exhausted",
};

FALLOUT.THIRST_BY_NUMBER = {
	0: "FALLOUT.TEMPLATES.conditions.quenched",
	1: "FALLOUT.TEMPLATES.conditions.hydrated",
	2: "FALLOUT.TEMPLATES.conditions.thirsty",
	3: "FALLOUT.TEMPLATES.conditions.dehydrated",
};

FALLOUT.WEAPON_QUALITIES = {
	accurate: "FALLOUT.WEAPONS.weaponQuality.accurate",
	blast: "FALLOUT.WEAPONS.weaponQuality.blast",
	closeQuarters: "FALLOUT.WEAPONS.weaponQuality.closeQuarters",
	concealed: "FALLOUT.WEAPONS.weaponQuality.concealed",
	debilitating: "FALLOUT.WEAPONS.weaponQuality.debilitating",
	gatling: "FALLOUT.WEAPONS.weaponQuality.gatling",
	inaccurate: "FALLOUT.WEAPONS.weaponQuality.inaccurate",
	limited: "FALLOUT.WEAPONS.weaponQuality.limited",
	mine: "FALLOUT.WEAPONS.weaponQuality.mine",
	nightVision: "FALLOUT.WEAPONS.weaponQuality.nightVision",
	parry: "FALLOUT.WEAPONS.weaponQuality.parry",
	recon: "FALLOUT.WEAPONS.weaponQuality.recon",
	reliable: "FALLOUT.WEAPONS.weaponQuality.reliable",
	slow_load: "FALLOUT.WEAPONS.weaponQuality.slow_load",
	suppressed: "FALLOUT.WEAPONS.weaponQuality.suppressed",
	thrown: "FALLOUT.WEAPONS.weaponQuality.thrown",
	twoHanded: "FALLOUT.WEAPONS.weaponQuality.twoHanded",
	unreliable: "FALLOUT.WEAPONS.weaponQuality.unreliable",
	unstable_radiation: "FALLOUT.WEAPONS.weaponQuality.unstable_radiation",
};

FALLOUT.WEAPON_SKILLS = {
	bigGuns: "Big Guns",
	energyWeapons: "Energy Weapons",
	explosives: "Explosives",
	meleeWeapons: "Melee Weapons",
	smallGuns: "Small Guns",
	throwing: "Throwing",
	unarmed: "Unarmed",
	creatureAttack: "Melee",
};

FALLOUT.WEAPON_TYPES = {
	bigGuns: "FALLOUT.WEAPONS.weaponType.bigGuns",
	creatureAttack: "FALLOUT.WEAPONS.weaponType.creatureAttack",
	energyWeapons: "FALLOUT.WEAPONS.weaponType.energyWeapons",
	explosives: "FALLOUT.WEAPONS.weaponType.explosives",
	meleeWeapons: "FALLOUT.WEAPONS.weaponType.meleeWeapons",
	smallGuns: "FALLOUT.WEAPONS.weaponType.smallGuns",
	throwing: "FALLOUT.WEAPONS.weaponType.throwing",
	unarmed: "FALLOUT.WEAPONS.weaponType.unarmed",
};
