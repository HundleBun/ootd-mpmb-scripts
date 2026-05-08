# Installation Guide

## What You Need

- **Adobe Acrobat** (Reader or Pro) — MPMB sheets run on Acrobat's JavaScript engine. Other PDF viewers will not work.
- **MPMB's Character Record Sheet v13.2.0 or newer** — all three scripts call `RequiredSheetVersion("13.2.0")` and will refuse to run on older versions.
- **OdysseyOfTheDragonlords_v13.js** — the community base script that adds OotD races, classes, subclasses, and magic items. This is an external dependency not included in this repo. Find it on the [MPMB subreddit](https://www.reddit.com/r/mpmb/) or MPMB Discord.

---

## Load Order

This is the most common source of errors. Scripts must be loaded in this exact sequence:

```
1. OdysseyOfTheDragonlords_v13.js    <-- external, load first
2. OotD_AmazonianFix.js              <-- patches the base script
3. OotD_GiftedOneDragon.js           <-- depends on AmazonianFix
4. OotD_EpicPaths.js                 <-- independent of GiftedOne, but after AmazonianFix
5. OotD_Diagnostic.js                <-- OPTIONAL: load only when troubleshooting
```

Why this order matters:
- `OotD_AmazonianFix.js` must run after the base OotD script so it can patch `ClassList.paladin` and `ClassList.artificer`.
- `OotD_GiftedOneDragon.js` reads `ClassList.artificer.artificerCompFunc` and `ClassList.paladin.artificerCompFunc` at load time — these must already be defined by `OotD_AmazonianFix.js`.
- `OotD_EpicPaths.js` defines the Crown of the Dragonlords `extraFeatures` sub-choice, but `OotD_GiftedOneDragon.js` extends `MagicItemsList["crown of the dragonlords"]` with its bonding `eval`. Both can coexist; load order between them does not matter as long as both are after `OotD_AmazonianFix.js`.

---

## Adding Scripts to Your Sheet

1. Open your MPMB character sheet PDF in **Adobe Acrobat**.
2. Open the **Bookmarks** panel:
   - Menu: View > Show/Hide > Navigation Panes > Bookmarks
   - Or click the bookmark icon on the left sidebar.
3. In the bookmarks list, find and expand **Scripts**.
4. Click **Add Script File**.
5. A file picker opens. Navigate to and select `OdysseyOfTheDragonlords_v13.js` first.
6. Repeat for `OotD_AmazonianFix.js`, then `OotD_GiftedOneDragon.js`, then `OotD_EpicPaths.js`. Add `OotD_Diagnostic.js` last only if you are troubleshooting.
7. **Save the PDF** (Ctrl+S / Cmd+S).
8. **Close and reopen the PDF** — scripts execute on load.

> The scripts list in MPMB's bookmarks shows scripts in the order they were added. If you need to change the order, remove and re-add scripts through the same menu.

---

## Verifying the Install

After reopening the sheet, open the **JS Console** in Acrobat (Advanced > Document Processing > JavaScript Console, or Ctrl+J) and check for:

```
OotD Patch: Defined ClassList.paladin.artificerCompFunc
OotD-GD: Gifted One Dragon Companion System loaded (v1.1.0).
OotD-GD: Attune to the Crown of the Dragonlords to begin bonding.
```

If you see errors instead, check the load order and confirm all scripts are present.

---

## Using the Diagnostic Script

`OotD_Diagnostic.js` is an optional script that runs health checks and provides field investigation tools. Load it last (after all four production scripts) only when you need to investigate a problem. Remove it when done — it adds console output on every PDF load.

**When the diagnostic script is loaded**, it automatically prints a health summary on every PDF open:

```
OotD-DIAG [HEALTH] AmazonianFix ................... PASS
OotD-DIAG [HEALTH] Crown extensions ............... PASS
OotD-DIAG [HEALTH] EpicPaths feats ................ PASS
OotD-DIAG [HEALTH] Dragon bonded .................. PASS [bronze / young]
...
```

**For deeper investigation**, open the JS Console (Ctrl+J) and call utilities directly:

| Function | What it does |
|---|---|
| `ootdDiagHelp()` | List all utilities and the troubleshooting workflow |
| `ootdDiagScanFields("keyword")` | Find all PDF fields matching a keyword — start here for any unknown problem |
| `ootdDiagCompanion("creature name")` | Enumerate all fields on any companion page (dragon, stimfay, etc.) |
| `ootdDiagLimitedFeatures()` | List all Limited Feature fields, warn on incomplete slots |
| `ootdDiagCurrentVars()` | Show OotD dragon state stored in CurrentVars |

The `[HEALTH]` output is OotD-specific. The `[UTIL]` functions work for any character, class, or companion — not just OotD.

---

## Troubleshooting

**"Crown of the Dragonlords not found" error**
The base `OdysseyOfTheDragonlords_v13.js` was not loaded before `OotD_GiftedOneDragon.js`. Check load order.

**TypeError on Amazonian Conclave companion**
`OotD_AmazonianFix.js` is either missing or loaded after `OotD_GiftedOneDragon.js`. Reload in correct order.

**Bonding dialogue does not appear on Crown attunement**
Confirm the Crown of the Dragonlords magic item is listed on your sheet (it comes from the base OotD script) and that you are using Acrobat, not another PDF viewer.

**Dragon companion page not created**
Companion functions require either `ClassList.artificer` or `ClassList.paladin` to be present with working `artificerCompFunc`. If you are playing a class that loads neither, the script will show a manual workaround alert with step-by-step instructions.