/**
 ***************************************************************
 * This macro can be used to perform the following housekeeping
 * tasks at the beginning of a new scene:
 *
 *    - Reset alcoholic characters' alcoholic drink counters to
 *      zero.
 *
 *    - If a character suffers from one or more addictions,
 *      processes the chem doses taken and removes them if
 *      they have expired
 *
 * NOTE: Only users with the Game Master user role can run this
 * macro.
 **************************************************************/

fallout.macros.newScene();
