/*  -INFORMATION-

    Subject:    Gifted One — Dragon Companion System
    Effect:     Attune to the Crown of the Dragonlords to trigger the
                bonding dialogue. No JS console required.
                Auto-scales HP on level-up via calcChanges["hp"].
                Upgrades to Young Dragon at level 15.
                Unbreakable Bond tracker at level 20.

    Requires:   OdysseyOfTheDragonlords_v13.js
                OotD_AmazonianFix.js
    Sheet:      v13.2.0+
    Load order: After both scripts above.

    CHANGELOG v1.6.0:
    - Name field: write to Comp.Desc.Name (confirmed real PDF field via
      field enumeration diagnostic). Removed Comp.Use.CreatureName —
      not a real PDF field; writes were silently discarded.
    - Notes field: write to Cnote.Left (the actual Notes panel on the
      companion page, labeled by Text.Header.NotesComp). Removed
      Comp.Use.Notes — not a real PDF field; was also silently discarded.
      Fallback to Comp.Use.Traits if Cnote.Left write fails.
    - Removed: field enumeration diagnostic block.

    Full version history: see CHANGELOG.md in the repo root.
*/

var iFileName = "OotD_GiftedOneDragon.js";
RequiredSheetVersion("13.2.0");

SourceList["OotD-GD"] = {
    name : "Odyssey of the Dragonlords: Gifted One Dragon System",
    abbreviation : "OotD-GD",
    abbreviationSpellsheet : "OG",
    group : "Player Companions",
    url : "https://www.arcanumworlds.com/odyssey-of-the-dragonlords",
    date : "2019/09/01"
};

var OOTD_GD_NOTES_HEADER  = "=== DRAGON COMPANION (GIFTED ONE) ===";
var OOTD_GD_NOTES_FOOTER  = "=== END DRAGON COMPANION NOTES ===";
var OOTD_GD_LEVEL_VAR_KEY = "ootdGD_lastLevel";
var OOTD_GD_NAME_VAR_KEY  = "ootdGD_dragonName";
var OOTD_GD_TYPE_VAR_KEY  = "ootdGD_dragonType";

var OOTD_GD_DRAGON_TYPES = {
    "Brass"  : { wyrmling : "brass dragon wyrmling",  young : "young brass dragon"  },
    "Bronze" : { wyrmling : "bronze dragon wyrmling", young : "young bronze dragon" },
    "Copper" : { wyrmling : "copper dragon wyrmling", young : "young copper dragon" },
    "Silver" : { wyrmling : "silver dragon wyrmling", young : "young silver dragon" }
};

var ootdGetCompanionFunctions = function() {
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
    console.println("OotD-GD Error: Companion functions not found. Ensure OotD_AmazonianFix.js is loaded.");
    return null;
};

var ootdCalcDragonHP = function() {
    var totalLvl = 0;
    if (typeof classes !== "undefined" && classes.totallevel) {
        totalLvl = classes.totallevel;
    } else if (typeof What === "function") {
        var lvlField = What("Total Level");
        if (lvlField) totalLvl = parseInt(lvlField) || 0;
    }
    if (totalLvl < 1) totalLvl = 1;
    return 40 + (2 * totalLvl);
};

var ootdFindDragonCompanion = function() {
    var compFunc = ootdGetCompanionFunctions();
    if (!compFunc) return false;
    var allTypes = ["brass", "bronze", "copper", "silver"];
    var stages   = ["wyrmling", "young"];
    for (var t = 0; t < allTypes.length; t++) {
        for (var s = 0; s < stages.length; s++) {
            var searchTerm = stages[s] === "wyrmling"
                ? allTypes[t] + " dragon wyrmling"
                : "young " + allTypes[t] + " dragon";
            var found = compFunc.find(searchTerm);
            if (found && found.length > 0) {
                return { prefix : found[0], type : allTypes[t], stage : stages[s] };
            }
        }
    }
    return false;
};

var ootdApplyProfToSaves = function(prefix) {
    if (!prefix || typeof AddToModFld !== "function") return;
    var saves = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
    for (var i = 0; i < saves.length; i++) {
        try {
            AddToModFld(
                prefix + "BlueText.Comp.Use.Ability." + saves[i] + ".ST.Bonus",
                "oProf", false, "Gifted One Dragon Bond",
                "The bonded dragon adds the character's proficiency bonus to its saving throws."
            );
        } catch(e) {
            console.println("OotD-GD Warning: Could not apply prof to " + saves[i] + " save: " + e);
        }
    }
};

var ootdRemoveProfFromSaves = function(prefix) {
    if (!prefix || typeof AddToModFld !== "function") return;
    var saves = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
    for (var i = 0; i < saves.length; i++) {
        try {
            AddToModFld(
                prefix + "BlueText.Comp.Use.Ability." + saves[i] + ".ST.Bonus",
                "oProf", true, "Gifted One Dragon Bond",
                "Removing proficiency bonus from dragon saving throws."
            );
        } catch(e) {
            console.println("OotD-GD Warning: Could not remove prof from " + saves[i] + " save: " + e);
        }
    }
};

var ootdSetDragonHP = function(prefix) {
    if (!prefix || typeof Value !== "function") return;
    var hp = ootdCalcDragonHP();
    try {
        Value(prefix + "Comp.Use.HP.Max", hp);
        console.println("OotD-GD: Set dragon HP to " + hp);
    } catch(e) {
        console.println("OotD-GD Warning: Could not set dragon HP: " + e);
    }
};

var ootdBuildDragonNotes = function(dragonName, dragonType, stage, totalLevel) {
    var notes = OOTD_GD_NOTES_HEADER + "\n";
    notes += "Dragon: " + dragonName + " (" + dragonType.charAt(0).toUpperCase() + dragonType.slice(1) + ")\n";
    notes += "Stage: " + (stage === "wyrmling" ? "Wyrmling" : "Young Dragon") + "\n";
    notes += "HP Formula: 40 + 2 x total level (currently " + ootdCalcDragonHP() + ")\n";
    notes += "Saves: +Prof bonus to all six saving throws\n\n";
    notes += "RULES REMINDERS:\n";
    notes += "- Death-link: If your dragon dies, you die in 24 hrs unless returned to life.\n";
    notes += "- Bond: Only one dragon can be bonded. Bond is permanent.\n";
    notes += "- Breath Weapon: Once per encounter. Recharges after long rest.\n";
    if (stage === "wyrmling") {
        notes += "- Mounting: Wyrmlings CANNOT be used as mounts. Upgrade at total level 15.\n";
        notes += "- Multiattack: Not available while fighting alongside you.\n";
    } else {
        notes += "- Mounting: Young Dragon can be used as a mount.\n";
        notes += "- While mounted: Gain dragon's resistances, immunities, senses.\n";
        notes += "- Multiattack: Available when not being used as a mount.\n";
    }
    if (totalLevel >= 20) {
        notes += "\nUNBREAKABLE BOND (Level 20):\n";
        notes += "- Dragon gains Multiattack even when mounted.\n";
        notes += "- Breath weapon recharges on 5-6 each round.\n";
        notes += "- Once per long rest: Dragon auto-succeeds a failed saving throw.\n";
        notes += "  Track with the 'Dragon Auto-Succeed' limited feature.\n";
    }
    notes += "\nSCRIPT LIMITATIONS (track manually):\n";
    notes += "- Cast Bond of the Dragonlords manually.\n";
    notes += "- Deduct 5,000 gp material component from your gold.\n";
    notes += "- 24-hour bonding window after hatching: DM-tracked.\n";
    notes += "\n" + OOTD_GD_NOTES_FOOTER;
    return notes;
};

var ootdWriteDragonNotes = function(prefix, dragonName, dragonType, stage) {
    if (!prefix || typeof What !== "function" || typeof Value !== "function") return;
    var totalLevel = (typeof classes !== "undefined" && classes.totallevel) ? classes.totallevel : 1;

    try {
        var existingContent = What(prefix + "Cnote.Left") || "";

        // Strip any previously written script section to avoid duplication
        var headerIdx = existingContent.indexOf(OOTD_GD_NOTES_HEADER);
        var footerIdx = existingContent.indexOf(OOTD_GD_NOTES_FOOTER);
        var mpmgContent = "";
        var playerNotes = "";

        if (headerIdx !== -1 && footerIdx !== -1) {
            // Script section exists — preserve MPMB content before it
            // and player notes after it
            mpmgContent = existingContent.substring(0, headerIdx).trimRight();
            playerNotes = existingContent.substring(
                footerIdx + OOTD_GD_NOTES_FOOTER.length
            ).trim();
        } else {
            // No script section yet — everything in the field is MPMB content
            mpmgContent = existingContent.trimRight();
        }

        // Build new content: MPMB traits first, then script section, then player notes
        var scriptSection = ootdBuildDragonNotes(dragonName, dragonType, stage, totalLevel);
        var newContent = "";
        if (mpmgContent.length > 0) {
            newContent = mpmgContent + "\n\n" + scriptSection;
        } else {
            newContent = scriptSection;
        }
        if (playerNotes.length > 0) {
            newContent += "\n\n--- Player Notes ---\n" + playerNotes;
        }

        try {
            Value(prefix + "Cnote.Left", newContent);
            console.println("OotD-GD: Wrote dragon notes to " + prefix + "Cnote.Left");
        } catch(e) {
            console.println("OotD-GD Warning: Cnote.Left write failed, falling back to Comp.Use.Traits: " + e);
            try {
                Value(prefix + "Comp.Use.Traits", newContent);
                console.println("OotD-GD: Wrote dragon notes to " + prefix + "Comp.Use.Traits (fallback)");
            } catch(e2) {
                console.println("OotD-GD Error: Both notes field writes failed: " + e2);
            }
        }
    } catch(e) {
        console.println("OotD-GD Warning: Could not write dragon notes: " + e);
    }
};

// ── CORE BONDING FUNCTION ─────────────────────────────────────
// Called from Crown eval. Reload guard exits silently if dragon
// already bonded (Crown eval fires on every sheet load).

var ootdBondDragon = function() {
    var existing = ootdFindDragonCompanion();
    if (existing) {
        console.println("OotD-GD: Dragon already bonded (" +
            existing.type + " " + existing.stage + "). Skipping bond dialogue on reload.");
        return;
    }
    var compFunc = ootdGetCompanionFunctions();
    if (!compFunc) {
        app.alert({
            cMsg  : "Could not add dragon companion: companion functions unavailable.\n\n" +
                    "Ensure OotD_AmazonianFix.js is loaded before this script.\n\n" +
                    "Manual workaround: Add a companion page, set Race to your dragon type " +
                    "(e.g. 'bronze dragon wyrmling'), apply prof bonus to all six saves, " +
                    "set HP to 40 + (2 x total level).",
            cTitle : "Companion Functions Unavailable", nIcon : 0
        });
        return;
    }
    var typeChoice = app.response({
        cQuestion : "Choose your dragon type:\n\n  1 = Brass\n  2 = Bronze\n  3 = Copper\n  4 = Silver\n\n(Default: Bronze)",
        cTitle : "Bond Dragon — Choose Type", cDefault : "2", cLabel : "Dragon Type (1-4)"
    });
    var dragonType = "bronze";
    if (typeChoice !== null) {
        var trimmed = typeChoice.trim();
        if      (trimmed === "1" || trimmed.toLowerCase() === "brass")   dragonType = "brass";
        else if (trimmed === "2" || trimmed.toLowerCase() === "bronze")  dragonType = "bronze";
        else if (trimmed === "3" || trimmed.toLowerCase() === "copper")  dragonType = "copper";
        else if (trimmed === "4" || trimmed.toLowerCase() === "silver")  dragonType = "silver";
    } else {
        console.println("OotD-GD: Bond Dragon cancelled by user."); return;
    }
    var defaultName = dragonType.charAt(0).toUpperCase() + dragonType.slice(1) + " Dragon Wyrmling";
    var dragonName = app.response({
        cQuestion : "Enter a name for your dragon (optional).\nLeave blank to use: " + defaultName,
        cTitle : "Bond Dragon — Name Your Dragon", cDefault : "", cLabel : "Dragon Name"
    });
    if (dragonName === null) { console.println("OotD-GD: Cancelled during naming."); return; }
    dragonName = dragonName.trim().length > 0 ? dragonName.trim() : defaultName;
    app.alert({
        cMsg  : "BEFORE BONDING — IMPORTANT REMINDERS:\n\n" +
                "1. Material Component: 5,000 gp magical item (consumed). Deduct from gold.\n" +
                "2. Timing: Cast within 24 hours of hatching. Confirm with DM.\n" +
                "3. Permanence: Bond is permanent and cannot be undone via this script.\n\n" +
                "Click OK to add " + dragonName + " to your companion page.",
        cTitle : "Bond Dragon — Pre-Bond Reminders", nIcon : 2
    });
    var typeKey     = dragonType.charAt(0).toUpperCase() + dragonType.slice(1);
    var wyrmlingKey = OOTD_GD_DRAGON_TYPES[typeKey].wyrmling;
    var prefix      = false;
    try { prefix = compFunc.add(wyrmlingKey); } catch(e) {
        console.println("OotD-GD Error: compFunc.add threw: " + e);
    }
    if (!prefix) {
        app.alert({
            cMsg  : "Could not add the dragon companion page automatically.\n\n" +
                    "Manual workaround:\n" +
                    "1. Add a companion page via bookmarks > Functions > Add Page/Template\n" +
                    "2. Set Race/Creature to: " + wyrmlingKey + "\n" +
                    "3. Set HP to: " + ootdCalcDragonHP() + "\n" +
                    "4. Apply prof bonus to all six saving throws manually",
            cTitle : "Companion Page Error", nIcon : 0
        });
        return;
    }
    // Write dragon name to Comp.Desc.Name (confirmed real PDF field via enumeration).
    // Also persist to CurrentVars as a redundant backup across page operations.
    try {
        Value(prefix + "Comp.Desc.Name", dragonName);
        console.println("OotD-GD: Wrote dragon name to Comp.Desc.Name: " + dragonName);
    } catch(e) {
        console.println("OotD-GD Warning: Comp.Desc.Name write failed, name stored in CurrentVars only: " + e);
    }
    try {
        if (typeof CurrentVars !== "undefined") {
            CurrentVars[OOTD_GD_NAME_VAR_KEY] = dragonName;
            CurrentVars[OOTD_GD_TYPE_VAR_KEY] = dragonType;
        }
    } catch(e) {}
    ootdSetDragonHP(prefix);
    ootdApplyProfToSaves(prefix);
    ootdWriteDragonNotes(prefix, dragonName, dragonType, "wyrmling");
    var currentLevel = (typeof classes !== "undefined" && classes.totallevel) ? classes.totallevel : 1;
    try { if (typeof CurrentVars !== "undefined") CurrentVars[OOTD_GD_LEVEL_VAR_KEY] = currentLevel; } catch(e) {}
    app.alert({
        cMsg  : dragonName + " has been added to your companion page.\n\n" +
                "Type: " + typeKey + " Wyrmling\n" +
                "HP: " + ootdCalcDragonHP() + " (40 + 2 x level " + currentLevel + ")\n" +
                "Saves: +Prof bonus applied to all six saving throws\n\n" +
                "Name '" + dragonName + "' written to companion page.\n\n" +
                "Please review the companion page to verify the stat block populated correctly.\n" +
                "Rules reminders have been written to the companion's Notes section.",
        cTitle : "Dragon Bonded Successfully", nIcon : 3
    });
    console.println("OotD-GD: Bonded " + dragonName + " (" + wyrmlingKey + ") at level " + currentLevel);
};

// ── LEVEL SCALING ─────────────────────────────────────────────

var ootdUpdateDragonOnLevelUp = function() {
    var dragon = ootdFindDragonCompanion();
    if (!dragon) return;

    var totalLevel = (typeof classes !== "undefined" && classes.totallevel) ? classes.totallevel : 1;
    var prefix     = dragon.prefix;
    var dragonType = dragon.type;
    var stage      = dragon.stage;
    var newPrefix  = false; // hoisted to function scope — prevents scoping failures in Acrobat JS engine

    // Capture name before any remove/add operations.
    // Read from CreatureName field, fall back to CurrentVars if empty.
    var dragonName = "";
    try { dragonName = What(prefix + "Comp.Desc.Name") || ""; } catch(e) {}
    try {
        if (!dragonName && typeof CurrentVars !== "undefined" && CurrentVars[OOTD_GD_NAME_VAR_KEY])
            dragonName = CurrentVars[OOTD_GD_NAME_VAR_KEY];
    } catch(e) {}
    if (!dragonName) {
        dragonName = dragonType.charAt(0).toUpperCase() + dragonType.slice(1) + " Dragon";
    }
    console.println("OotD-GD: Captured dragon name: " + dragonName);

    ootdSetDragonHP(prefix);
    if (totalLevel >= 15 && stage === "wyrmling") {
        var compFunc = ootdGetCompanionFunctions();
        if (!compFunc) {
            console.println("OotD-GD Warning: Cannot upgrade — companion functions unavailable.");
            ootdWriteDragonNotes(prefix, dragonName, dragonType, stage);
            return;
        }
        var typeKey  = dragonType.charAt(0).toUpperCase() + dragonType.slice(1);
        var youngKey = OOTD_GD_DRAGON_TYPES[typeKey].young;
        app.alert({
            cMsg  : "Your dragon has grown into a Young Dragon!\n\n" +
                    dragonName + " is now a " + typeKey + " Young Dragon.\n\n" +
                    "- Stat block updated\n- Can now be used as a mount\n" +
                    "- HP: " + ootdCalcDragonHP() + "\n- Prof bonus re-applied to all saves\n\n" +
                    "Please review the companion page to verify the upgrade.",
            cTitle : "Dragon Upgrade — Young Dragon", nIcon : 3
        });
        try { ootdRemoveProfFromSaves(prefix); compFunc.remove(dragonType + " dragon wyrmling"); } catch(e) {
            console.println("OotD-GD Warning: Error removing wyrmling: " + e);
        }
        try {
            newPrefix = compFunc.add(youngKey);
        } catch(e) {
            console.println("OotD-GD Error: Could not add Young Dragon companion: " + e);
        }
        if (!newPrefix) {
            app.alert({
                cMsg  : "Could not auto-upgrade to Young Dragon.\n\nManual steps:\n" +
                        "1. Change Race/Creature to: " + youngKey + "\n" +
                        "2. Update HP to: " + ootdCalcDragonHP() + "\n" +
                        "3. Re-apply prof bonus to all six saves",
                cTitle : "Young Dragon Upgrade Error", nIcon : 0
            });
            return;
        }
        try {
            Value(newPrefix + "Comp.Desc.Name", dragonName);
            console.println("OotD-GD: Wrote dragon name to Comp.Desc.Name: " + dragonName);
        } catch(e) {
            console.println("OotD-GD Warning: Comp.Desc.Name write failed, name stored in CurrentVars only: " + e);
        }

        ootdSetDragonHP(newPrefix);
        ootdApplyProfToSaves(newPrefix);
        console.println("OotD-GD: Writing notes to prefix: " + newPrefix);
        ootdWriteDragonNotes(newPrefix, dragonName, dragonType, "young");
        console.println("OotD-GD: Upgraded " + dragonName + " to Young Dragon at level " + totalLevel);
    } else {
        ootdWriteDragonNotes(prefix, dragonName, dragonType, stage);
    }
    if (totalLevel >= 20) {
        var bondFeatureName = "Dragon Auto-Succeed (Unbreakable Bond)";
        try {
            var alreadyPresent = false;
            for (var lf = 1; lf <= 20; lf++) {
                var en = What("Limited Feature " + lf);
                if (en && en.indexOf(bondFeatureName) !== -1) { alreadyPresent = true; break; }
            }
            if (!alreadyPresent) {
                for (var slot = 1; slot <= 20; slot++) {
                    var sn = What("Limited Feature " + slot);
                    if (!sn || sn.trim() === "") {
                        Value("Limited Feature " + slot, bondFeatureName);
                        console.println("OotD-GD: Added Unbreakable Bond tracker to Limited Feature " + slot);
                        break;
                    }
                }
            }
        } catch(e) { console.println("OotD-GD Warning: Could not add Unbreakable Bond feature: " + e); }
    }
};

// ── LEVEL-UP WATCHER ──────────────────────────────────────────
// v1.1.0 used BackgroundFeatureList + calcChanges["hp"] here.
// BackgroundFeatureList did not register correctly in MPMB v13 —
// the watcher never existed on the sheet.
//
// v1.2.0: Watcher moved into MagicItemsList["crown of the dragonlords"]
// calcChanges["hp"] below. The Crown is guaranteed on-sheet once
// attuned, making it a reliable host for the level-change hook.

// ── CROWN OF THE DRAGONLORDS — EXTEND MAGIC ITEM ─────────────
// eval fires on attunement → triggers bond dialogue (with reload guard).
// removeeval is informational only; bond persists after Crown removal.
// calcChanges["hp"] fires on every HP recalc (i.e. level-up) and
// drives the level-up watcher (v1.2.0: moved here from BackgroundFeatureList).

if (typeof MagicItemsList !== "undefined" && MagicItemsList["crown of the dragonlords"]) {
    var crownEntry = MagicItemsList["crown of the dragonlords"];
    var crownEval = function() { ootdBondDragon(); };
    var crownRemoveEval = function() {
        var dragon = ootdFindDragonCompanion();
        if (dragon) console.println("OotD-GD: Crown removed. Bond is permanent; no action taken.");
        else console.println("OotD-GD: Crown removed before bonding.");
    };
    var crownCalcChanges = {
        "hp" : function(totalHD, HDobj, prefix) {
            var dragon = ootdFindDragonCompanion();
            if (!dragon) return;
            var currentLevel = (typeof classes !== "undefined" && classes.totallevel)
                ? classes.totallevel : 1;
            var lastLevel = 0;
            try {
                if (typeof CurrentVars !== "undefined" && CurrentVars[OOTD_GD_LEVEL_VAR_KEY])
                    lastLevel = parseInt(CurrentVars[OOTD_GD_LEVEL_VAR_KEY]) || 0;
            } catch(e) {}
            if (currentLevel !== lastLevel) {
                console.println("OotD-GD: Level change " + lastLevel + " → " + currentLevel + ". Updating dragon.");
                try {
                    if (typeof CurrentVars !== "undefined")
                        CurrentVars[OOTD_GD_LEVEL_VAR_KEY] = currentLevel;
                } catch(e) {}
                ootdUpdateDragonOnLevelUp();
            }
            // Must not return a value — would alter character HP.
        }
    };
    if (crownEntry["spellcaster"]) {
        crownEntry["spellcaster"].eval        = crownEval;
        crownEntry["spellcaster"].removeeval  = crownRemoveEval;
        crownEntry["spellcaster"].calcChanges = crownCalcChanges;
        console.println("OotD-GD: Extended Crown [spellcaster] with Bond Dragon eval + level watcher");
    }
    if (crownEntry["non-spellcaster"]) {
        crownEntry["non-spellcaster"].eval        = crownEval;
        crownEntry["non-spellcaster"].removeeval  = crownRemoveEval;
        crownEntry["non-spellcaster"].calcChanges = crownCalcChanges;
        console.println("OotD-GD: Extended Crown [non-spellcaster] with Bond Dragon eval + level watcher");
    }
} else {
    console.println("OotD-GD Error: Crown of the Dragonlords not found. Load OdysseyOfTheDragonlords_v13.js first.");
}

// ── DIAGNOSTIC — enumerate Limited Feature fields ─────────────
// Catches both "Limited Feature X" (PDF label) and any "limfea"
// shorthand MPMB may use internally.
(function() {
    console.println("DIAG LF: Scanning for Limited Feature and limfea fields...");
    var count = 0;
    for (var fi = 0; fi < this.numFields; fi++) {
        var fn = this.getNthFieldName(fi);
        var fnLower = fn.toLowerCase();
        if (fn.indexOf("Limited Feature") === 0 || fnLower.indexOf("limfea") !== -1) {
            var fval = "";
            try { fval = What(fn) || ""; } catch(e) { fval = "READ_ERR"; }
            console.println("LF FIELD [" + count + "] " + fn +
                " = '" + (fval.length > 60 ? fval.substring(0, 60) + "..." : fval) + "'");
            count++;
        }
    }
    console.println("DIAG LF: " + count + " fields found.");
})();
// ── END DIAGNOSTIC ────────────────────────────────────────────

console.println("OotD-GD: Gifted One Dragon Companion System loaded (v1.6.0).");
console.println("OotD-GD: Attune to the Crown of the Dragonlords to begin bonding.");