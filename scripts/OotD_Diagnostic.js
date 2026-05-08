/*  -INFORMATION-

    Subject:    OotD Diagnostic Script
    Effect:     Two-layer diagnostic tool for the OotD MPMB scripts.

                Layer 1 — OotD Script Health (auto-run on load):
                  Verifies the three OotD production scripts are loaded and
                  functioning. Checks are OotD-specific (Crown, dragon companion,
                  epic paths). Output is labeled [HEALTH].

                Layer 2 — General Diagnostic Utilities (console-callable):
                  Reusable field investigation tools that work for any companion
                  type, class, race, or sheet area. Not OotD-specific.
                  Output is labeled [UTIL].

                WORKFLOW: Start general, get specific.
                  1. Unknown problem? Call ootdDiagScanFields("keyword") first.
                     Finds real field names for any area of the sheet.
                  2. Companion issue? Call ootdDiagCompanion("creature name").
                     Works for any creature: dragon, stimfay, panther, etc.
                  3. Known area? Call the specific function directly.
                  Type ootdDiagHelp() in the console for the full function list.

    Requires:   None. Works standalone. Degrades gracefully if production
                scripts are not loaded — reports UNAVAILABLE rather than erroring.
    Sheet:      v13.2.0+
    Load order: After OotD_AmazonianFix.js, OotD_GiftedOneDragon.js,
                OotD_EpicPaths.js. OPTIONAL — load only when troubleshooting.

    Full version history: see CHANGELOG.md in the repo root.
*/

var iFileName = "OotD_Diagnostic.js";
RequiredSheetVersion("13.2.0");

// Capture document reference at load time.
// Console-callable functions use _ootdDiagDoc instead of 'this' because
// 'this' in the console execution context refers to the global object, not
// the PDF document. Capturing here (at document-script load time) preserves
// the correct reference.
var _ootdDiagDoc = this;


// ══════════════════════════════════════════════════════════════
// LAYER 2 — GENERAL DIAGNOSTIC UTILITIES
// Defined before Layer 1 so they are available during auto-run.
// ══════════════════════════════════════════════════════════════

// ── ootdDiagHelp ──────────────────────────────────────────────
// Prints all available console functions with usage guidance.
// Start here if you don't know which tool to use.

var ootdDiagHelp = function() {
    var U = "OotD-DIAG [UTIL] ";
    console.println(U + "========================================");
    console.println(U + "OotD Diagnostic Utilities");
    console.println(U + "----------------------------------------");
    console.println(U + "WORKFLOW: Start general, get specific.");
    console.println(U + "  1. Unknown problem? Use ootdDiagScanFields() first.");
    console.println(U + "     Enumerates every PDF field matching a keyword.");
    console.println(U + "     Tells you what fields actually exist before guessing.");
    console.println(U + "  2. Companion issue? Use ootdDiagCompanion().");
    console.println(U + "     Works for any creature on any companion page.");
    console.println(U + "  3. Known area? Call the specific function directly.");
    console.println(U + "----------------------------------------");
    console.println(U + "FUNCTIONS:");
    console.println(U + "  ootdDiagHelp()");
    console.println(U + "    Show this help.");
    console.println(U + "  ootdDiagScanFields(\"pattern\")");
    console.println(U + "    Scan ALL PDF fields for names containing pattern.");
    console.println(U + "    Examples: ootdDiagScanFields(\"Cnote\")");
    console.println(U + "             ootdDiagScanFields(\"Spell Slot\")");
    console.println(U + "             ootdDiagScanFields(\"Background\")");
    console.println(U + "             ootdDiagScanFields(\"Limited Feature\")");
    console.println(U + "  ootdDiagCompanion(\"creature name\")");
    console.println(U + "    Enumerate all fields on a companion page.");
    console.println(U + "    Examples: ootdDiagCompanion(\"young bronze dragon\")");
    console.println(U + "             ootdDiagCompanion(\"stimfay\")");
    console.println(U + "             ootdDiagCompanion(\"panther\")");
    console.println(U + "  ootdDiagLimitedFeatures()");
    console.println(U + "    Enumerate all Limited Feature fields.");
    console.println(U + "    Warns on slots with a name but missing Max Usages or Recovery.");
    console.println(U + "  ootdDiagCurrentVars()");
    console.println(U + "    Show OotD dragon state persisted in CurrentVars.");
    console.println(U + "========================================");
};


// ── ootdDiagScanFields ────────────────────────────────────────
// Scans ALL PDF fields for names containing the given pattern.
// Case-insensitive. This is the first tool for any unknown problem.

var ootdDiagScanFields = function(pattern) {
    var U = "OotD-DIAG [UTIL] ";
    if (!pattern) {
        console.println(U + "Usage: ootdDiagScanFields(\"keyword\")");
        console.println(U + "Scans all PDF fields for names matching keyword (case-insensitive).");
        return;
    }
    var lower = pattern.toLowerCase();
    var count = 0;
    console.println(U + "Scanning " + _ootdDiagDoc.numFields + " fields for: \"" + pattern + "\"");
    for (var fi = 0; fi < _ootdDiagDoc.numFields; fi++) {
        var fn = _ootdDiagDoc.getNthFieldName(fi);
        if (fn.toLowerCase().indexOf(lower) !== -1) {
            var fval = "";
            try { fval = What(fn) || ""; } catch(e) { fval = "READ_ERR"; }
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
        console.println(U + "Usage: ootdDiagCompanion(\"creature name\")");
        console.println(U + "Examples: ootdDiagCompanion(\"young bronze dragon\")");
        console.println(U + "          ootdDiagCompanion(\"stimfay\")");
        return;
    }
    var compFunc = null;
    try {
        if (typeof ootdGetCompanionFunctions === "function") {
            compFunc = ootdGetCompanionFunctions();
        } else if (typeof ClassList !== "undefined") {
            if (ClassList.artificer && ClassList.artificer.artificerCompFunc &&
                typeof ClassList.artificer.artificerCompFunc.find === "function") {
                compFunc = ClassList.artificer.artificerCompFunc;
            } else if (ClassList.paladin && ClassList.paladin.artificerCompFunc &&
                       typeof ClassList.paladin.artificerCompFunc.find === "function") {
                compFunc = ClassList.paladin.artificerCompFunc;
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
        console.println(U + "Check spelling. Creature names are case-insensitive.");
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
            try { fval = What(fn) || ""; } catch(e) { fval = "READ_ERR"; }
            console.println(U + "  FIELD [" + count + "] " + shortName +
                " = '" + (fval.length > 60 ? fval.substring(0, 60) + "..." : fval) + "'");
            count++;
        }
    }
    console.println(U + count + " fields found under prefix " + prefix);
};


// ── ootdDiagLimitedFeatures ───────────────────────────────────
// Enumerates all Limited Feature fields and warns on incomplete slots
// (name written but Max Usages or Recovery missing).

var ootdDiagLimitedFeatures = function() {
    var U = "OotD-DIAG [UTIL] ";
    console.println(U + "Scanning Limited Feature fields...");
    var count = 0;
    for (var fi = 0; fi < _ootdDiagDoc.numFields; fi++) {
        var fn = _ootdDiagDoc.getNthFieldName(fi);
        var fnLower = fn.toLowerCase();
        if (fn.indexOf("Limited Feature") === 0 || fnLower.indexOf("limfea") !== -1) {
            var fval = "";
            try { fval = What(fn) || ""; } catch(e) { fval = "READ_ERR"; }
            console.println(U + "  [" + count + "] " + fn + " = '" + fval + "'");
            count++;
        }
    }
    // WARN check: find slots with a name but missing Max Usages or Recovery
    for (var slot = 1; slot <= 20; slot++) {
        var nameVal = "";
        try { nameVal = What("Limited Feature " + slot) || ""; } catch(e) {}
        if (nameVal.trim()) {
            var maxVal = "";
            var recVal = "";
            try { maxVal = What("Limited Feature Max Usages " + slot) || ""; } catch(e) {}
            try { recVal = What("Limited Feature Recovery " + slot) || ""; } catch(e) {}
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
// They are not general-purpose tools. See Layer 2 for those.
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
    try {
        var crown = (typeof MagicItemsList !== "undefined") ? MagicItemsList["crown of the dragonlords"] : null;
        if (!crown) {
            console.println(H + pad("Crown extensions", W) + "FAIL [Crown not in MagicItemsList — base OotD script not loaded?]");
        } else {
            var sc  = crown["spellcaster"];
            var nsc = crown["non-spellcaster"];
            var scOk  = sc  && sc.eval  && sc.calcChanges;
            var nscOk = nsc && nsc.eval && nsc.calcChanges;
            if (scOk && nscOk) {
                console.println(H + pad("Crown extensions", W) + "PASS");
            } else {
                var missing = (!scOk ? "spellcaster " : "") + (!nscOk ? "non-spellcaster" : "");
                console.println(H + pad("Crown extensions", W) + "WARN [eval/calcChanges not applied on: " + missing.trim() + "]");
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
            var missing2 = (!giftedOk ? "\"epic path: gifted one\" " : "") +
                           (!blessingOk ? "\"blessing of the dragonlords\"" : "");
            console.println(H + pad("EpicPaths feats", W) + "WARN [not defined: " + missing2.trim() + "]");
        }
    } catch(e) { console.println(H + pad("EpicPaths feats", W) + "FAIL [" + e + "]"); }

    // ── 4. Dirge spell ────────────────────────────────────────
    try {
        var dirgeOk = (typeof SpellsList !== "undefined") && !!SpellsList["dirge of the dragonlords"];
        console.println(H + pad("Dirge spell", W) + (dirgeOk ? "PASS" : "WARN [not defined — EpicPaths not loaded?]"));
    } catch(e) { console.println(H + pad("Dirge spell", W) + "FAIL [" + e + "]"); }

    // ── 5–8. Dragon companion checks ──────────────────────────
    var dragon = false;
    var giftedOneLoaded = (typeof ootdFindDragonCompanion === "function");

    if (!giftedOneLoaded) {
        console.println(H + pad("Dragon bonded", W) + "WARN [GiftedOneDragon script not loaded]");
        console.println(H + pad("Dragon HP", W)     + "WARN [GiftedOneDragon script not loaded]");
        console.println(H + pad("Dragon name", W)   + "WARN [GiftedOneDragon script not loaded]");
        console.println(H + pad("Dragon notes", W)  + "WARN [GiftedOneDragon script not loaded]");
    } else {
        try { dragon = ootdFindDragonCompanion(); } catch(e) {}

        if (dragon) {
            console.println(H + pad("Dragon bonded", W) + "PASS [" + dragon.type + " / " + dragon.stage + "]");

            // HP
            try {
                var expectedHP = (typeof ootdCalcDragonHP === "function") ? ootdCalcDragonHP() : null;
                var actualHP   = What(dragon.prefix + "Comp.Use.HP.Max") || "";
                if (expectedHP !== null && actualHP) {
                    var hpMatch = (parseInt(actualHP) === expectedHP);
                    console.println(H + pad("Dragon HP", W) + (hpMatch ? "PASS" : "WARN") +
                        " [" + actualHP + " / expected " + expectedHP + "]");
                } else {
                    console.println(H + pad("Dragon HP", W) + "WARN [could not read or compare HP]");
                }
            } catch(e) { console.println(H + pad("Dragon HP", W) + "FAIL [" + e + "]"); }

            // Name
            try {
                var dName = What(dragon.prefix + "Comp.Desc.Name") || "";
                if (dName.trim()) {
                    console.println(H + pad("Dragon name", W) + "PASS [" + dName + "]");
                } else {
                    console.println(H + pad("Dragon name", W) + "WARN [Comp.Desc.Name is empty]");
                }
            } catch(e) { console.println(H + pad("Dragon name", W) + "FAIL [" + e + "]"); }

            // Notes
            try {
                var notesHeader = (typeof OOTD_GD_NOTES_HEADER !== "undefined")
                    ? OOTD_GD_NOTES_HEADER : "=== DRAGON COMPANION (GIFTED ONE) ===";
                var cnote = What(dragon.prefix + "Cnote.Left") || "";
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
                    var en = What("Limited Feature " + lf) || "";
                    if (en.indexOf(bondName) !== -1) { bondSlot = lf; break; }
                } catch(e) {}
            }
            if (bondSlot > 0) {
                var bMax = What("Limited Feature Max Usages " + bondSlot) || "";
                var bRec = What("Limited Feature Recovery " + bondSlot) || "";
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
    console.println(H + "For general field investigation, use [UTIL] functions:");
    console.println(U + "ootdDiagHelp()                     -- list all utilities and workflow");
    console.println(U + "ootdDiagCompanion(\"creature name\")  -- enumerate any companion's fields");
    console.println(U + "ootdDiagLimitedFeatures()            -- enumerate limited feature fields");
    console.println(U + "ootdDiagScanFields(\"pattern\")        -- scan all PDF fields by keyword");
    console.println(U + "ootdDiagCurrentVars()                -- show OotD dragon state");
    console.println(H + "============================================");
})();

console.println("OotD-DIAG: Diagnostic script loaded. Type ootdDiagHelp() for utility list.");
