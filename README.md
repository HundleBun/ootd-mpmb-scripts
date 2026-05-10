# OotD MPMB Scripts

Community MPMB automation scripts for the [Odyssey of the Dragonlords](https://www.arcanumworlds.com/odyssey-of-the-dragonlords) campaign setting (Arcanum Worlds, 2019).

Four scripts that work together to add epic paths, companion fixes, the Gifted One dragon companion system, and Thylean Minotaur transformation tracking to MPMB's Character Record Sheet v13.

---

## Requirements

- **MPMB's Character Record Sheet v13.2.0 or newer**
- **OdysseyOfTheDragonlords_v13.js** — the community base script for OotD content (not included here). Source this from the [MPMB subreddit](https://www.reddit.com/r/mpmb/) or the MPMB Discord.

---

## Scripts in This Repo

| Script | Purpose |
|---|---|
| `OotD_AmazonianFix.js` | Patches a TypeError in companion functions affecting the Amazonian Conclave ranger subclass |
| `OotD_EpicPaths.js` | Adds all 8 OotD epic paths and their divine blessings as selectable feats |
| `OotD_GiftedOneDragon.js` | Class-agnostic dragon companion system for the Gifted One and Vanished One epic path |
| `OotD_HerculeanMino.js` | Bull and Dire Bull companion pages for the Thylean Minotaur Cursed Transformation racial feature |
| `OotD_ZDiagnostic.js` | Optional troubleshooting script — load only when investigating issues |

---

## Load Order — CRITICAL

MPMB loads scripts alphabetically — no manual reordering is needed or possible. The filenames are prefixed to enforce the correct order automatically.

```
1. OdysseyOfTheDragonlords_v13.js    <-- NOT in this repo (external dependency; "Od" sorts before "Oo")
2. OotD_AmazonianFix.js              <-- must load first; defines companion functions used by all others
3. OotD_EpicPaths.js
4. OotD_GiftedOneDragon.js
5. OotD_HerculeanMino.js
6. OotD_ZDiagnostic.js               <-- OPTIONAL: load only when troubleshooting
```

All scripts after `OotD_AmazonianFix.js` depend on the companion functions it defines. Load AmazonianFix first.

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

## Minotaur Transformation Quickstart (Herculean Path)

1. Add the item **Cursed Transformation (Minotaur)** to your character's equipment list.
2. At level 5, a Bull Form companion page is created automatically on the next HP recalculation (level-up).
3. At level 9, the Bull Form page is replaced with a Dire Bull Form page.

Companion pages include the full PHB stat block, transformation rules, and attack/charge details. The **Cursed Transformation** limited feature (1/long rest) is tracked by the base OotD script — this script only manages the companion pages.

**Intended for:** Thylean Minotaur characters on the Herculean Path (Barbarian subclass). Requires `OotD_AmazonianFix.js`.

---

## Epic Paths

All 8 epic paths from the OotD sourcebook are available as selectable feats. Take one at character creation. Each path generates a dedicated notes page on your sheet with its full background, heroic tasks, and item options.

Divine Blessings are separate feats taken after completing all heroic tasks for your path (DM approval required).

> See [docs/epic-paths.md](docs/epic-paths.md) for the full feat and blessing reference.

---

## Known Issues

- **Dragon companion search** relies on `ClassList.artificer` or `ClassList.paladin` having `artificerCompFunc` defined. If neither class is loaded, companion functions are unavailable. The script handles this gracefully with a manual workaround alert.
- **BackgroundFeatureList watcher** for dragon level-up is defined statically — if the Crown is never attuned, the watcher exists in memory but does nothing (harmless).
- All scripts are candidates for packaging into a single community bundle file in a future release.

---

## License

These scripts are fan-made community tools for use with MPMB's Character Record Sheet. Odyssey of the Dragonlords content belongs to Arcanum Worlds. See their [website](https://www.arcanumworlds.com/odyssey-of-the-dragonlords) for the official sourcebook.