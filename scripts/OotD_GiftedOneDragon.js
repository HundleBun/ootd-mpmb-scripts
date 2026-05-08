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

    CHANGELOG v1.1.0:
    - Console-free bonding: Crown eval fires ootdBondDragon() directly.
      Reload guard exits silently if dragon already bonded.
    - Reliable level-up watcher: Replaced broken FeatsList changeeval
      (prereqeval=false meant it could never fire) with
      BackgroundFeatureList + calcChanges["hp"] + CurrentVars
      level-change detection.
    - Removed: dead FeatsList watcher, ootdAddBondButton(),
      ootdRemoveBondButton(), notepad band-aid.
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
        var existingNotes = What(prefix + "Comp.Use.Notes") || "";
        var headerIdx = existingNotes.indexOf(OOTD_GD_NOTES_HEADER);
        var footerIdx = existingNotes.indexOf(OOTD_GD_NOTES_FOOTER);
        var playerNotes = "";
        if (headerIdx !== -1 && footerIdx !== -1) {
            playerNotes = existingNotes.substring(footerIdx + OOTD_GD_NOTES_FOOTER.length).trim();
        } else if (existingNotes.trim().length > 0) {
            playerNotes = existingNotes.trim();
        }
        var newNotes = ootdBuildDragonNotes(dragonName, dragonType, stage, totalLevel);
        if (playerNotes.length > 0) newNotes += "\n\n--- Player Notes ---\n" + playerNotes;
        Value(prefix + "Comp.Use.Notes", newNotes);
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
    try {
        if (dragonName !== defaultName && typeof Value === "function")
            Value(prefix + "Comp.Use.Nickname", dragonName);
    } catch(e) { /* non-critical */ }
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
                "Please review the companion page and verify the stat block.\n" +
                "Rules reminders are in the companion's Notes section.",
        cTitle : "Dragon Bonded Successfully", nIcon : 3
    });
    console.println("OotD-GD: Bonded " + dragonName + " (" + wyrmlingKey + ") at level " + currentLevel);
};

// ── LEVEL SCALING ─────────────────────────────────────────────

var ootdUpdateDragonOnLevelUp = function() {
    var dragon = ootdFindDragonCompanion();
    if (!dragon) return;
    var totalLevel = (typeof classes !== "undefined" && classes.totallevel) ? classes.totallevel : 1;
    var prefix = dragon.prefix, dragonType = dragon.type, stage = dragon.stage;
    var dragonName = "";
    try { dragonName = What(prefix + "Comp.Use.Nickname") || ""; } catch(e) {}
    if (!dragonName) dragonName = dragonType.charAt(0).toUpperCase() + dragonType.slice(1) +
                                  (stage === "wyrmling" ? " Dragon Wyrmling" : " Dragon");
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
        var newPrefix = false;
        try { newPrefix = compFunc.add(youngKey); } catch(e) {
            console.println("OotD-GD Error: Could not add Young Dragon: " + e);
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
        try { if (dragonName && typeof Value === "function") Value(newPrefix + "Comp.Use.Nickname", dragonName); } catch(e) {}
        ootdSetDragonHP(newPrefix);
        ootdApplyProfToSaves(newPrefix);
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
                        Value("Limited Feature " + slot + " Used", 0);
                        Value("Limited Feature " + slot + " Max", 1);
                        Value("Limited Feature " + slot + " Recovery", "long rest");
                        console.println("OotD-GD: Added Unbreakable Bond tracker to slot " + slot);
                        break;
                    }
                }
            }
        } catch(e) { console.println("OotD-GD Warning: Could not add Unbreakable Bond feature: " + e); }
    }
};

// ── LEVEL-UP WATCHER ──────────────────────────────────────────
// Uses BackgroundFeatureList + calcChanges["hp"].
//
// WHY NOT FeatsList changeeval:
//   prereqeval returns false → feat can never be selected →
//   changeeval never fires. That approach (v1.0) was dead code.
//
// WHY calcChanges["hp"]:
//   MPMB recalculates HP on every level-up. This hook fires
//   reliably for any character with this background feature,
//   regardless of class. We gate logic on CurrentVars level-change
//   detection to avoid running on every recalc.

BackgroundFeatureList["gifted one: dragon bond watcher"] = {
    name        : "Gifted One: Dragon Bond Watcher",
    source      : [["OotD-GD", 0]],
    description : "Internal. Auto-updates bonded dragon HP and stage on level-up. Do not remove while dragon is bonded.",
    calcChanges : {
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
                try { if (typeof CurrentVars !== "undefined") CurrentVars[OOTD_GD_LEVEL_VAR_KEY] = currentLevel; } catch(e) {}
                ootdUpdateDragonOnLevelUp();
            }
            // Must not return a value — would alter character HP.
        }
    }
};

// ── CROWN OF THE DRAGONLORDS — EXTEND MAGIC ITEM ─────────────
// eval fires on attunement → triggers bond dialogue (with reload guard).
// removeeval is informational only; bond persists after Crown removal.

if (typeof MagicItemsList !== "undefined" && MagicItemsList["crown of the dragonlords"]) {
    var crownEntry = MagicItemsList["crown of the dragonlords"];
    var crownEval = function() { ootdBondDragon(); };
    var crownRemoveEval = function() {
        var dragon = ootdFindDragonCompanion();
        if (dragon) console.println("OotD-GD: Crown removed. Bond is permanent; no action taken.");
        else console.println("OotD-GD: Crown removed before bonding.");
    };
    if (crownEntry["spellcaster"]) {
        crownEntry["spellcaster"].eval       = crownEval;
        crownEntry["spellcaster"].removeeval = crownRemoveEval;
        console.println("OotD-GD: Extended Crown [spellcaster] with Bond Dragon eval");
    }
    if (crownEntry["non-spellcaster"]) {
        crownEntry["non-spellcaster"].eval       = crownEval;
        crownEntry["non-spellcaster"].removeeval = crownRemoveEval;
        console.println("OotD-GD: Extended Crown [non-spellcaster] with Bond Dragon eval");
    }
} else {
    console.println("OotD-GD Error: Crown of the Dragonlords not found. Load OdysseyOfTheDragonlords_v13.js first.");
}

console.println("OotD-GD: Gifted One Dragon Companion System loaded (v1.1.0).");
console.println("OotD-GD: Attune to the Crown of the Dragonlords to begin bonding.");