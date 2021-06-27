export const FALLOUT = {};

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
FALLOUT.CREATURE = {
  "skills": {
    "melee": "FALLOUT.CREATURE.melee",
    "guns": "FALLOUT.CREATURE.guns",
    "other": "FALLOUT.CREATURE.other"
  },
  "attributes": {
    "body": "FALLOUT.CREATURE.body",
    "mind": "FALLOUT.CREATURE.mind",
  }
}

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
  "weaponType": {
    "bigGuns": "FALLOUT.WEAPONS.weaponType.bigGuns",
    "energyWeapons": "FALLOUT.WEAPONS.weaponType.energyWeapons",
    "explosives": "FALLOUT.WEAPONS.weaponType.explosives",
    "meleeWeapons": "FALLOUT.WEAPONS.weaponType.meleeWeapons",
    "smallGuns": "FALLOUT.WEAPONS.weaponType.smallGuns",
    "throwing": "FALLOUT.WEAPONS.weaponType.throwing",
    "unarmed": "FALLOUT.WEAPONS.weaponType.unarmed",
    "creatureAttack": "FALLOUT.WEAPONS.weaponType.creatureAttack"
  },
  "weaponSkill": {
    "bigGuns": "Big Guns",
    "energyWeapons": "Energy Weapons",
    "explosives": "Explosives",
    "meleeWeapons": "Melee Weapons",
    "smallGuns": "Small Guns",
    "throwing": "Throwing",
    "unarmed": "Unarmed",
    "creatureAttack": "Melee"
  },
  "damageType": {
    'physical': 'FALLOUT.WEAPONS.damageType.physical',
    'energy': 'FALLOUT.WEAPONS.damageType.energy',
    'radiation': 'FALLOUT.WEAPONS.damageType.radiation',
    'poison': 'FALLOUT.WEAPONS.damageType.poison',
  },
  "range": {
    "close": "FALLOUT.RANGE.close",
    "medium": "FALLOUT.RANGE.medium",
    "long": "FALLOUT.RANGE.long",
    "extreme": "FALLOUT.RANGE.extreme"
  }
}



