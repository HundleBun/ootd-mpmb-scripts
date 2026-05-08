/*  -INFORMATION-

    Subject:    OotD Diagnostic Script
    Effect:     Two-layer diagnostic tool for the OotD MPMB scripts.

                Layer 1 — OotD Script Health (auto-run on load):
                  Verifies the three OotD production scripts are loaded and
                  functioning. Checks are OotD-specific (Crown, dragon companion,
                  epic paths). Output is labeled [HEALTH].

                Layer 2 — General Diagnostic Utilities:
                  Reusable field investigation tools that work for any companion
                  type, class, race, or sheet area. Not OotD-specific.
                  Output is labeled [UTIL].

                HOW TO USE LAYER 2 UTILITIES:
                  Acrobat 2026 isolates each document-level script's variable
                  scope, so utility functions cannot be called directly from the
                  JS console. Instead, set the CONFIG variables below and reload
                  the PDF — the functions run at load time using those values.
                  The JS console (Ctrl+J) is for reading output only. To execute
                  a snippet in the console, highlight it and press Ctrl+Enter.

                WORKFLOW: Start general, get specific.
                  1. Unknown problem? Set OOTD_DIAG_SCAN = "keyword" and reload.
                     Finds real field names for any area of the sheet.
                  2. Companion issue? Set OOTD_DIAG_COMPANION = "creature name".
                     Works for any creature: dragon, stimfay, panther, etc.
                  3. Known area? Set OOTD_DIAG_LIMITED or OOTD_DIAG_CVARS.

    Requires:   None. Works standalone. Degrades gracefully if production
                scripts are not loaded — reports WARN rather than erroring.
    Sheet:      v13.2.0+
    Load order: After OotD_AmazonianFix.js, OotD_GiftedOneDragon.js,
                OotD_EpicPaths.js. The Z prefix ensures alphabetical sort
                places this last in MPMB's script loader.
                OPTIONAL — load only when troubleshooting.

    Full version history: see CHANGELOG.md in the repo root.
*/

var iFileName = "OotD_ZDiagnostic.js";
RequiredSheetVersion("13.2.0");

// Capture document reference at load time.
// Utility functions use _ootdDiagDoc for numFields/getNthFieldName because
// 'this' at call time may not be the PDF document in all execution contexts.
var _ootdDiagDoc = this;


// ══════════════════════════════════════════════════════════════
// DIAGNOSTIC CONFIGURATION
// Edit these values and reload the PDF to run Layer 2 utilities.
// All values reset to their defaults (disabled) on each load.
// ══════════════════════════════════════════════════════════════

// Set to a creature name to enumerate that companion's fields.
// Examples: "young bronze dragon"  "stimfay"  "panther"
var OOTD_DIAG_COMPANION = "";

// Set to a keyword to scan all PDF fields whose names contain it.
// Examples: "Cnote"  "Spell Slot"  "Background"  "Limited Feature"
var OOTD_DIAG_SCAN = "";

// Set to true to enumerate all Limited Feature fields with WARN on incomplete slots.
var OOTD_DIAG_LIMITED = false;

// Set to true to dump OotD dragon state stored in CurrentVars.
var OOTD_DIAG_CVARS = false;


// ══════════════════════════════════════════════════════════════
// LAYER 2 — GENERAL DIAGNOSTIC UTILITIES
// Defined before Layer 1 so they are available during auto-run.
// Call via CONFIG block above, not from the JS console directly.
// ══════════════════════════════════════════════════════════════

// ── ootdDiagHelp ──────────────────────────────────────────────
// Prints all CONFIG variables with usage guidance.

var ootdDiagHelp = function() {
    var U = "OotD-DIAG [UTIL] ";
    console.println(U + "========================================");
    console.println(U + "OotD Diagnostic Utilities — Layer 2");
    console.println(U + "----------------------------------------");
    console.println(U + "IMPORTANT: Acrobat 2026 prevents calling these");
    console.println(U + "functions from the JS console. Use the CONFIG block");
    console.println(U + "at the top of OotD_ZDiagnostic.js instead:");
    console.println(U + "  1. Open OotD_ZDiagnostic.js in a text editor.");
    console.println(U + "  2. Set the CONFIG variable for what you need.");
    console.println(U + "  3. Save the file and reload the PDF.");
    console.println(U + "  4. Check the console output (Ctrl+J).");
    console.println(U + "  5. Reset the variable to \"\" or false when done.");
    console.println(U + "----------------------------------------");
    console.println(U + "CONFIG VARIABLES:");
    console.println(U + "  OOTD_DIAG_COMPANION = \"creature name\"");
    console.println(U + "    Enumerate all fields on any companion page.");
    console.println(U + "    e.g. \"young bronze dragon\", \"stimfay\", \"panther\"");
    console.println(U + "    First tool for any companion-related problem.");
    console.println(U + "  OOTD_DIAG_SCAN = \"keyword\"");
    console.println(U + "    Scan ALL PDF fields whose names contain keyword.");
    console.println(U + "    e.g. \"Cnote\", \"Spell Slot\", \"Limited Feature\"");
    console.println(U + "    First tool for any unknown field-related problem.");
    console.println(U + "  OOTD_DIAG_LIMITED = true");
    console.println(U + "    Enumerate all Limited Feature fields.");
    console.println(U + "    Warns on slots with a name but missing Max/Recovery.");
    console.println(U + "  OOTD_DIAG_CVARS = true");
    console.println(U + "    Show OotD dragon state in CurrentVars.");
    console.println(U + "========================================");
    console.println(U + "JS Console tip: the console is read-only output.");
    console.println(U + "To execute a snippet, highlight it and Ctrl+Enter.");
    console.println(U + "========================================");
};


// ── ootdDiagScanFields ────────────────────────────────────────
// Scans ALL PDF fields for names containing the given pattern.
// Case-insensitive. First tool for any unknown field-related problem.

var ootdDiagScanFields = function(pattern) {
    var U = "OotD-DIAG [UTIL] ";
    if (!pattern) {
        console.println(U + "OOTD_DIAG_SCAN requires a non-empty keyword string.");
        return;
    }
    var lower = pattern.toLowerCase();
    var count = 0;
    console.println(U + "Scanning " + _ootdDiagDoc.numFields + " fields for: \"" + pattern + "\"");
    for (var fi = 0; fi < _ootdDiagDoc.numFields; fi++) {
        var fn = _ootdDiagDoc.getNthFieldName(fi);
        if (fn.toLowerCase().indexOf(lower) !== -1) {
            var fval = "";
            try { fval = String(What(fn) || ""); } catch(e) { fval = "READ_ERR"; }
            console.println(U + "  [" + count + "] " + fn +
                " = '" + (fval.length > 60 ? fval.substring(0, 60) + "..." : fval) + "'");
            count++;
        }
    }
    console.println(U + count + " matching fields found.");
};


// ── ootdDiagCompanion ─────────────────────────────────────────
// Enumerates all PDF fields on any companion page.
// Pass any creature name — dragon, stimfay, ranger companion, etc.

var ootdDiagCompanion = function(creatureName) {
    var U = "OotD-DIAG [UTIL] ";
    if (!creatureName) {
        console.println(U + "OOTD_DIAG_COMPANION requires a non-empty creature name string.");
        return;
    }
    // Use MPMB's ClassList directly — do not call ootdGetCompanionFunctions()
    // which is scoped to GiftedOneDragon.js and unavailable here.
    var compFunc = null;
    try {
        if (typeof ClassList !== "undefined") {
            if (ClassList.paladin && ClassList.paladin.artificerCompFunc &&
                typeof ClassList.paladin.artificerCompFunc.find === "function") {
                compFunc = ClassList.paladin.artificerCompFunc;
            } else if (ClassList.artificer && ClassList.artificer.artificerCompFunc &&
                       typeof ClassList.artificer.artificerCompFunc.find === "function") {
                compFunc = ClassList.artificer.artificerCompFunc;
            }
        }
    } catch(e) {}
    if (!compFunc) {
        console.println(U + "Companion functions unavailable. Ensure OotD_AmazonianFix.js is loaded.");
        return;
    }
    var found = [];
    try { found = compFunc.find(creatureName) || []; } catch(e) {}
    if (!found || found.length === 0) {
        console.println(U + "Creature not found on sheet: \"" + creatureName + "\"");
        console.println(U + "Check spelling — creature names are case-insensitive in find().");
        return;
    }
    var prefix = found[0];
    console.println(U + "Companion: \"" + creatureName + "\"");
    console.println(U + "Prefix: " + prefix);
    var count = 0;
    for (var fi = 0; fi < _ootdDiagDoc.numFields; fi++) {
        var fn = _ootdDiagDoc.getNthFieldName(fi);
        if (fn.indexOf(prefix) === 0) {
            var shortName = fn.substring(prefix.length);
            var fval = "";
            try { fval = String(What(fn) || ""); } catch(e) { fval = "READ_ERR"; }
            console.println(U + "  FIELD [" + count + "] " + shortName +
                " = '" + (fval.length > 60 ? fval.substring(0, 60) + "..." : fval) + "'");
            count++;
        }
    }
    console.println(U + count + " fields found under prefix " + prefix);
};


// ── ootdDiagLimitedFeatures ───────────────────────────────────
// Enumerates all Limited Feature fields and warns on incomplete slots.

var ootdDiagLimitedFeatures = function() {
    var U = "OotD-DIAG [UTIL] ";
    console.println(U + "Scanning Limited Feature fields...");
    var count = 0;
    for (var fi = 0; fi < _ootdDiagDoc.numFields; fi++) {
        var fn = _ootdDiagDoc.getNthFieldName(fi);
        var fnLower = fn.toLowerCase();
        if (fn.indexOf("Limited Feature") === 0 || fnLower.indexOf("limfea") !== -1) {
            var fval = "";
            try { fval = String(What(fn) || ""); } catch(e) { fval = "READ_ERR"; }
            console.println(U + "  [" + count + "] " + fn + " = '" + fval + "'");
            count++;
        }
    }
    // WARN check: slots with a name but missing Max Usages or Recovery
    for (var slot = 1; slot <= 20; slot++) {
        var nameVal = "";
        try { nameVal = String(What("Limited Feature " + slot) || ""); } catch(e) {}
        if (nameVal.trim()) {
            var maxVal = "";
            var recVal = "";
            try { maxVal = String(What("Limited Feature Max Usages " + slot) || ""); } catch(e) {}
            try { recVal = String(What("Limited Feature Recovery " + slot) || ""); } catch(e) {}
            if (!maxVal.trim() || !recVal.trim()) {
                console.println(U + "  WARN: Slot " + slot + " (\"" + nameVal + "\") has a name but is missing: " +
                    (!maxVal.trim() ? "Max Usages " : "") + (!recVal.trim() ? "Recovery" : ""));
            }
        }
    }
    console.println(U + count + " Limited Feature fields found.");
};


// ── ootdDiagCurrentVars ───────────────────────────────────────
// Prints OotD dragon state persisted in CurrentVars.

var ootdDiagCurrentVars = function() {
    var U = "OotD-DIAG [UTIL] ";
    console.println(U + "OotD CurrentVars state:");
    if (typeof CurrentVars === "undefined" || !CurrentVars) {
        console.println(U + "  CurrentVars unavailable.");
        return;
    }
    var keys = ["ootdGD_dragonName", "ootdGD_dragonType", "ootdGD_lastLevel"];
    for (var i = 0; i < keys.length; i++) {
        var v = CurrentVars[keys[i]];
        console.println(U + "  " + keys[i] + " = " + (v !== undefined ? v : "(not set)"));
    }
};


// ══════════════════════════════════════════════════════════════
// LAYER 1 — OOTD SCRIPT HEALTH CHECK (AUTO-RUN ON LOAD)
// These checks are specific to the three OotD production scripts.
// Uses only MPMB global objects (ClassList, MagicItemsList, etc.)
// — does NOT call var-scoped functions from other script files,
// which are unavailable here due to Acrobat 2026 scope isolation.
// ══════════════════════════════════════════════════════════════

(function() {
    var H = "OotD-DIAG [HEALTH] ";
    var U = "OotD-DIAG [UTIL]   ";

    // Pads label to fixed width with dots for aligned columns.
    var pad = function(str, width) {
        str = str + " ";
        while (str.length < width) str += ".";
        return str + " ";
    };
    var W = 33; // label column width

    console.println(H + "============================================");

    // ── 1. AmazonianFix ──────────────────────────────────────
    try {
        var cf = null;
        if (typeof ClassList !== "undefined") {
            if (ClassList.paladin && ClassList.paladin.artificerCompFunc)
                cf = ClassList.paladin.artificerCompFunc;
            else if (ClassList.artificer && ClassList.artificer.artificerCompFunc)
                cf = ClassList.artificer.artificerCompFunc;
        }
        if (cf && typeof cf.add === "function" &&
                  typeof cf.remove === "function" &&
                  typeof cf.find === "function") {
            console.println(H + pad("AmazonianFix", W) + "PASS");
        } else {
            console.println(H + pad("AmazonianFix", W) + "FAIL [artificerCompFunc missing or incomplete]");
        }
    } catch(e) { console.println(H + pad("AmazonianFix", W) + "FAIL [" + e + "]"); }

    // ── 2. Crown of the Dragonlords extensions ────────────────
    // Also used as the indicator that GiftedOneDragon.js loaded —
    // the script extends the Crown with calcChanges on load.
    var crown = null;
    var giftedOneLoaded = false;
    try {
        crown = (typeof MagicItemsList !== "undefined") ? MagicItemsList["crown of the dragonlords"] : null;
        if (!crown) {
            console.println(H + pad("Crown extensions", W) + "FAIL [Crown not in MagicItemsList — base OotD script not loaded?]");
        } else {
            var sc  = crown["spellcaster"];
            var nsc = crown["non-spellcaster"];
            var scOk  = !!(sc  && sc.eval  && sc.calcChanges);
            var nscOk = !!(nsc && nsc.eval && nsc.calcChanges);
            giftedOneLoaded = scOk && nscOk;
            if (scOk && nscOk) {
                console.println(H + pad("Crown extensions", W) + "PASS");
            } else {
                var crownMissing = (!scOk ? "spellcaster " : "") + (!nscOk ? "non-spellcaster" : "");
                console.println(H + pad("Crown extensions", W) + "WARN [eval/calcChanges not applied on: " + crownMissing.trim() + "]");
            }
        }
    } catch(e) { console.println(H + pad("Crown extensions", W) + "FAIL [" + e + "]"); }

    // ── 3. EpicPaths feats ────────────────────────────────────
    try {
        var giftedOk   = (typeof FeatsList !== "undefined") && !!FeatsList["epic path: gifted one"];
        var blessingOk = (typeof FeatsList !== "undefined") && !!FeatsList["blessing of the dragonlords"];
        if (giftedOk && blessingOk) {
            console.println(H + pad("EpicPaths feats", W) + "PASS");
        } else {
            var epicMissing = (!giftedOk ? "\"epic path: gifted one\" " : "") +
                              (!blessingOk ? "\"blessing of the dragonlords\"" : "");
            console.println(H + pad("EpicPaths feats", W) + "WARN [not defined: " + epicMissing.trim() + "]");
        }
    } catch(e) { console.println(H + pad("EpicPaths feats", W) + "FAIL [" + e + "]"); }

    // ── 4. Dirge spell ────────────────────────────────────────
    try {
        var dirgeOk = (typeof SpellsList !== "undefined") && !!SpellsList["dirge of the dragonlords"];
        console.println(H + pad("Dirge spell", W) + (dirgeOk ? "PASS" : "WARN [not defined — EpicPaths not loaded?]"));
    } catch(e) { console.println(H + pad("Dirge spell", W) + "FAIL [" + e + "]"); }

    // ── 5–8. Dragon companion checks ──────────────────────────
    // Inline dragon search using ClassList MPMB global — does NOT call
    // ootdFindDragonCompanion() which is scoped to GiftedOneDragon.js.
    var dragon = false;
    if (!giftedOneLoaded) {
        console.println(H + pad("Dragon bonded", W) + "WARN [Crown extensions absent — GiftedOneDragon not loaded?]");
        console.println(H + pad("Dragon HP", W)     + "N/A");
        console.println(H + pad("Dragon name", W)   + "N/A");
        console.println(H + pad("Dragon notes", W)  + "N/A");
    } else {
        var diagCF = null;
        try {
            if (typeof ClassList !== "undefined") {
                if (ClassList.paladin && ClassList.paladin.artificerCompFunc &&
                    typeof ClassList.paladin.artificerCompFunc.find === "function") {
                    diagCF = ClassList.paladin.artificerCompFunc;
                } else if (ClassList.artificer && ClassList.artificer.artificerCompFunc &&
                           typeof ClassList.artificer.artificerCompFunc.find === "function") {
                    diagCF = ClassList.artificer.artificerCompFunc;
                }
            }
        } catch(e) {}

        if (diagCF) {
            var diagTypes = [
                {type: "brass",  stages: ["brass dragon wyrmling", "young brass dragon"]},
                {type: "bronze", stages: ["bronze dragon wyrmling", "young bronze dragon"]},
                {type: "copper", stages: ["copper dragon wyrmling", "young copper dragon"]},
                {type: "silver", stages: ["silver dragon wyrmling", "young silver dragon"]}
            ];
            var dragonFound = false;
            for (var dt = 0; dt < diagTypes.length && !dragonFound; dt++) {
                for (var ds = 0; ds < diagTypes[dt].stages.length && !dragonFound; ds++) {
                    try {
                        var stageFound = diagCF.find(diagTypes[dt].stages[ds]);
                        if (stageFound && stageFound.length > 0) {
                            dragon = {
                                prefix: stageFound[0],
                                type: diagTypes[dt].type,
                                stage: ds === 0 ? "wyrmling" : "young"
                            };
                            dragonFound = true;
                        }
                    } catch(e) {}
                }
            }
        }

        if (dragon) {
            console.println(H + pad("Dragon bonded", W) + "PASS [" + dragon.type + " / " + dragon.stage + "]");

            // HP — inline formula: 40 + (2 × total level)
            try {
                var totalLvl = (typeof classes !== "undefined" && classes.totallevel) ? classes.totallevel : 0;
                var expectedHP = 40 + (2 * totalLvl);
                var actualHP   = String(What(dragon.prefix + "Comp.Use.HP.Max") || "");
                if (actualHP) {
                    var hpMatch = (parseInt(actualHP) === expectedHP);
                    console.println(H + pad("Dragon HP", W) + (hpMatch ? "PASS" : "WARN") +
                        " [" + actualHP + " / expected " + expectedHP + "]");
                } else {
                    console.println(H + pad("Dragon HP", W) + "WARN [Comp.Use.HP.Max is empty]");
                }
            } catch(e) { console.println(H + pad("Dragon HP", W) + "FAIL [" + e + "]"); }

            // Name
            try {
                var dName = String(What(dragon.prefix + "Comp.Desc.Name") || "");
                if (dName.trim()) {
                    console.println(H + pad("Dragon name", W) + "PASS [" + dName + "]");
                } else {
                    console.println(H + pad("Dragon name", W) + "WARN [Comp.Desc.Name is empty]");
                }
            } catch(e) { console.println(H + pad("Dragon name", W) + "FAIL [" + e + "]"); }

            // Notes — hardcode header string; OOTD_GD_NOTES_HEADER is not in scope here
            try {
                var notesHeader = "=== DRAGON COMPANION (GIFTED ONE) ===";
                var cnote = String(What(dragon.prefix + "Cnote.Left") || "");
                if (cnote.indexOf(notesHeader) !== -1) {
                    console.println(H + pad("Dragon notes", W) + "PASS");
                } else {
                    console.println(H + pad("Dragon notes", W) + "WARN [Cnote.Left missing script header]");
                }
            } catch(e) { console.println(H + pad("Dragon notes", W) + "FAIL [" + e + "]"); }

        } else {
            console.println(H + pad("Dragon bonded", W) + "N/A [no dragon on sheet]");
            console.println(H + pad("Dragon HP", W)     + "N/A");
            console.println(H + pad("Dragon name", W)   + "N/A");
            console.println(H + pad("Dragon notes", W)  + "N/A");
        }
    }

    // ── 9. Unbreakable Bond (level 20) ────────────────────────
    try {
        var totalLevel = (typeof classes !== "undefined" && classes.totallevel) ? classes.totallevel : 0;
        if (totalLevel >= 20) {
            var bondName = "Dragon Auto-Succeed (Unbreakable Bond)";
            var bondSlot = -1;
            for (var lf = 1; lf <= 20; lf++) {
                try {
                    var en = String(What("Limited Feature " + lf) || "");
                    if (en.indexOf(bondName) !== -1) { bondSlot = lf; break; }
                } catch(e) {}
            }
            if (bondSlot > 0) {
                var bMax = String(What("Limited Feature Max Usages " + bondSlot) || "");
                var bRec = String(What("Limited Feature Recovery " + bondSlot) || "");
                var bondOk = bMax.trim() && bRec.trim();
                console.println(H + pad("Unbreakable Bond", W) + (bondOk ? "PASS" : "WARN") +
                    " [slot " + bondSlot + ", max=" + (bMax || "empty") + ", recovery=" + (bRec || "empty") + "]");
            } else {
                console.println(H + pad("Unbreakable Bond", W) + "WARN [level 20 but feature not found in slots 1-20]");
            }
        } else {
            console.println(H + pad("Unbreakable Bond", W) + "N/A [level " + totalLevel + ", need 20]");
        }
    } catch(e) { console.println(H + pad("Unbreakable Bond", W) + "FAIL [" + e + "]"); }

    // ── 10. CurrentVars state ─────────────────────────────────
    try {
        if (typeof CurrentVars !== "undefined" && CurrentVars) {
            var cvName = CurrentVars["ootdGD_dragonName"] || "(not set)";
            var cvType = CurrentVars["ootdGD_dragonType"] || "(not set)";
            var cvLvl  = CurrentVars["ootdGD_lastLevel"]  || "(not set)";
            console.println(H + pad("CurrentVars", W) + cvType + " / " + cvName + " / lvl " + cvLvl);
        } else {
            console.println(H + pad("CurrentVars", W) + "WARN [CurrentVars unavailable]");
        }
    } catch(e) { console.println(H + pad("CurrentVars", W) + "FAIL [" + e + "]"); }

    console.println(H + "============================================");
    console.println(H + "NOTE: [HEALTH] checks are OotD-specific.");
    console.println(H + "For additional field investigation, edit the");
    console.println(H + "CONFIG block in OotD_ZDiagnostic.js and reload:");
    console.println(U + "OOTD_DIAG_COMPANION = \"creature name\"");
    console.println(U + "OOTD_DIAG_SCAN      = \"field keyword\"");
    console.println(U + "OOTD_DIAG_LIMITED   = true");
    console.println(U + "OOTD_DIAG_CVARS     = true");
    console.println(H + "JS console is read-only output. To execute a");
    console.println(H + "snippet: highlight it and press Ctrl+Enter (Win).");
    console.println(H + "============================================");
})();


// ── CONFIG-DRIVEN UTILITY RUNS ────────────────────────────────
// These run at load time if the CONFIG variables above are set.
// Acrobat 2026 scope isolation prevents calling them from the console.
if (OOTD_DIAG_COMPANION) ootdDiagCompanion(OOTD_DIAG_COMPANION);
if (OOTD_DIAG_SCAN)      ootdDiagScanFields(OOTD_DIAG_SCAN);
if (OOTD_DIAG_LIMITED)   ootdDiagLimitedFeatures();
if (OOTD_DIAG_CVARS)     ootdDiagCurrentVars();

console.println("OotD-DIAG: Diagnostic script loaded (v1.1.0).");
console.println("OotD-DIAG: Edit the CONFIG block at the top of OotD_ZDiagnostic.js");
console.println("OotD-DIAG: to run field investigation utilities, then reload the PDF.");
