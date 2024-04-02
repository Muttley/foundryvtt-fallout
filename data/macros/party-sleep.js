/**
 ***************************************************************
 * This macro can be used to launch the Party Sleep tool which
 * allows the GM to trigger sleep periods for all player
 * characters.
 *
 * This tool performs the following:
 *
 *    - Adjusts the current sleep/fatigue levels of all player
 *      characters depending on the amount of sleep chosen.
 *
 *    - Applies/Resets the Well Rested bonus if appropriate.
 *
 *    - If the "Conditions Skip Missing Players" system setting
 *      is checked, only characters which have a currently
 *      logged in owner are updated.
 *
 * NOTE: Only users with the Game Master user role can run this
 * macro.
 **************************************************************/

fallout.macros.partySleep();
