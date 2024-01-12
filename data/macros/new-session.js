/**
 ***************************************************************
 * This macro can be used to perform the following housekeeping
 * tasks at the start of a game:
 *
 *    - Reset every player characters' Alcoholic drink / Chem
 *      dose counters to zero.
 *
 *    - Resets the player's shared AP pool to zero.
 *
 *    - Resets the GM's AP pool to the number of players.
 *
 * NOTE: Only users with the Game Master user role can run this
 * macro.
 **************************************************************/

fallout.macros.newSession();
