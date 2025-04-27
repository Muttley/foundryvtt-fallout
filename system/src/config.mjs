export const SYSTEM_ID = "fallout";
export const SYSTEM_NAME = "Fallout RPG";

export const FALLOUT = {};

FALLOUT.LEVEL_UP_TOOL_ENABLED = false;

// Some consts used for timing purposes
//
FALLOUT.ONE_HOUR_IN_SECONDS = 60 * 60;
FALLOUT.TWO_HOURS_IN_SECONDS = 60 * 60 * 2;
FALLOUT.FOUR_HOURS_IN_SECONDS = 60 * 60 * 4;
FALLOUT.EIGHT_HOURS_IN_SECONDS = 60 * 60 * 8;
FALLOUT.SIXTEEN_HOURS_IN_SECONDS = 60 * 60 * 16;
FALLOUT.ONE_DAY_IN_SECONDS = 60 * 60 * 24;

FALLOUT.DEFAULT_ATTRIBUTES_TOTAL = 40;
FALLOUT.DEFAULT_COMPREHENSION_DICE = 1;
FALLOUT.DEFAULT_CONSUMABLE_RAD_DICE = 1;
FALLOUT.DEFAULT_JUNK_SALVAGE_MINS = 10;
FALLOUT.DEFAULT_MAX_MAGAZINE_USES = 2;

FALLOUT.APPAREL_MOD_TYPES = {
	lining: "FALLOUT.APPAREL_MOD.type.lining",
	material: "FALLOUT.APPAREL_MOD.type.material",
	plating: "FALLOUT.APPAREL_MOD.type.plating",
	system: "FALLOUT.APPAREL_MOD.type.system",
	upgrade: "FALLOUT.APPAREL_MOD.type.upgrade",
};

FALLOUT.APPAREL_TYPES = {
	armor: "FALLOUT.APPAREL.armor",
	clothing: "FALLOUT.APPAREL.clothing",
	headgear: "FALLOUT.APPAREL.headgear",
	outfit: "FALLOUT.APPAREL.outfit",
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

FALLOUT.CREATURE_CATEGORIES = {
	minion: "FALLOUT.NPC_TYPES.minion",
	normal: "FALLOUT.NPC_TYPES.normal",
	mighty: "FALLOUT.NPC_TYPES.mighty",
	legendary: "FALLOUT.NPC_TYPES.legendary",
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
	piercing_x: "FALLOUT.WEAPONS.damageEffect.piercing_x",
	radioactive: "FALLOUT.WEAPONS.damageEffect.radioactive",
	spread: "FALLOUT.WEAPONS.damageEffect.spread",
	stun: "FALLOUT.WEAPONS.damageEffect.stun",
	tranquilize_x: "FALLOUT.WEAPONS.damageEffect.tranquilize_x",
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
	origin: "systems/fallout/assets/icons/items/origin.svg",
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
	scavenging_location: "systems/fallout/assets/tokens/scavenging_location.webp",
	settlement: "systems/fallout/assets/tokens/settlement.webp",
	vehicle: "systems/fallout/assets/tokens/vehicle.webp",
};

FALLOUT.HIT_LOCATIONS = {
	flyingInsect: [
		{
			min: 1,
			max: 2,
			name: "FALLOUT.HitLocation.Head",
			pos: "",
		},
		{
			min: 3,
			max: 8,
			name: "FALLOUT.HitLocation.Torso",
			pos: "",
		},
		{
			min: 9,
			max: 11,
			name: "FALLOUT.HitLocation.LeftWing",
			pos: "",
		},
		{
			min: 12,
			max: 14,
			name: "FALLOUT.HitLocation.RightWing",
			pos: "",
		},
		{
			min: 15,
			max: 20,
			name: "FALLOUT.HitLocation.Legs",
			pos: "",
		},
	],
	humanoid: [
		{
			min: 1,
			max: 2,
			name: "FALLOUT.HitLocation.Head",
			pos: "left: 50px; top: 30px;",
		},
		{
			min: 3,
			max: 8,
			name: "FALLOUT.HitLocation.Torso",
			pos: "left: 170px; top: 110px;",
		},
		{
			min: 9,
			max: 11,
			name: "FALLOUT.HitLocation.LeftArm",
			pos: "left: 10px; top: 190px;",
		},
		{
			min: 12,
			max: 14,
			name: "FALLOUT.HitLocation.RightArm",
			pos: "right: 10px; top: 190px;",
		},
		{
			min: 15,
			max: 17,
			name: "FALLOUT.HitLocation.LeftLeg",
			pos: "left: 10px; top: 300px;",
		},
		{
			min: 18,
			max: 20,
			name: "FALLOUT.HitLocation.RightLeg",
			pos: "right: 10px; top: 300px;",
		},
	],
	mr_handy: [
		{
			min: 1,
			max: 2,
			name: "FALLOUT.HitLocation.Optics",
			pos: "left: 50px; top: 30px;",
		},
		{
			min: 3,
			max: 8,
			name: "FALLOUT.HitLocation.MainBody",
			pos: "left: 170px; top: 110px;",
		},
		{
			min: 9,
			max: 11,
			name: "FALLOUT.HitLocation.Arm1",
			pos: "left: 10px; top: 190px;",
		},
		{
			min: 12,
			max: 14,
			name: "FALLOUT.HitLocation.Arm2",
			pos: "left: 140px; top: 210px;",
		},
		{
			min: 15,
			max: 17,
			name: "FALLOUT.HitLocation.Arm3",
			pos: "right: 10px; top: 190px;",
		},
		{
			min: 18,
			max: 20,
			name: "FALLOUT.HitLocation.Thruster",
			pos: "left: 140px; top: 300px;",
		},
	],
	quadruped: [
		{
			min: 1,
			max: 2,
			name: "FALLOUT.HitLocation.Head",
			pos: "",
		},
		{
			min: 3,
			max: 8,
			name: "FALLOUT.HitLocation.Torso",
			pos: "",
		},
		{
			min: 9,
			max: 11,
			name: "FALLOUT.HitLocation.LeftFrontLeg",
			pos: "",
		},
		{
			min: 12,
			max: 14,
			name: "FALLOUT.HitLocation.RightFrontLeg",
			pos: "",
		},
		{
			min: 15,
			max: 17,
			name: "FALLOUT.HitLocation.LeftHindLeg",
			pos: "",
		},
		{
			min: 18,
			max: 20,
			name: "FALLOUT.HitLocation.RightHindLeg",
			pos: "",
		},
	],
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
	releaseNotes: "Compendium.fallout.system_documentation.JournalEntry.7650UDxM6aehgB21",
};

FALLOUT.ITEM_UUIDS = {
	junk: "Compendium.fallout.miscellany.Item.O9gGqJE0CfsOYccB",
	prewar_money: "Compendium.fallout.miscellany.Item.opho9zlvwqcLUPcK",
};

FALLOUT.SCAVENGING_LOCATION_DATA = {
	agriculture: {
		ammunition: 0,
		armor: 0,
		beverages: 1,
		chems: 0,
		clothing: 0,
		food: 3,
		junk: 1,
		other: 1,
		weapons: 0,
	},
	commercial: {
		ammunition: 0,
		armor: 0,
		beverages: 1,
		chems: 0,
		clothing: 0,
		food: 1,
		junk: 2,
		other: 2,
		weapons: 0,
	},
	industry: {
		ammunition: 0,
		armor: 1,
		beverages: 1,
		chems: 0,
		clothing: 1,
		food: 0,
		junk: 2,
		other: 1,
		weapons: 0,
	},
	medical: {
		ammunition: 0,
		armor: 0,
		beverages: 0,
		chems: 2,
		clothing: 1,
		food: 0,
		junk: 2,
		other: 1,
		weapons: 0,
	},
	military: {
		ammunition: 1,
		armor: 1,
		beverages: 0,
		chems: 0,
		clothing: 1,
		food: 0,
		junk: 0,
		other: 2,
		weapons: 1,
	},
	residential: {
		ammunition: 0,
		armor: 0,
		beverages: 1,
		chems: 0,
		clothing: 1,
		food: 1,
		junk: 2,
		other: 1,
		weapons: 0,
	},
};

FALLOUT.LOCATION_CATEGORY = {
	agriculture: "FALLOUT.LOCATION_CATEGORY.agriculture",
	commercial: "FALLOUT.LOCATION_CATEGORY.commercial",
	industry: "FALLOUT.LOCATION_CATEGORY.industry",
	medical: "FALLOUT.LOCATION_CATEGORY.medical",
	military: "FALLOUT.LOCATION_CATEGORY.military",
	residential: "FALLOUT.LOCATION_CATEGORY.residential",
};

FALLOUT.LOCATION_SCALE = {
	tiny: "FALLOUT.LOCATION_SCALE.tiny",
	small: "FALLOUT.LOCATION_SCALE.small",
	average: "FALLOUT.LOCATION_SCALE.average",
	large: "FALLOUT.LOCATION_SCALE.large",
};

FALLOUT.LOCATION_TIME_TAKEN = {
	tiny: "FALLOUT.LOCATION_TIME_TAKEN.tiny",
	small: "FALLOUT.LOCATION_TIME_TAKEN.small",
	average: "FALLOUT.LOCATION_TIME_TAKEN.average",
	large: "FALLOUT.LOCATION_TIME_TAKEN.large",
};

FALLOUT.LOCATION_SCALE_MULTIPLIER = {
	tiny: 1,
	small: 2,
	average: 3,
	large: 4,
};

FALLOUT.NPC_CATEGORIES = {
	minion: "FALLOUT.NPC_TYPES.minion",
	normal: "FALLOUT.NPC_TYPES.normal",
	notable: "FALLOUT.NPC_TYPES.notable",
	major: "FALLOUT.NPC_TYPES.major",
};

FALLOUT.OFFICIAL_SOURCES = {
	aat_fully_operational: "FALLOUT.SOURCE_TITLE.aat_fully_operational",
	aat_hunted: "FALLOUT.SOURCE_TITLE.aat_hunted",
	aat_into_the_abyss: "FALLOUT.SOURCE_TITLE.aat_into_the_abyss",
	aat_one_to_four: "FALLOUT.SOURCE_TITLE.aat_one_to_four",
	aat_orange_sky: "FALLOUT.SOURCE_TITLE.aat_orange_sky",
	aat_skull_canyon: "FALLOUT.SOURCE_TITLE.aat_skull_canyon",
	core_rulebook: "FALLOUT.SOURCE_TITLE.core_rulebook",
	enclave_remnants: "FALLOUT.SOURCE_TITLE.enclave_remnants",
	gm_toolkit: "FALLOUT.SOURCE_TITLE.gm_toolkit",
	hollywood_heroes: "FALLOUT.SOURCE_TITLE.hollywood_heroes",
	map_pack_vault: "FALLOUT.SOURCE_TITLE.map_pack_vault",
	map_pack_wasteland_locales: "FALLOUT.SOURCE_TITLE.map_pack_wasteland_locales",
	quickstart: "FALLOUT.SOURCE_TITLE.quickstart",
	reillys_rangers: "FALLOUT.SOURCE_TITLE.reillys_rangers",
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
	armor: "FALLOUT.APPAREL.armor",
	plating: "FALLOUT.APPAREL.plating",
};

FALLOUT.ROBOT_BODY_TYPES = {
	humanoid: "",
	mr_handy: "",
	robobrain: "",
	securitron: "",
};

FALLOUT.SCAVENGING_ITEM_TYPES = {
	ammunition: "FALLOUT.SCAVENGING_ITEM_TYPE.ammunition",
	armor: "FALLOUT.SCAVENGING_ITEM_TYPE.armor",
	beverages: "FALLOUT.SCAVENGING_ITEM_TYPE.beverages",
	chems: "FALLOUT.SCAVENGING_ITEM_TYPE.chems",
	clothing: "FALLOUT.SCAVENGING_ITEM_TYPE.clothing",
	food: "FALLOUT.SCAVENGING_ITEM_TYPE.food",
	junk: "FALLOUT.SCAVENGING_ITEM_TYPE.junk",
	other: "FALLOUT.SCAVENGING_ITEM_TYPE.other",
	weapons: "FALLOUT.SCAVENGING_ITEM_TYPE.weapons",
};

FALLOUT.SEARCHED_DEGREE = {
	untouched: "FALLOUT.SEARCHED_DEGREE.untouched",
	partly_searched: "FALLOUT.SEARCHED_DEGREE.partly_searched",
	mostly_searched: "FALLOUT.SEARCHED_DEGREE.mostly_searched",
	heavily_searched: "FALLOUT.SEARCHED_DEGREE.heavily_searched",
};

FALLOUT.SEARCHED_DEGREE_REDUCTION = {
	untouched: 2,
	partly_searched: 3,
	mostly_searched: 4,
	heavily_searched: 5,
};

FALLOUT.SEARCHED_DEGREE_DIFFICULTY = {
	untouched: 0,
	partly_searched: 1,
	mostly_searched: 2,
	heavily_searched: 3,
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

FALLOUT.statusEffects = [
	{
		id: "bleeding",
		img: "systems/fallout/assets/icons/conditions/bleeding.svg",
		name: "FALLOUT.EFFECT.StatusBleeding",
	},
	{
		id: "blind",
		img: "systems/fallout/assets/icons/conditions/blind.svg",
		name: "FALLOUT.EFFECT.StatusBlind",
	},
	{
		id: "burning",
		img: "systems/fallout/assets/icons/conditions/burning.svg",
		name: "FALLOUT.EFFECT.StatusBurning",
	},
	{
		id: "dead",
		img: "systems/fallout/assets/icons/conditions/dead.svg",
		name: "FALLOUT.EFFECT.StatusDead",
	},
	{
		id: "deaf",
		img: "systems/fallout/assets/icons/conditions/deaf.svg",
		name: "FALLOUT.EFFECT.StatusDeaf",
	},
	{
		id: "diseased",
		img: "systems/fallout/assets/icons/conditions/diseased.svg",
		name: "FALLOUT.EFFECT.StatusDiseased",
	},
	{
		id: "drugged",
		img: "systems/fallout/assets/icons/conditions/drugged.svg",
		name: "FALLOUT.EFFECT.StatusDrugged",
	},
	{
		id: "injured",
		img: "systems/fallout/assets/icons/conditions/injured.svg",
		name: "FALLOUT.EFFECT.StatusInjured",
	},
	{
		id: "poisoned",
		img: "systems/fallout/assets/icons/conditions/poisoned.svg",
		name: "FALLOUT.EFFECT.StatusPoisoned",
	},
	{
		id: "prone",
		img: "systems/fallout/assets/icons/conditions/prone.svg",
		name: "FALLOUT.EFFECT.StatusProne",
	},
	{
		id: "radiation",
		img: "systems/fallout/assets/icons/conditions/radiation.svg",
		name: "FALLOUT.EFFECT.StatusRadiation",
	},
	{
		id: "restrained",
		img: "systems/fallout/assets/icons/conditions/restrained.svg",
		name: "FALLOUT.EFFECT.StatusRestrained",
	},
	{
		id: "stunned",
		img: "systems/fallout/assets/icons/conditions/stunned.svg",
		name: "FALLOUT.EFFECT.StatusStunned",
	},
	{
		id: "unconscious",
		img: "systems/fallout/assets/icons/conditions/unconscious.svg",
		name: "FALLOUT.EFFECT.StatusUnconscious",
	},
];

FALLOUT.THIRST_BY_NUMBER = {
	0: "FALLOUT.TEMPLATES.conditions.quenched",
	1: "FALLOUT.TEMPLATES.conditions.hydrated",
	2: "FALLOUT.TEMPLATES.conditions.thirsty",
	3: "FALLOUT.TEMPLATES.conditions.dehydrated",
};

FALLOUT.VEHICLE_QUALITIES = {
	cargo_x: "FALLOUT.VEHICLE.vehicleQuality.cargo_x",
	cumbersome: "FALLOUT.VEHICLE.vehicleQuality.cumbersome",
	enclosed: "FALLOUT.VEHICLE.vehicleQuality.enclosed",
	exposed: "FALLOUT.VEHICLE.vehicleQuality.exposed",
	high_performance: "FALLOUT.VEHICLE.vehicleQuality.high_performance",
	rugged: "FALLOUT.VEHICLE.vehicleQuality.rugged",
	single_seat: "FALLOUT.VEHICLE.vehicleQuality.single_seat",
	flying: "FALLOUT.VEHICLE.vehicleQuality.flying",
	watercraft: "FALLOUT.VEHICLE.vehicleQuality.watercraft",
};

FALLOUT.VEHICLE_ATTRIBUTES = {
	zone_speed: "FALLOUT.VEHICLE.zone_speed",
	travel_speed: "FALLOUT.VEHICLE.travel_speed",
	scale: "FALLOUT.VEHICLE.scale",
	cover: "FALLOUT.VEHICLE.cover",
	impact: "FALLOUT.VEHICLE.impact",
	passengers: "FALLOUT.VEHICLE.passengers",
};

FALLOUT.VEHICLE_CATEGORIES = {
	apc: "FALLOUT.VEHICLE_TYPES.apc",
	armored: "FALLOUT.VEHICLE_TYPES.armored",
	bus: "FALLOUT.VEHICLE_TYPES.bus",
	carTruck: "FALLOUT.VEHICLE_TYPES.carTruck",
	motorcycle: "FALLOUT.VEHICLE_TYPES.motorcycle",
	sportsCar: "FALLOUT.VEHICLE_TYPES.sportsCar",
	vertibird: "FALLOUT.VEHICLE_TYPES.vertibird",
};

FALLOUT.VEHICLE_CARTRUCK_VALUES = {
	chassis: "1-8",
	wheelFL: "9-10",
	wheelFR: "11-12",
	engine: "13-16",
	wheelRL: "17-18",
	wheelRR: "19-20",
};

FALLOUT.VEHICLE_MOTORCYCLE_VALUES = {
	chassis: "1-7",
	wheelF: "8-11",
	engine: "12-16",
	wheelR: "17-20",
};

FALLOUT.VEHICLE_SPORTSCAR_VALUES = {
	chassis: "1-7",
	wheelFL: "8-9",
	wheelFR: "10-11",
	engine: "12-16",
	wheelRL: "17-18",
	wheelRR: "19-20",
};

FALLOUT.VEHICLE_BUS_VALUES = {
	chassis: "1-8",
	wheelFL: "9-10",
	wheelFR: "11-12",
	engine: "13-16",
	wheelRL1: "17",
	wheelRR1: "18",
	wheelRL2: "19",
	wheelRR2: "20",
};

FALLOUT.VEHICLE_ARMORED_VALUES = {
	chassis: "1-8",
	wheelFL: "9-10",
	wheelFR: "11-12",
	engine: "13-16",
	wheelRL: "17-18",
	wheelRR: "19-20",
};

FALLOUT.VEHICLE_APC_VALUES = {
	chassis: "1-10",
	wheelFL: "11",
	wheelFR: "12",
	engine: "13-16",
	wheelML: "17",
	wheelMR: "18",
	wheelRL: "19",
	wheelRR: "20",
};

FALLOUT.VEHICLE_VERTIBIRD_VALUES = {
	engineL: "1-2",
	engineR: "3-4",
	chassis: "5-10",
	wingL: "11-13",
	wingR: "14-16",
	weaponNG: "17-18",
	weaponDG: "19-20",
};

FALLOUT.WEAPON_QUALITIES = {
	accurate: "FALLOUT.WEAPONS.weaponQuality.accurate",
	ammo_hungry_x: "FALLOUT.WEAPONS.weaponQuality.ammo_hungry_x",
	aquatic: "FALLOUT.WEAPONS.weaponQuality.aquatic",
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
	placed: "FALLOUT.WEAPONS.weaponQuality.placed",
	recoil_x: "FALLOUT.WEAPONS.weaponQuality.recoil_x",
	recon: "FALLOUT.WEAPONS.weaponQuality.recon",
	reliable: "FALLOUT.WEAPONS.weaponQuality.reliable",
	slow_load: "FALLOUT.WEAPONS.weaponQuality.slow_load",
	suppressed: "FALLOUT.WEAPONS.weaponQuality.suppressed",
	surge: "FALLOUT.WEAPONS.weaponQuality.surge",
	thrown: "FALLOUT.WEAPONS.weaponQuality.thrown",
	two_handed: "FALLOUT.WEAPONS.weaponQuality.two_handed",
	unreliable: "FALLOUT.WEAPONS.weaponQuality.unreliable",
	unstable_radiation: "FALLOUT.WEAPONS.weaponQuality.unstable_radiation",
	wrangle: "FALLOUT.WEAPONS.weaponQuality.wrangle",
};

FALLOUT.WEAPON_ATTRIBUTE_OVERRIDE = {
	bows: "agi",
};

FALLOUT.WEAPON_SKILLS = {
	bigGuns: "Big Guns",
	bows: "Athletics",
	energyWeapons: "Energy Weapons",
	explosives: "Explosives",
	meleeWeapons: "Melee Weapons",
	smallGuns: "Small Guns",
	throwing: "Throwing",
	unarmed: "Unarmed",
};

FALLOUT.DEFAULT_CREATURE_WEAPON_ATTRIBUTE = {
	bigGuns: "body",
	bows: "body",
	energyWeapons: "body",
	explosives: "body",
	meleeWeapons: "body",
	smallGuns: "body",
	throwing: "body",
	unarmed: "body",
};

FALLOUT.DEFAULT_CREATURE_WEAPON_SKILL = {
	bigGuns: "guns",
	bows: "guns",
	energyWeapons: "guns",
	explosives: "melee",
	meleeWeapons: "melee",
	smallGuns: "guns",
	throwing: "guns",
	unarmed: "melee",
};

FALLOUT.WEAPON_TYPES = {
	bigGuns: "FALLOUT.WEAPONS.weaponType.bigGuns",
	bows: "FALLOUT.WEAPONS.weaponType.bows",
	custom: "FALLOUT.WEAPONS.weaponType.custom",
	energyWeapons: "FALLOUT.WEAPONS.weaponType.energyWeapons",
	explosives: "FALLOUT.WEAPONS.weaponType.explosives",
	meleeWeapons: "FALLOUT.WEAPONS.weaponType.meleeWeapons",
	smallGuns: "FALLOUT.WEAPONS.weaponType.smallGuns",
	throwing: "FALLOUT.WEAPONS.weaponType.throwing",
	unarmed: "FALLOUT.WEAPONS.weaponType.unarmed",
};

FALLOUT.WEAPON_MOD_TYPES = {
	barrel:	"FALLOUT.WEAPON_MOD.type.barrel",
	capacitor:	"FALLOUT.WEAPON_MOD.type.capacitor",
	concentrate:	"FALLOUT.WEAPON_MOD.type.concentrate",
	container:	"FALLOUT.WEAPON_MOD.type.container",
	dish:	"FALLOUT.WEAPON_MOD.type.dish",
	fuel:	"FALLOUT.WEAPON_MOD.type.fuel",
	grip:	"FALLOUT.WEAPON_MOD.type.grip",
	magazine:	"FALLOUT.WEAPON_MOD.type.magazine",
	melee:	"FALLOUT.WEAPON_MOD.type.melee",
	muzzle:	"FALLOUT.WEAPON_MOD.type.muzzle",
	nozzle:	"FALLOUT.WEAPON_MOD.type.nozzle",
	propellantTank: "FALLOUT.WEAPON_MOD.type.propellantTank",
	receiver:	"FALLOUT.WEAPON_MOD.type.receiver",
	sight:	"FALLOUT.WEAPON_MOD.type.sight",
	stock:	"FALLOUT.WEAPON_MOD.type.stock",
};


export async function discoverAvailableAmmoTypes() {
	const ammo = await fallout.compendiums.ammo();

	CONFIG.FALLOUT.AMMO_BY_UUID = {};
	let ammoTypes = [];
	for (const ammoType of ammo) {
		ammoTypes.push(ammoType.name);
		CONFIG.FALLOUT.AMMO_BY_UUID[ammoType.uuid] = ammoType.name;
	}
	ammoTypes = [...new Set(ammoTypes)]; // de-dupe

	CONFIG.FALLOUT.AMMO_TYPES = ammoTypes.sort((a, b) => a.localeCompare(b));
}

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

	CONFIG.FALLOUT.VEHICLE_QUALITY_TOOLTIPS = {};
	CONFIG.FALLOUT.VEHICLE_QUALITY_HAS_RANK = {};
	for (const key in CONFIG.FALLOUT.VEHICLE_QUALITIES) {
		CONFIG.FALLOUT.VEHICLE_QUALITY_TOOLTIPS[key] = await TextEditor.enrichHTML(
			game.i18n.localize(
				`FALLOUT.TOOLTIPS.VehicleQuality.${key}`
			)
		);
		CONFIG.FALLOUT.VEHICLE_QUALITY_HAS_RANK[key] = key.endsWith("_x");
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
