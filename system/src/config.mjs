export const SYSTEM_ID = "fallout";
export const SYSTEM_NAME = "Fallout RPG";

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

FALLOUT.CONSUMABLE_USE_ICONS = {
	food: "fas fa-pizza-slice",
	beverage: "fas fa-mug-hot",
	chem: "fas fa-flask",
	other: "fas fa-pizza-slice",
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

FALLOUT.CREATURE_CATEGORIES = {
	normal: "FALLOUT.NPC_TYPES.normal",
	mighty: "FALLOUT.NPC_TYPES.mighty",
	legendary: "FALLOUT.NPC_TYPES.legendary",
};

FALLOUT.DAMAGE_EFFECTS = {
	arc: "FALLOUT.WEAPONS.damageEffect.arc",
	breaking: "FALLOUT.WEAPONS.damageEffect.breaking",
	burst: "FALLOUT.WEAPONS.damageEffect.burst",
	freeze: "FALLOUT.WEAPONS.damageEffect.freeze",
	persistent: "FALLOUT.WEAPONS.damageEffect.persistent",
	piercing_x: "FALLOUT.WEAPONS.damageEffect.piercing_x",
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

FALLOUT.DEFAULT_ICONS = {
	addiction: "systems/fallout/assets/icons/items/addiction.svg",
	ammo: "systems/fallout/assets/icons/items/ammo.svg",
	apparel: "systems/fallout/assets/icons/items/apparel.svg",
	apparel_mod: "systems/fallout/assets/icons/items/apparel_mod.svg",
	books_and_magz: "systems/fallout/assets/icons/items/books_and_magz.svg",
	consumable: "systems/fallout/assets/icons/items/consumable.svg",
	disease: "systems/fallout/assets/icons/items/disease.svg",
	miscellany: "systems/fallout/assets/icons/items/miscellany.svg",
	object_or_structure: "systems/fallout/assets/icons/items/object_or_structure.svg",
	perk: "systems/fallout/assets/icons/items/perk.svg",
	robot_armor: "systems/fallout/assets/icons/items/robot_armor.svg",
	robot_mod: "systems/fallout/assets/icons/items/robot_mod.svg",
	skill: "systems/fallout/assets/icons/items/skill.webp",
	special_ability: "systems/fallout/assets/icons/items/special_ability.svg",
	trait: "systems/fallout/assets/icons/items/trait.svg",
	weapon: "systems/fallout/assets/icons/items/weapon.svg",
	weapon_mod: "systems/fallout/assets/icons/items/weapon_mod.svg",
};

FALLOUT.DEFAULT_TOKENS = {
	character: "systems/fallout/assets/tokens/character.webp",
	creature: "systems/fallout/assets/tokens/creature.webp",
	npc: "systems/fallout/assets/tokens/npc.webp",
	robot: "systems/fallout/assets/tokens/robot.webp",
	settlement: "systems/fallout/assets/tokens/settlement.webp",
};

FALLOUT.HUNGER_BY_NUMBER = {
	0: "FALLOUT.TEMPLATES.conditions.full",
	1: "FALLOUT.TEMPLATES.conditions.sated",
	2: "FALLOUT.TEMPLATES.conditions.peckish",
	3: "FALLOUT.TEMPLATES.conditions.hungry",
	4: "FALLOUT.TEMPLATES.conditions.starving",
};

FALLOUT.ITEM_TYPES = {
	addiction: "TYPES.Item.addiction",
	ammo: "TYPES.Item.ammo",
	apparel_mod: "TYPES.Item.apparel_mod",
	apparel: "TYPES.Item.apparel",
	books_and_magz: "TYPES.Item.books_and_magz",
	consumable: "TYPES.Item.consumable",
	disease: "TYPES.Item.disease",
	miscellany: "TYPES.Item.miscellany",
	object_or_structure: "TYPES.Item.object_or_structure",
	perk: "TYPES.Item.perk",
	robot_armor: "TYPES.Item.robot_armor",
	robot_mod: "TYPES.Item.robot_mod",
	skill: "TYPES.Item.skill",
	special_ability: "TYPES.Item.special_ability",
	trait: "TYPES.Item.trait",
	weapon_mod: "TYPES.Item.weapon_mod",
	weapon: "TYPES.Item.weapon",
};

FALLOUT.JOURNAL_UUIDS = {
	releaseNotes: "Compendium.fallout.system-documentation.JournalEntry.7650UDxM6aehgB21",
};

FALLOUT.NPC_CATEGORIES = {
	normal: "FALLOUT.NPC_TYPES.normal",
	notable: "FALLOUT.NPC_TYPES.notable",
	major: "FALLOUT.NPC_TYPES.major",
};

FALLOUT.OFFICIAL_SOURCES = {
	core_rulebook: "FALLOUT.SOURCE_TITLE.core_rulebook",
	enclave_remnants: "FALLOUT.SOURCE_TITLE.enclave_remnants",
	rust_devils: "FALLOUT.SOURCE_TITLE.rust_devils",
	settlers_guide: "FALLOUT.SOURCE_TITLE.settlers_guide",
	wanderers_guide: "FALLOUT.SOURCE_TITLE.wanderers_guide",
	winter_of_atom: "FALLOUT.SOURCE_TITLE.winter_of_atom",
};

FALLOUT.RANGES = {
	close: "FALLOUT.RANGE.close",
	medium: "FALLOUT.RANGE.medium",
	long: "FALLOUT.RANGE.long",
	extreme: "FALLOUT.RANGE.extreme",
};

FALLOUT.RARITIES = {
	common: "FALLOUT.actor.inventory.materials.common",
	uncommon: "FALLOUT.actor.inventory.materials.uncommon",
	rare: "FALLOUT.actor.inventory.materials.rare",
};

FALLOUT.ROBOT_APPAREL_TYPE = {
	plating: "FALLOUT.APPAREL.plating",
	armor: "FALLOUT.APPAREL.armor",
};

FALLOUT.SETTLEMENT_ITEM_ICONS = {
	crafting_table: "fa-solid fa-screwdriver-wrench",
	defense: "fa-solid fa-shield-halved",
	power: "fa-solid fa-bolt",
	resource: "fa-solid fa-box",
	room: "fa-solid fa-door-open",
	store: "fa-solid fa-store",
	structure: "fa-solid fa-building",
};

FALLOUT.SETTLEMENT_ACTION_ICONS = {
	build: "fa-solid fa-screwdriver-wrench",
	business: "fa-solid fa-store",
	guard: "fa-solid fa-shield-halved",
	hunting_and_gathering: "fa-solid fa-person-rifle",
	scavenging: "fa-brands fa-searchengin",
	tend_crops: "fa-solid fa-seedling",
	trade_caravan: "fa-solid fa-caravan",
	unnasigned: "fa-regular fa-user",
};

FALLOUT.SETTLEMENT_ACTIONS = {
	build: "FALLOUT.SETTLEMENT_ACTION.Build",
	business: "FALLOUT.SETTLEMENT_ACTION.Business",
	guard: "FALLOUT.SETTLEMENT_ACTION.Guard",
	hunting_and_gathering: "FALLOUT.SETTLEMENT_ACTION.HuntingAndGathering",
	scavenging: "FALLOUT.SETTLEMENT_ACTION.Scavenging",
	tend_crops: "FALLOUT.SETTLEMENT_ACTION.TendCrops",
	trade_caravan: "FALLOUT.SETTLEMENT_ACTION.TradeCaravan",
	unnasigned: "FALLOUT.SETTLEMENT_ACTION.Unnasigned",
};

FALLOUT.SETTLEMENT_ITEMS = {
	crafting_table: "FALLOUT.SETTLEMENT_ITEM.CraftingTable",
	defense: "FALLOUT.SETTLEMENT_ITEM.Defense",
	power: "FALLOUT.SETTLEMENT_ITEM.Power",
	resource: "FALLOUT.SETTLEMENT_ITEM.Resource",
	room: "FALLOUT.SETTLEMENT_ITEM.Room",
	store: "FALLOUT.SETTLEMENT_ITEM.Store",
	structure: "FALLOUT.SETTLEMENT_ITEM.Structure",
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
	ammo_hungry_x: "FALLOUT.WEAPONS.weaponQuality.ammo_hungry_x",
	blast: "FALLOUT.WEAPONS.weaponQuality.blast",
	bombard: "FALLOUT.WEAPONS.weaponQuality.bombard",
	close_quarters: "FALLOUT.WEAPONS.weaponQuality.close_quarters",
	concealed: "FALLOUT.WEAPONS.weaponQuality.concealed",
	debilitating: "FALLOUT.WEAPONS.weaponQuality.debilitating",
	delay_x: "FALLOUT.WEAPONS.weaponQuality.delay_x",
	gatling: "FALLOUT.WEAPONS.weaponQuality.gatling",
	inaccurate: "FALLOUT.WEAPONS.weaponQuality.inaccurate",
	limited: "FALLOUT.WEAPONS.weaponQuality.limited",
	mine: "FALLOUT.WEAPONS.weaponQuality.mine",
	night_vision: "FALLOUT.WEAPONS.weaponQuality.night_vision",
	parry: "FALLOUT.WEAPONS.weaponQuality.parry",
	recon: "FALLOUT.WEAPONS.weaponQuality.recon",
	reliable: "FALLOUT.WEAPONS.weaponQuality.reliable",
	slow_load: "FALLOUT.WEAPONS.weaponQuality.slow_load",
	suppressed: "FALLOUT.WEAPONS.weaponQuality.suppressed",
	thrown: "FALLOUT.WEAPONS.weaponQuality.thrown",
	two_handed: "FALLOUT.WEAPONS.weaponQuality.two_handed",
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

export async function generateEnrichedTooltips() {
	CONFIG.FALLOUT.WEAPON_QUALITY_TOOLTIPS = {};
	CONFIG.FALLOUT.WEAPON_QUALITY_HAS_RANK = {};
	for (const key in CONFIG.FALLOUT.WEAPON_QUALITIES) {
		CONFIG.FALLOUT.WEAPON_QUALITY_TOOLTIPS[key] = await TextEditor.enrichHTML(
			game.i18n.localize(
				`FALLOUT.TOOLTIPS.WeaponQuality.${key}`
			)
		);
		CONFIG.FALLOUT.WEAPON_QUALITY_HAS_RANK[key] = key.endsWith("_x");
	}

	CONFIG.FALLOUT.DAMAGE_EFFECT_HAS_RANK = {};
	CONFIG.FALLOUT.DAMAGE_EFFECT_TOOLTIPS = [];
	for (const key in CONFIG.FALLOUT.DAMAGE_EFFECTS) {
		CONFIG.FALLOUT.DAMAGE_EFFECT_TOOLTIPS[key] = await TextEditor.enrichHTML(
			game.i18n.localize(
				`FALLOUT.TOOLTIPS.DamageEffect.${key}`
			)
		);
		CONFIG.FALLOUT.DAMAGE_EFFECT_HAS_RANK[key] = key.endsWith("_x");
	}
}
