/*  -INFORMATION-

    Subject:    OotD Herculean Path Barbarian — Minotaur Form Companion Tracker
    Effect:     Manages Bull and Dire Bull companion pages for Thylean Minotaur
                characters, matching the Cursed Transformation racial feature from
                the OotD Player's Guide.

                Level 5:  Bull Form companion page added automatically.
                          "Bull Form (Cursed Transformation)" added to Limited
                          Features as a 1/long rest tracker.
                Level 9:  Bull Form removed; Dire Bull Form companion added.
                          Limited feature updated to Dire Bull Form.
                          Relentless (1/day) noted in companion notes.

                Companion notes are written to Cnote.Left on the companion page
                and refreshed on every level-up, including the exact PHB stats
                for reference during play.

                The Herculean Path barbarian subclass features (Precocious Wrestler
                at level 3; Mighty Marksman + Thunderous Shot at level 6; Herculean
                Rage at level 10; Earthshaker at level 14) are defined by the base
                OotD script and appear in the Class Features column at the correct
                levels automatically. This script does not redefine those features.

                The Cursed One epic path and Blessing of the Gods feat are handled
                by OotD_EpicPaths.js and are not redefined here.

    To use:     Add the item "Cursed Transformation (Minotaur)" to the character's
                equipment list. Companion pages will appear and update automatically
                at levels 5 and 9 on the next HP recalculation (i.e., level-up).

    Requires:   OdysseyOfTheDragonlords_v13.js
                OotD_AmazonianFix.js (defines ClassList.paladin.artificerCompFunc)
    Sheet:      v13.2.0+
    Load order: After OdysseyOfTheDragonlords_v13.js and OotD_AmazonianFix.js.
                "H" sorts after "A" and "G" — no manual reordering needed.

    CHANGELOG v1.0.0:
    - Initial release.
    - Bull companion page added at level 5 with PHB stat block.
    - Dire Bull companion replaces Bull at level 9 with updated stat block.
    - Companion notes written to Cnote.Left; refreshed automatically on level-up.
    - Transformation tracked as a limited feature (1/long rest).
    - Alert dialogs notify the player when forms are first added or upgraded.
    - Idempotent: safe to reload at any level without duplicate companions.

*/

var iFileName = "OotD_HerculeanMino.js";
RequiredSheetVersion("13.2.0");

SourceList["OotD-MH"] = {
    name                  : "Odyssey of the Dragonlords: Herculean Minotaur Forms",
    abbreviation          : "OotD-MH",
    abbreviationSpellsheet : "OM",
    group                 : "Player Companions",
    url                   : "https://www.arcanumworlds.com/odyssey-of-the-dragonlords",
    date                  : "2019/09/01"
};

// ── CREATURE LIST ─────────────────────────────────────────────
// These entries define the companion page stat blocks for the
// Minotaur's two transformed forms.
//
// Attack bonus note: the OotD PHB lists Horns at +5 to hit
// (STR +4 + a +1 that does not match standard CR-based proficiency).
// MPMB calculates attack bonus from the ability modifier and the
// creature's CR-derived proficiency bonus. The calculated value may
// differ by 1 from the PHB. The companion notes written to Cnote.Left
// contain the exact PHB values for reference during play.
//
// HP note: Dire Bull is listed in the PHB as 46 (5d10+12). With CON 16
// (+3) and 5 dice, the formula would give +15 rather than +12. The PHB
// value is used as written; this may be a source errata.

CreatureList["bull (minotaur form)"] = {
    name              : "Bull (Minotaur Form)",
    source            : [["OotD-MH", 0]],
    size              : 4,            // Large
    type              : "Beast",
    alignment         : "unaligned",
    ac                : 11,
    hp                : 36,
    hd                : [4, 10],      // 4d10 + 12 (CON 16, +3 ×4)
    speed             : "40 ft",
    scores            : [18, 10, 16, 4, 10, 9],    // STR DEX CON INT WIS CHA (OotD PHB)
    // Passive Perception note: PHB states 14. With WIS 10 (+0) this cannot be reached
    // through standard 5e calculation without proficiency manipulation that would also
    // break the attack bonus. passivePerception: 14 populates the senses text field
    // correctly; the companion sheet's calculated PP field will show a lower value.
    // The correct PHB value is stated in the companion notes (Cnote.Left).
    passivePerception : 14,
    senses            : "Passive Perception 14 (PHB; see companion notes)",
    challengeRating   : "1",
    proficiencyBonus  : 1,            // PHB gives +5 to hit (STR +4 + 1); set here so MPMB
                                      // calculates +4 + 1 = +5 if proficiencyBonus is respected.
    attacksAction     : 1,
    attacks           : [{
        name        : "Horns",
        ability     : 1,              // STR
        damage      : [1, 8, "piercing"],
        range       : "Melee (5 ft)",
        description : "Charge: if moved 10+ ft straight toward target before hit, " +
                      "deal +1d6 piercing; target DC 11 STR save or knocked prone."
    }],
    traits            : [{
        name        : "Charge",
        description : "If the minotaur moved at least 10 ft straight toward a target " +
                      "immediately before hitting with a horns attack, the target takes " +
                      "an extra 1d6 piercing damage. If the target is a creature, it must " +
                      "succeed on a DC 11 Strength saving throw or be knocked prone."
    }, {
        name        : "Cursed Transformation",
        description : "Activated as a bonus action. Lasts until the character uses a " +
                      "bonus action to revert, or falls unconscious. Recharges on a long " +
                      "rest. Auto-triggers on prolonged exposure to bright reds (DM " +
                      "discretion). Upgrades to Dire Bull Form at character level 9."
    }]
};

CreatureList["dire bull (minotaur form)"] = {
    name              : "Dire Bull (Minotaur Form)",
    source            : [["OotD-MH", 0]],
    size              : 4,            // Large
    type              : "Beast",
    alignment         : "unaligned",
    ac                : 12,
    hp                : 46,
    hd                : [5, 10],      // 5d10 + 12 (per PHB; see HP note in header)
    speed             : "40 ft",
    scores            : [18, 10, 16, 4, 10, 9],    // STR DEX CON INT WIS CHA (OotD PHB)
    passivePerception : 14,
    senses            : "Passive Perception 14 (PHB; see companion notes)",
    challengeRating   : "2",
    proficiencyBonus  : 1,            // Same as Bull — PHB does not specify to-hit for Dire Bull,
                                      // but STR is identical (18, +4) so attack stays at +5.
    attacksAction     : 1,
    attacks           : [{
        name        : "Horns",
        ability     : 1,              // STR
        damage      : [2, 6, "piercing"],
        range       : "Melee (5 ft)",
        description : "Charge: if moved 10+ ft straight toward target before hit, " +
                      "deal +1d10 piercing; target DC 14 STR save or knocked prone."
    }],
    traits            : [{
        name        : "Charge",
        description : "If the minotaur moved at least 10 ft straight toward a target " +
                      "immediately before hitting with a horns attack, the target takes " +
                      "an extra 1d10 piercing damage. If the target is a creature, it must " +
                      "succeed on a DC 14 Strength saving throw or be knocked prone."
    }, {
        name        : "Relentless (1/Day)",
        description : "If the minotaur would be reduced to 0 hit points, it is reduced " +
                      "to 1 hit point instead."
    }, {
        name        : "Cursed Transformation",
        description : "Upgraded from Bull Form at character level 9. Activated as a bonus " +
                      "action. Lasts until the character uses a bonus action to revert, or " +
                      "falls unconscious. Recharges on a long rest. Auto-triggers on " +
                      "prolonged exposure to bright reds (DM discretion)."
    }]
};

// ── COMPANION MANAGEMENT ──────────────────────────────────────
// The companion functions defined by OotD_AmazonianFix.js live on
// ClassList.paladin.artificerCompFunc (and ClassList.artificer if
// TCoE is enabled). Those are MPMB globals, so they ARE accessible
// from this script.
//
// The var-declared helper ootdGetCompanionFunctions() in
// OotD_GiftedOneDragon.js is NOT accessible here — it is scoped to
// that file. The same lookup is replicated below under the ootdMH_
// prefix to avoid any name collision.

var ootdMH_getCompFunc = function() {
    if (typeof ClassList !== "undefined") {
        if (ClassList.artificer && ClassList.artificer.artificerCompFunc &&
            typeof ClassList.artificer.artificerCompFunc.add === "function") {
            return ClassList.artificer.artificerCompFunc;
        }
        if (ClassList.paladin && ClassList.paladin.artificerCompFunc &&
            typeof ClassList.paladin.artificerCompFunc.add === "function") {
            return ClassList.paladin.artificerCompFunc;
        }
    }
    console.println("OotD-MH Error: Companion functions not found. " +
                    "Ensure OotD_AmazonianFix.js is loaded before this script.");
    return null;
};

var ootdMH_compFind = function(name) {
    var compFunc = ootdMH_getCompFunc();
    if (!compFunc) return [];
    return compFunc.find(name);
};

var ootdMH_compRemove = function(name) {
    var compFunc = ootdMH_getCompFunc();
    if (!compFunc) return;
    compFunc.remove(name);
    console.println("OotD-MH: Removed companion: " + name);
};

var ootdMH_compAdd = function(name) {
    var compFunc = ootdMH_getCompFunc();
    if (!compFunc) return false;
    return compFunc.add(name);
};

// ── EXACT-MATCH FIND AND REMOVE ───────────────────────────────
// compFunc.find() and compFunc.remove() use .indexOf() (substring
// matching). "bull (minotaur form)" is a substring of "dire bull
// (minotaur form)", so searching for Bull incorrectly matches the
// Dire Bull companion. These functions use strict equality instead,
// preventing cascading removes when calcChanges["hp"] re-fires after
// a companion is added.

var ootdMH_findExact = function(name) {
    var prefixes = [];
    if (typeof isTemplVis !== "function" || typeof What !== "function") return prefixes;
    var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
    if (!AScompA) return prefixes;
    var nameLower = name.toLowerCase();
    for (var a = 1; a < AScompA.length; a++) {
        if (String(What(AScompA[a] + 'Comp.Race') || '').toLowerCase() === nameLower) {
            prefixes.push(AScompA[a]);
        }
    }
    return prefixes;
};

var ootdMH_removeExact = function(name) {
    if (typeof isTemplVis !== "function" || typeof DoTemplate !== "function" ||
        typeof What !== "function") return;
    var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
    if (!AScompA) return;
    var nameLower = name.toLowerCase();
    for (var a = 1; a < AScompA.length; a++) {
        if (String(What(AScompA[a] + 'Comp.Race') || '').toLowerCase() === nameLower) {
            DoTemplate("AScomp", "Remove", AScompA[a], true);
            console.println("OotD-MH: Removed companion: " + name);
        }
    }
};

// ── NOTES ─────────────────────────────────────────────────────
// Notes are written to Cnote.Left on the companion page.
// The header/footer strip ensures existing MPMB-written content
// (stat block traits, etc.) is preserved before the script section,
// and any player-written content after is preserved after it.

var OOTD_MH_NOTES_HEADER = "=== MINOTAUR CURSED TRANSFORMATION ===";
var OOTD_MH_NOTES_FOOTER = "=== END CURSED TRANSFORMATION NOTES ===";

var ootdMH_buildNotes = function(formKey) {
    var notes = OOTD_MH_NOTES_HEADER + "\n";
    if (formKey === "bull") {
        notes += "Form: Bull (Cursed Transformation \u2014 Level 5+)\n\n";
        notes += "STATS (OotD PHB):\n";
        notes += "AC 11  |  HP 36 (4d10+12)  |  Speed 40 ft\n";
        notes += "STR 18 (+4)  DEX 10  CON 16 (+3)  INT 4 (-3)  WIS 10 (+0)  CHA 9 (-1)\n";
        notes += "Passive Perception 14 (PHB)\n";
        notes += "Perception +4 (derived from passive perception; WIS 10 base + 4 = 14)\n\n";
        notes += "ATTACK \u2014 Horns: +5 to hit, 1d8+4 piercing\n";
        notes += "Charge: if moved 10+ ft straight toward target before hitting:\n";
        notes += "  +1d6 piercing damage  |  DC 11 STR save or knocked prone\n\n";
        notes += "TRANSFORMATION RULES:\n";
        notes += "  Activate  : Bonus action\n";
        notes += "  Duration  : Until bonus action to revert, or until unconscious\n";
        notes += "  Recharge  : Long rest\n";
        notes += "  Warning   : Auto-triggers on prolonged bright red exposure (DM discretion)\n\n";
        notes += "Upgrades to Dire Bull Form at character level 9.\n";
    } else {
        notes += "Form: Dire Bull (Cursed Transformation \u2014 Level 9+)\n\n";
        notes += "STATS (OotD PHB):\n";
        notes += "AC 12  |  HP 46 (5d10+12)  |  Speed 40 ft\n";
        notes += "STR 18 (+4)  DEX 10  CON 16 (+3)  INT 4 (-3)  WIS 10 (+0)  CHA 9 (-1)\n";
        notes += "Passive Perception 14 (PHB)\n";
        notes += "Perception +4 (derived from passive perception; WIS 10 base + 4 = 14)\n\n";
        notes += "ATTACK \u2014 Horns: +5 to hit, 2d6+4 piercing\n";
        notes += "Charge: if moved 10+ ft straight toward target before hitting:\n";
        notes += "  +1d10 piercing damage  |  DC 14 STR save or knocked prone\n\n";
        notes += "Relentless (1/Day): see Traits section on this companion page.\n\n";
        notes += "TRANSFORMATION RULES:\n";
        notes += "  Activate  : Bonus action\n";
        notes += "  Duration  : Until bonus action to revert, or until unconscious\n";
        notes += "  Recharge  : Long rest\n";
        notes += "  Warning   : Auto-triggers on prolonged bright red exposure (DM discretion)\n";
    }
    notes += "\n" + OOTD_MH_NOTES_FOOTER;
    return notes;
};

var ootdMH_writeNotes = function(prefix, formKey) {
    if (!prefix || typeof Value !== "function") return;
    var notes = ootdMH_buildNotes(formKey);
    try {
        var existing = "";
        try { existing = String(What(prefix + "Cnote.Left") || ""); } catch(e) {}

        // Strip any previously written script section to avoid duplication,
        // preserving MPMB-written content before it and player notes after it.
        var headerIdx = existing.indexOf(OOTD_MH_NOTES_HEADER);
        var footerIdx = existing.indexOf(OOTD_MH_NOTES_FOOTER);
        var before = "";
        var after  = "";
        if (headerIdx !== -1 && footerIdx !== -1) {
            before = existing.substring(0, headerIdx).replace(/\s+$/, "");
            after  = existing.substring(
                footerIdx + OOTD_MH_NOTES_FOOTER.length
            ).replace(/^\s+/, "");
        } else {
            before = existing.replace(/\s+$/, "");
        }

        var newContent = notes;
        if (before.length > 0) newContent = before + "\n\n" + newContent;
        if (after.length > 0)  newContent = newContent + "\n\n" + after;

        try {
            Value(prefix + "Cnote.Left", newContent);
            console.println("OotD-MH: Wrote " + formKey + " notes to " + prefix + "Cnote.Left");
        } catch(e) {
            // (fall-through to Comp.Use.Traits handled below)
            console.println("OotD-MH Warning: Cnote.Left write failed, falling back to Comp.Use.Traits: " + e);
            try {
                Value(prefix + "Comp.Use.Traits", newContent);
                console.println("OotD-MH: Wrote " + formKey + " notes to Comp.Use.Traits (fallback)");
            } catch(e2) {
                console.println("OotD-MH Error: Both notes field writes failed: " + e2);
            }
        }
    } catch(e) {
        console.println("OotD-MH Warning: Could not write companion notes: " + e);
    }

    // Dire Bull only: write Relentless to the Traits section (Comp.Use.Traits).
    // MPMB may not auto-render custom CreatureList traits to that field, so we
    // write it explicitly. The check prevents duplication on reload.
    if (formKey !== "bull") {
        try {
            var existingTraits = String(What(prefix + "Comp.Use.Traits") || "");
            if (existingTraits.indexOf("Relentless") === -1) {
                Value(prefix + "Comp.Use.Traits",
                    existingTraits +
                    (existingTraits.length > 0 ? "\n\n" : "") +
                    "Relentless (1/Day). If the minotaur would be reduced to 0 hit " +
                    "points, it is reduced to 1 hit point instead.");
                console.println("OotD-MH: Wrote Relentless to " + prefix + "Comp.Use.Traits");
            }
        } catch(e) {
            console.println("OotD-MH Warning: Could not write Relentless to Comp.Use.Traits: " + e);
        }
    }
};

// ── FORM MANAGEMENT ───────────────────────────────────────────
// Idempotent: reads current companion state and total level, then
// adds or removes only what needs to change. Safe to call on every
// sheet load and every level-up without creating duplicate pages.

var ootdMH_manageForm = function() {
    var totalLevel, hasBull, hasDireBull, prefix, prefixes;

    totalLevel = 0;
    if (typeof classes !== "undefined" && classes.totallevel) {
        totalLevel = classes.totallevel;
    } else if (typeof What === "function") {
        totalLevel = parseInt(What("Total Level")) || 0;
    }
    if (totalLevel < 1) totalLevel = 1;

    hasBull     = ootdMH_findExact("bull (minotaur form)").length > 0;
    hasDireBull = ootdMH_findExact("dire bull (minotaur form)").length > 0;

    if (totalLevel >= 9) {
        // ── Dire Bull phase ───────────────────────────────────
        if (hasBull) {
            ootdMH_removeExact("bull (minotaur form)");
        }
        if (!hasDireBull) {
            prefix = ootdMH_compAdd("dire bull (minotaur form)");
            if (prefix) {
                ootdMH_writeNotes(prefix, "dire");
                app.alert({
                    cMsg   : "Your Cursed Transformation has grown more powerful!\n\n" +
                             "At level 9, Bull Form upgrades to Dire Bull Form.\n\n" +
                             "Dire Bull improvements:\n" +
                             "  AC 12 (was 11)\n" +
                             "  HP 46 (was 36)\n" +
                             "  Horns: 2d6+4 (was 1d8+4)\n" +
                             "  Charge: +1d10, DC 14 STR save (was +1d6, DC 11)\n" +
                             "  Relentless 1/day: reduced to 0 HP becomes 1 HP instead\n\n" +
                             "Please review the companion page to verify the stat block.",
                    cTitle : "Cursed Transformation \u2014 Dire Bull Form",
                    nIcon  : 3
                });
                console.println("OotD-MH: Added Dire Bull companion at level " + totalLevel);
            } else {
                console.println("OotD-MH Warning: Failed to add Dire Bull companion page.");
            }
        } else {
            // Dire Bull already present — refresh notes only.
            prefixes = ootdMH_findExact("dire bull (minotaur form)");
            if (prefixes.length > 0) ootdMH_writeNotes(prefixes[0], "dire");
        }

    } else if (totalLevel >= 5) {
        // ── Bull phase ────────────────────────────────────────
        if (hasDireBull) {
            ootdMH_removeExact("dire bull (minotaur form)");
        }
        if (!hasBull) {
            prefix = ootdMH_compAdd("bull (minotaur form)");
            if (prefix) {
                ootdMH_writeNotes(prefix, "bull");
                app.alert({
                    cMsg   : "Your Minotaur Cursed Transformation has awakened!\n\n" +
                             "At level 5, you can transform into Bull Form as a bonus action.\n\n" +
                             "Bull Form Stats (per OotD PHB):\n" +
                             "  AC 11  |  HP 36  |  Speed 40 ft\n" +
                             "  Horns: +5 to hit, 1d8+4 piercing\n" +
                             "  Charge: +1d6 piercing, DC 11 STR save or knocked prone\n\n" +
                             "Recharges on a long rest.\n" +
                             "Auto-triggers on prolonged exposure to bright reds (DM discretion).\n\n" +
                             "Please review the companion page to verify the stat block.",
                    cTitle : "Cursed Transformation \u2014 Bull Form",
                    nIcon  : 3
                });
                console.println("OotD-MH: Added Bull companion at level " + totalLevel);
            } else {
                console.println("OotD-MH Warning: Failed to add Bull companion page.");
            }
        } else {
            // Bull already present — refresh notes only.
            prefixes = ootdMH_findExact("bull (minotaur form)");
            if (prefixes.length > 0) ootdMH_writeNotes(prefixes[0], "bull");
        }

    } else {
        // ── Below level 5 — no forms ─────────────────────────
        if (hasBull) {
            ootdMH_removeExact("bull (minotaur form)");
        }
        if (hasDireBull) {
            ootdMH_removeExact("dire bull (minotaur form)");
        }
    }
};

// ── MAGIC ITEM — LEVEL-UP HOOK ────────────────────────────────
// The character adds this item to their equipment list when playing
// a Thylean Minotaur. It has no mechanical effect on the character's
// stats. Its sole purpose is to host the calcChanges["hp"] watcher,
// which fires on every HP recalculation (i.e., on every level-up).
// This is the same reliable hook mechanism used by the Crown of the
// Dragonlords in OotD_GiftedOneDragon.js.
//
// eval fires when the item is added and on each sheet load.
// ootdMH_manageForm() is idempotent — safe to call on every reload.
//
// removeeval cleans up companion pages when the item is removed from
// the equipment list.
//
// IMPORTANT: calcChanges["hp"] must not return a value. Any return
// value would be added to the character's maximum hit points.

MagicItemsList["cursed transformation (minotaur)"] = {
    name         : "Cursed Transformation (Minotaur)",
    source       : [["OotD-MH", 0]],
    type         : "wondrous item",
    description  : "Tracker for the Thylean Minotaur racial ability. Manages Bull " +
                   "and Dire Bull companion pages automatically at levels 5 and 9. " +
                   "No effect on character stats. Add once; remove only if no longer " +
                   "playing a Thylean Minotaur.",
    descriptionFull :
        "This is a sheet tracker, not a magic item in the traditional sense. Add it " +
        "to your equipment list when playing a Thylean Minotaur to enable automatic " +
        "companion page management for the Cursed Transformation racial feature.\n\n" +
        "At level 5: Bull Form companion page is added automatically.\n\n" +
        "At level 9: Bull Form is removed and replaced with Dire Bull Form.\n\n" +
        "Both forms include notes on the companion page covering the PHB stats, " +
        "transformation rules, and the auto-trigger warning for bright reds. " +
        "The Cursed Transformation limited feature (1/long rest) is managed by " +
        "the base OotD script and is not duplicated here.\n\n" +
        "Remove this item only if you are no longer playing a Thylean Minotaur; " +
        "doing so will remove all companion pages added by this tracker.",
    eval : function() {
        ootdMH_manageForm();
        console.println("OotD-MH: Cursed Transformation tracker eval fired.");
    },
    removeeval : function() {
        ootdMH_removeExact("bull (minotaur form)");
        ootdMH_removeExact("dire bull (minotaur form)");
        console.println("OotD-MH: Tracker removed. Companion pages cleaned up.");
    },
    calcChanges : {
        "hp" : function(totalHD, HDobj, prefix) {
            // Fires on every HP recalculation (level-up).
            // Must not return a value — that would modify character max HP.
            ootdMH_manageForm();
        }
    }
};

console.println("OotD-MH: Herculean Minotaur Form Tracker loaded (v1.0.0).");
console.println("OotD-MH: Add 'Cursed Transformation (Minotaur)' to equipment to enable auto-companion management.");
