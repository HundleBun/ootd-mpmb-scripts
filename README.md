# OotD MPMB Scripts

Community MPMB automation scripts for the [Odyssey of the Dragonlords](https://www.arcanumworlds.com/odyssey-of-the-dragonlords) campaign setting (Arcanum Worlds, 2019).

Three scripts that work together to add epic paths, companion fixes, and the Gifted One dragon companion system to MPMB's Character Record Sheet v13.

---

## Requirements

- **MPMB's Character Record Sheet v13.2.0 or newer**
- **OdysseyOfTheDragonlords_v13.js** — the community base script for OotD content (not included here). Source this from the [MPMB subreddit](https://www.reddit.com/r/mpmb/) or the MPMB Discord.

---

## Scripts in This Repo

| Script | Purpose |
|---|---|
| `OotD_AmazonianFix.js` | Patches a TypeError in companion functions affecting the Amazonian Conclave ranger subclass |
| `OotD_GiftedOneDragon.js` | Class-agnostic dragon companion system for the Gifted One and Vanished One epic path |
| `OotD_EpicPaths.js` | Adds all 8 OotD epic paths and their divine blessings as selectable feats |
| `OotD_ZDiagnostic.js` | Optional troubleshooting script — load only when investigating issues |

---

## Load Order — CRITICAL

Scripts must be loaded in this exact order. Loading out of order will cause errors.

```
1. OdysseyOfTheDragonlords_v13.js    <-- NOT in this repo (external dependency)
2. OotD_AmazonianFix.js
3. OotD_GiftedOneDragon.js
4. OotD_EpicPaths.js                 <-- independent of GiftedOne; load after AmazonianFix
5. OotD_ZDiagnostic.js                <-- OPTIONAL: load only when troubleshooting
```

`OotD_EpicPaths.js` and `OotD_GiftedOneDragon.js` can be swapped relative to each other, but both must come after `OotD_AmazonianFix.js`, which must come after the base OotD script.

---

## How to Add Scripts to MPMB

1. Open your MPMB character sheet PDF in Adobe Acrobat (Reader or Pro).
2. Open the **Bookmarks** panel (View > Show/Hide > Navigation Panes > Bookmarks).
3. Navigate to **Scripts** > **Add Script File**.
4. Select each script file in the load order above.
5. Save the PDF and reopen it — scripts run on load.

> See [docs/installation.md](docs/installation.md) for a detailed walkthrough.

---

## Dragon Bonding Quickstart (Gifted One)

1. Attune to the **Crown of the Dragonlords** magic item on your sheet.
2. A dialogue box fires automatically.
3. Choose your dragon type (Brass, Bronze, Copper, or Silver) and give it a name.
4. The dragon is added to your companion page with scaled HP and proficiency bonus applied to all six saving throws.

**Manual steps you must track yourself:**
- Cast **Bond of the Dragonlords** (spell, 1 hour cast time).
- Deduct **5,000 gp** material component from your gold.
- The bond must be cast within **24 hours** of hatching — confirm the window with your DM.

> See [docs/gifted-one.md](docs/gifted-one.md) for full dragon companion rules and scaling details.

---

## Epic Paths

All 8 epic paths from the OotD sourcebook are available as selectable feats. Take one at character creation. Each path generates a dedicated notes page on your sheet with its full background, heroic tasks, and item options.

Divine Blessings are separate feats taken after completing all heroic tasks for your path (DM approval required).

> See [docs/epic-paths.md](docs/epic-paths.md) for the full feat and blessing reference.

---

## Known Issues

- **Dragon companion search** relies on `ClassList.artificer` or `ClassList.paladin` having `artificerCompFunc` defined. If neither class is loaded, companion functions are unavailable. The script handles this gracefully with a manual workaround alert.
- **BackgroundFeatureList watcher** for dragon level-up is defined statically — if the Crown is never attuned, the watcher exists in memory but does nothing (harmless).
- All three scripts are candidates for packaging into a single community bundle file in a future release.

---

## License

These scripts are fan-made community tools for use with MPMB's Character Record Sheet. Odyssey of the Dragonlords content belongs to Arcanum Worlds. See their [website](https://www.arcanumworlds.com/odyssey-of-the-dragonlords) for the official sourcebook.