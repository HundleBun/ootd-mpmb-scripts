/*  -INFORMATION-

    Subject:    Patch: OotD Amazonian Conclave Companion Fix
    Effect:     This script patches a bug in the community Odyssey of the
                Dragonlords script (OdysseyOfTheDragonlords_v13.js) where
                the Amazonian Conclave subclass throws a TypeError when
                trying to add the Stimfay companion.

                The bug: line 1543 of the OotD script uses
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

*/

var iFileName = "OotD_AmazonianFix.js";
RequiredSheetVersion("13.2.0");

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