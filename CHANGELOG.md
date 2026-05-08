# Changelog

All notable changes to these scripts are documented here.

---

## OotD_GiftedOneDragon.js

### v1.5.0 — Current
- **Name field fix**: Write to `Comp.Use.CreatureName` (confirmed writable via diagnostic). Removed `Comp.Use.Nickname`, `Comp.Use.Name`, and `app.setTimeOut` deferred writes — field confirmed, no delay needed.
- **Name persistence**: Dragon name and type persisted to `CurrentVars` as redundant backup. Name capture on upgrade reads `Comp.Use.CreatureName` first, `CurrentVars` as fallback.
- **Notes field fix**: Write to `Comp.Use.Notes` (confirmed writable via diagnostic), with automatic fallback to `Comp.Use.Features` if the write fails.
- **Removed**: All diagnostic code.

### v1.4.0
- **Notes field fix**: All writes now target `Comp.Use.Traits` — the correct MPMB v13 companion field. Previous writes to `Comp.Use.Notes` were silently discarded.
- **Notes append**: Script section now appends below existing MPMB-populated trait content (breath weapon description, abilities, etc.) rather than overwriting it. On subsequent writes, only the script section is replaced to prevent duplication.
- **Unbreakable Bond**: Removed `Value()` calls for `Limited Feature X Max` and `Limited Feature X Recovery` — MPMB v13 calculates these dynamically and does not expose them as writable PDF fields. Feature name write only.

### v1.3.0
- **Nickname fix (initial bond)**: Write to both `Comp.Use.Nickname` and `Comp.Use.Name` fields immediately on bond, plus a 1-second `app.setTimeOut` deferred write to handle companion page initialization delay.
- **Nickname fix (upgrade)**: Same dual-field write + deferred write applied when carrying the name over to the Young Dragon companion page.
- **Upgrade scoping fix**: `newPrefix` hoisted to function scope in `ootdUpdateDragonOnLevelUp` to prevent Acrobat JS engine scoping failures.
- **Upgrade name capture**: Dragon name now read from `Comp.Use.Nickname` with `Comp.Use.Name` as fallback, captured before any remove/add operations.
- **Debug logging**: Notes prefix logged before `ootdWriteDragonNotes` on upgrade path for test verification.

### v1.2.0
- **Level-up watcher fix**: `BackgroundFeatureList` did not register correctly in MPMB v13 — the watcher never existed on the sheet. Replaced with `calcChanges["hp"]` attached directly to `MagicItemsList["crown of the dragonlords"]` (both `spellcaster` and `non-spellcaster` variants). The Crown is guaranteed on-sheet once attuned, making it a reliable host for the level-change hook.

### v1.1.0
- **Console-free bonding**: Crown `eval` now fires `ootdBondDragon()` directly on attunement. JS console previously required.
- **Reload guard**: If a dragon is already bonded, Crown `eval` exits silently on sheet reload instead of re-triggering the dialogue.
- **Reliable level-up watcher**: Replaced the broken `FeatsList` `changeeval` approach (which could never fire because `prereqeval` returned false) with `BackgroundFeatureList` + `calcChanges["hp"]` + `CurrentVars` level-change detection.
- **Removed**: Dead `FeatsList` watcher, `ootdAddBondButton()`, `ootdRemoveBondButton()`, notepad band-aid from v1.0.

### v1.0.0
- Initial release.
- Dragon companion bonding via JS console.
- Level-up watcher via `FeatsList` `changeeval` (non-functional — see v1.1.0).

---

## OotD_EpicPaths.js

### v2.0.0 — Current
- Each epic path feat now auto-generates a dedicated **notes page** on the sheet containing the full path background, heroic tasks, and item options.
- Divine Blessings now surface in the **Class Features column** via `limfeaname` — visible during play without opening the feat list.
- Gifted One and Vanished One paths include an `extraFeatures` sub-choice for **Crown of the Dragonlords** attunement, adding Bond of the Dragonlords and Dirge of the Dragonlords to the spell list when activated mid-campaign.
- `SpellsList["dirge of the dragonlords"]` defined in this script (not present in the base OotD script).

### v1.0.0
- Initial release.
- All 8 epic paths as selectable feats with basic descriptions.
- Divine Blessings as separate feats.

---

## OotD_AmazonianFix.js

### v1.0.0 — Current
- Initial release.
- Patches `TypeError` in `OdysseyOfTheDragonlords_v13.js` line 1543 where `ClassList.artificer.artificerCompFunc` or `ClassList.paladin.artificerCompFunc` may be undefined.
- Defines safe `add`, `remove`, and `find` companion management functions on both `ClassList.paladin` and (when present) `ClassList.artificer`.
- Guards applied defensively: only patches if the property is missing or broken.
- Required by `OotD_GiftedOneDragon.js`.