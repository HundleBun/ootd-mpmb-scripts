/*  -INFORMATION-

    Subject:    Patch: OotD Amazonian Conclave Companion Fix
    Effect:     Patches a TypeError in the community OotD script where the
                Amazonian Conclave subclass fails to add the Stimfay companion.

                Also extends the Stimfay companion with:
                - Naming dialogue on first companion creation
                - Appearance selection (eagle, harrier, hawk, kite, osprey,
                  owl, or archaeopteryx) — written to companion notes
                - Companion notes written to Cnote.Left (companion sheet)
                - HP scaling (15 + ranger level) is handled by the OotD base
                  script's creature entry and updates automatically on level-up

                The original bug: line 1543 of the OotD script uses
                "ClassList.artificer ? ClassList.artificer.artificerCompFunc
                : ClassList.paladin.artificerCompFunc"
                which fails when:
                - TCoE is enabled (artificer exists but lacks artificerCompFunc)
                - TCoE is disabled but paladin.artificerCompFunc was never
                  successfully defined (script load order quirks)

                This patch ensures both ClassList.paladin.artificerCompFunc
                and ClassList.artificer.artificerCompFunc (when applicable)
                are properly defined with working companion management
                functions.

    Sheet:      v13.2.0 and newer
    Load order: This script must be loaded AFTER the OotD script.

    CHANGELOG v2.0.0:
    - Added Stimfay naming dialogue on companion creation.
    - Added appearance selection (7 options from source material).
    - Notes now written to Cnote.Left on the companion sheet, combining
      all companion info in one place.
    - HP and proficiency bonus confirmed handled by the OotD base script.
    - Companion notes include level-conditional Improved Falconry section
      (level 11+) and correct HP formula for each tier.
    - Notes auto-refresh on level-up by wrapping amazonCompFunc.update,
      which the OotD base script calls at both level 3 and level 11.
    - Stimfay appearance stored in CurrentVars so refresh can read it back.

*/

var iFileName = "OotD_AmazonianFix.js";
RequiredSheetVersion("13.2.0");

// ── STIMFAY COMPANION SETUP ────────────────────────────────────
// These functions run once when the Stimfay is first added.
// The reload guard in ootdSetupStimfay prevents re-prompting on sheet reload.

var OOTD_STIM_NOTES_HEADER      = "=== STIMFAY COMPANION (AMAZONIAN CONCLAVE) ===";
var OOTD_STIM_NOTES_FOOTER      = "=== END STIMFAY COMPANION NOTES ===";
var OOTD_AC_APPEARANCE_VAR_KEY  = "ootdAC_stimfayAppearance";

// Builds the companion notes text block from name and appearance.
// Includes level-conditional content for Improved Falconry (level 11+).
var ootdBuildStimfayNotes = function(stimfayName, appearance) {
    var rangerLevel = 0;
    if (typeof classes !== "undefined" && classes.known && classes.known.ranger) {
        rangerLevel = classes.known.ranger.level || 0;
    }
    if (rangerLevel < 1) rangerLevel = 1;
    var base = rangerLevel >= 11 ? 30 : 15;
    var notes = OOTD_STIM_NOTES_HEADER + "\n";
    notes += "Name: " + stimfayName + "\n";
    notes += "Appearance: " + appearance + "\n";
    notes += "HP Formula: " + base + " + ranger level";
    notes += " (currently " + (base + rangerLevel) + ")\n\n";
    notes += "APPEARANCE NOTE:\n";
    notes += "Your Stimfay resembles a " + appearance.toLowerCase() + ". ";
    notes += "Appearance does not affect abilities, but influences personality.\n\n";
    notes += "STIMFAY ABILITIES:\n";
    notes += "- Can scout a 1-mile radius in 10 minutes if there is open sky.\n";
    notes += "- Understands any language you speak; only you understand its clicks and squawks.\n";
    notes += "- Obeys your commands, acts on your initiative, and acts on its own if incapacitated.\n";
    notes += "- Regains lost HP after a long rest. Can be fully repaired in 8 hours if destroyed.\n";
    notes += "- Can carry and administer a single potion as an action.\n";
    notes += "- Can use a bonus action to stabilize a dying creature it can touch.\n";
    if (rangerLevel >= 11) {
        notes += "\nIMPROVED FALCONRY (Level 11):\n";
        notes += "- Reaction: when you take damage from an attack or effect you can see, your Stimfay\n";
        notes += "  intercepts and takes the damage instead (must be within 60 ft and functional).\n";
        notes += "- Gains +prof bonus to AC. Attacks are now magical.\n";
        notes += "- Damage dice for Talons, Pinion Storm, and Piercing Screech increase to 2d6.\n";
    }
    notes += "\n" + OOTD_STIM_NOTES_FOOTER;
    return notes;
};

// Writes notes to Cnote.Left (companion sheet), with fallback to Comp.Use.Traits.
var ootdWriteStimfayNotes = function(prefix, stimfayName, appearance) {
    if (!prefix || typeof Value !== "function") return;
    var notes = ootdBuildStimfayNotes(stimfayName, appearance);
    try {
        Value(prefix + "Cnote.Left", notes);
        console.println("OotD Patch: Wrote Stimfay notes to " + prefix + "Cnote.Left");
    } catch(e) {
        console.println("OotD Patch Warning: Cnote.Left write failed, falling back to Comp.Use.Traits: " + e);
        try {
            Value(prefix + "Comp.Use.Traits", notes);
            console.println("OotD Patch: Wrote Stimfay notes to Comp.Use.Traits (fallback)");
        } catch(e2) {
            console.println("OotD Patch Error: Both notes field writes failed: " + e2);
        }
    }
};

// Runs on first companion creation. Shows name and appearance prompts
// and writes results to the companion page.
// Reload guard: exits silently if Comp.Desc.Name already has a value.
var ootdSetupStimfay = function(prefix) {
    var existingName = "";
    try { existingName = String(What(prefix + "Comp.Desc.Name") || "").trim(); } catch(e) {}
    if (existingName.length > 0) {
        console.println("OotD Patch: Stimfay already set up (" + existingName + "). Skipping on reload.");
        return;
    }

    // Name prompt
    var stimfayName = app.response({
        cQuestion : "Enter a name for your Stimfay (optional).\nLeave blank to use the default name.",
        cTitle    : "Amazonian Companion \u2014 Name Your Stimfay",
        cDefault  : "",
        cLabel    : "Stimfay Name"
    });
    if (stimfayName === null) {
        console.println("OotD Patch: Stimfay naming cancelled. Using default name.");
        stimfayName = "Stimfay";
    } else {
        stimfayName = stimfayName.trim().length > 0 ? stimfayName.trim() : "Stimfay";
    }

    // Appearance prompt
    var appearances = ["Eagle", "Harrier", "Hawk", "Kite", "Osprey", "Owl", "Archaeopteryx"];
    var appearanceQ =
        "Choose your Stimfay's appearance:\n\n" +
        "  1 = Eagle\n  2 = Harrier\n  3 = Hawk\n  4 = Kite\n" +
        "  5 = Osprey\n  6 = Owl\n  7 = Archaeopteryx\n\n" +
        "(Default: Hawk)\n\n" +
        "Note: Appearance does not affect abilities, but influences personality.";
    var appearanceChoice = app.response({
        cQuestion : appearanceQ,
        cTitle    : "Amazonian Companion \u2014 Stimfay Appearance",
        cDefault  : "3",
        cLabel    : "Appearance (1-7)"
    });
    var stimfayAppearance = "Hawk";
    if (appearanceChoice === null) {
        console.println("OotD Patch: Appearance selection cancelled. Defaulting to Hawk.");
    } else {
        var trimmed = appearanceChoice.trim();
        var idx = parseInt(trimmed);
        if (!isNaN(idx) && idx >= 1 && idx <= 7) {
            stimfayAppearance = appearances[idx - 1];
        } else {
            for (var j = 0; j < appearances.length; j++) {
                if (trimmed.toLowerCase() === appearances[j].toLowerCase()) {
                    stimfayAppearance = appearances[j];
                    break;
                }
            }
        }
    }

    // Persist appearance so the notes refresh hook can read it back on level-up
    try {
        if (typeof CurrentVars !== "undefined") CurrentVars[OOTD_AC_APPEARANCE_VAR_KEY] = stimfayAppearance;
    } catch(e) {}

    // Write name to Comp.Desc.Name
    try {
        Value(prefix + "Comp.Desc.Name", stimfayName);
        console.println("OotD Patch: Wrote Stimfay name to Comp.Desc.Name: " + stimfayName);
    } catch(e) {
        console.println("OotD Patch Warning: Could not write Stimfay name: " + e);
    }

    // Write notes to companion sheet
    ootdWriteStimfayNotes(prefix, stimfayName, stimfayAppearance);

    // Success alert
    app.alert({
        cMsg   : stimfayName + " has been added to your companion page.\n\n" +
                 "Appearance: " + stimfayAppearance + "\n\n" +
                 "Name and appearance details have been written to the companion's Notes section.\n" +
                 "Please review the companion page to verify the stat block populated correctly.",
        cTitle : "Stimfay Companion Added",
        nIcon  : 3
    });
    console.println("OotD Patch: Stimfay set up — Name: " + stimfayName + ", Appearance: " + stimfayAppearance);
};

// ── COMPANION MANAGEMENT FUNCTIONS ────────────────────────────
// Define the companion management functions
// These are the same as the functions the OotD script *should* have defined,
// but with defensive guards against being called in unexpected states.

var ootdCompanionFunctions = {
    add : function (compName) {
        // Add a companion to the AScomp template
        if (typeof isTemplVis !== "function" || typeof DoTemplate !== "function") {
            console.println("OotD Patch: AScomp template functions not available");
            return false;
        }
        var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
        var prefix = false;
        if (AScompA) {
            for (var a = 1; a < AScompA.length; a++) {
                if (!What(AScompA[a] + 'Comp.Race')) {
                    prefix = AScompA[a];
                    break;
                }
            }
        }
        if (!prefix) prefix = DoTemplate('AScomp', 'Add');
        if (!prefix) {
            console.println("OotD Patch: Failed to add companion template for " + compName);
            return false;
        }
        Value(prefix + 'Comp.Race', compName);
        var changeMsg = "The " + compName + " has been added to the companion page";
        if (typeof CurrentUpdates !== "undefined" && CurrentUpdates) {
            if (CurrentUpdates.types && CurrentUpdates.types.indexOf("notes") === -1) {
                CurrentUpdates.types.push("notes");
            }
            if (!CurrentUpdates.notesChanges) {
                CurrentUpdates.notesChanges = [changeMsg];
            } else {
                CurrentUpdates.notesChanges.push(changeMsg);
            }
        }
        // Stimfay-specific setup: naming, appearance, and notes.
        if (compName.toLowerCase().indexOf("stimfay") !== -1) {
            ootdSetupStimfay(prefix);
        }
        return prefix;
    },
    remove : function (compName) {
        if (typeof isTemplVis !== "function" || typeof DoTemplate !== "function") return;
        var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
        if (!AScompA) return;
        compName = compName.toLowerCase();
        for (var a = 1; a < AScompA.length; a++) {
            if (What(AScompA[a] + 'Comp.Race').toLowerCase().indexOf(compName) !== -1) {
                DoTemplate("AScomp", "Remove", AScompA[a], true);
            }
        }
    },
    find : function (compName) {
        var prefixes = [];
        if (typeof isTemplVis !== "function") return prefixes;
        var AScompA = isTemplVis('AScomp') ? What('Template.extras.AScomp').split(',') : false;
        if (!AScompA) return prefixes;
        compName = compName.toLowerCase();
        for (var a = 1; a < AScompA.length; a++) {
            if (What(AScompA[a] + 'Comp.Race').toLowerCase().indexOf(compName) !== -1) {
                prefixes.push(AScompA[a]);
            }
        }
        return prefixes;
    }
};

// Apply the patch to all relevant ClassList entries
// We do this defensively: only set if the property doesn't already exist or is broken

// Patch the paladin (always)
if (typeof ClassList !== "undefined" && ClassList.paladin) {
    if (!ClassList.paladin.artificerCompFunc || typeof ClassList.paladin.artificerCompFunc.add !== "function") {
        ClassList.paladin.artificerCompFunc = ootdCompanionFunctions;
        console.println("OotD Patch: Defined ClassList.paladin.artificerCompFunc");
    }
}

// Patch the artificer if it exists (covers the TCoE-enabled case)
if (typeof ClassList !== "undefined" && ClassList.artificer) {
    if (!ClassList.artificer.artificerCompFunc || typeof ClassList.artificer.artificerCompFunc.add !== "function") {
        ClassList.artificer.artificerCompFunc = ootdCompanionFunctions;
        console.println("OotD Patch: Defined ClassList.artificer.artificerCompFunc");
    }
}

// ── NOTES REFRESH HOOK ────────────────────────────────────────
// Wrap ClassList.ranger.amazonCompFunc.update so that whenever the OotD
// script refreshes the Stimfay's stats (at level 3 and level 11),
// companion notes are also rewritten to reflect the current level.

if (typeof ClassList !== "undefined" && ClassList.ranger && ClassList.ranger.amazonCompFunc &&
    typeof ClassList.ranger.amazonCompFunc.update === "function") {
    var ootdOriginalAmazonUpdate = ClassList.ranger.amazonCompFunc.update;
    ClassList.ranger.amazonCompFunc.update = function(rangerLevel, profBonus) {
        ootdOriginalAmazonUpdate.call(this, rangerLevel, profBonus);
        var compFunc = ootdCompanionFunctions;
        var prefixes = compFunc.find("stimfay");
        if (prefixes.length === 0) return;
        var prefix = prefixes[0];
        var stimfayName = "Stimfay";
        try { stimfayName = String(What(prefix + "Comp.Desc.Name") || "Stimfay").trim() || "Stimfay"; } catch(e) {}
        var stimfayAppearance = "Unknown";
        try {
            if (typeof CurrentVars !== "undefined" && CurrentVars[OOTD_AC_APPEARANCE_VAR_KEY])
                stimfayAppearance = CurrentVars[OOTD_AC_APPEARANCE_VAR_KEY];
        } catch(e) {}
        ootdWriteStimfayNotes(prefix, stimfayName, stimfayAppearance);
        console.println("OotD Patch: Refreshed Stimfay notes at ranger level " + rangerLevel);
    };
    console.println("OotD Patch: Extended amazonCompFunc.update with notes refresh.");
} else {
    console.println("OotD Patch Warning: ClassList.ranger.amazonCompFunc not found. Notes will not auto-refresh on level-up.");
}