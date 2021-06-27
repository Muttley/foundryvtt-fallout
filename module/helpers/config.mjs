export const FALLOUT = {};

// Define constants here, such as:
/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
FALLOUT.attributes = {
  "str": "FALLOUT.AbilityStr",
  "per": "FALLOUT.AbilityPer",
  "end": "FALLOUT.AbilityEnd",
  "cha": "FALLOUT.AbilityCha",
  "int": "FALLOUT.AbilityInt",
  "agi": "FALLOUT.AbilityAgi",
  "luc": "FALLOUT.AbilityLuc"
};

FALLOUT.abilityAbbreviations = {
  "str": "FALLOUT.AbilityStrAbbr",
  "per": "FALLOUT.AbilityPerAbbr",
  "end": "FALLOUT.AbilityEndAbbr",
  "cha": "FALLOUT.AbilityChaAbbr",
  "int": "FALLOUT.AbilityIntAbbr",
  "agi": "FALLOUT.AbilityAgiAbbr",
  "luc": "FALLOUT.AbilityLucAbbr"
};

FALLOUT.SKILLS = ["Athletics", "Barter", "Big Guns", "Energy Weapons", "Explosives", "Lockpick", "Medicine", "Melee Weapons", "Pilot", "Repair", "Science", "Small Guns", "Sneak", "Speech", "Survival", "Throwing", "Unarmed"];

FALLOUT.APPAREL_TYPE = {
  "clothing": "FALLOUT.APPAREL.clothing",
  "outfit": "FALLOUT.APPAREL.outfit",
  "armor": "FALLOUT.APPAREL.armor",
  "headgear": "FALLOUT.APPAREL.headgear",
  "powerArmor": "FALLOUT.APPAREL.powerArmor"
}

FALLOUT.BodyValues = {
  "head": "1-2",
  "torso": "3-8",
  "armL": "9-11",
  "armR": "12-14",
  "legL": "15-17",
  "legR": "18-20",
}


FALLOUT.powerLevel = {
  "normal": "normal",
  "mighty": "mighty",
  "legendary": "legendary"
}

FALLOUT.resistanceIcons = {
  'physical': 'fas fa-fist-raised',
  'energy': 'fas fa-bolt',
  'radiation': 'fas fa-radiation',
  'poison': 'fas fa-biohazard',
}

FALLOUT.WEAPONS = {
  "weaponTypes": {
    "bigGuns": "FALLOUT.WEAPONS.bigGuns",
    "energyWeapons": "FALLOUT.WEAPONS.energyWeapons",
    "explosives": "FALLOUT.WEAPONS.explosives",
    "meleeWeapons": "FALLOUT.WEAPONS.meleeWeapons",
    "smallWeapons": "FALLOUT.WEAPONS.smallGuns",
    "throwing": "FALLOUT.WEAPONS.throwing",
    "unarmed": "FALLOUT.WEAPONS.unarmed",
    "cratureAttack": "FALLOUT.WEAPONS.creatureAttack"
  },
  "damageType": {
    'physical': 'FALLOUT.WEAPONS.damageType.physical',
    'energy': 'FALLOUT.WEAPONS.damageType.energy',
    'radiation': 'FALLOUT.WEAPONS.damageType.radiation',
    'poison': 'FALLOUT.WEAPONS.damageType.poison',
  },
  "range": {
    "close": "FALLOUT.WEAPONS.RANGE.close",
    "medium": "FALLOUT.WEAPONS.RANGE.medium",
    "long": "FALLOUT.WEAPONS.RANGE.long",
    "extreme": "FALLOUT.WEAPONS.RANGE.extreme"
  }
}



