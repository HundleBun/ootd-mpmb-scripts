# Gifted One — Dragon Companion Guide

This guide covers the dragon companion system added by `OotD_GiftedOneDragon.js`. The script automates bonding, HP scaling, stage upgrades, and the Unbreakable Bond tracker for the Gifted One (and Vanished One) epic path.

---

## Prerequisites

Before bonding a dragon:
- You must have taken the **Epic Path: Gifted One** or **Epic Path: Vanished One** feat at character creation via `OotD_EpicPaths.js`.
- You must have the **Crown of the Dragonlords** magic item listed on your sheet (added by the base OotD script).
- All three scripts must be loaded in the correct order. See [installation.md](installation.md).

---

## Bonding Your Dragon

### Automated (recommended)

1. Go to the **Magic Items** section of your sheet and attune to the **Crown of the Dragonlords**.
2. A dialogue fires automatically:
   - **Choose dragon type**: Brass (1), Bronze (2), Copper (3), or Silver (4). Default: Bronze.
   - **Name your dragon**: Enter a name, or leave blank to use the default (e.g., "Bronze Dragon Wyrmling").
3. A reminder alert appears listing the manual steps you must complete (see below).
4. Click OK — the dragon is added to your companion page.

### What the script sets automatically

- **Companion page** created with the correct stat block for your chosen wyrmling type.
- **HP** set to `40 + (2 x total character level)`.
- **Proficiency bonus** applied to all six saving throws via `AddToModFld`.
- **Notes section** on the companion page populated with rules reminders and the HP formula.
- **Level tracker** stored in `CurrentVars` to detect future level changes.

### Manual steps (not automated)

These must be handled by you and your DM:

| Step | Details |
|---|---|
| Cast Bond of the Dragonlords | 1-hour casting time. Spell is on your list via Crown attunement. |
| Pay material component | 5,000 gp magical item (consumed). Deduct from your gold manually. |
| Timing window | Bond must be cast within 24 hours of the egg hatching. DM-tracked. |

---

## Dragon Types

Only metallic dragons are available for bonding:

| Type | Wyrmling Key | Young Dragon Key |
|---|---|---|
| Brass | brass dragon wyrmling | young brass dragon |
| Bronze | bronze dragon wyrmling | young bronze dragon |
| Copper | copper dragon wyrmling | young copper dragon |
| Silver | silver dragon wyrmling | young silver dragon |

---

## HP Scaling

Dragon HP updates automatically when your character levels up.

**Formula:** `40 + (2 x total character level)`

Examples:
- Level 5 → 50 HP
- Level 10 → 60 HP
- Level 15 → 70 HP
- Level 20 → 80 HP

The level-up watcher uses `BackgroundFeatureList["gifted one: dragon bond watcher"]` which hooks into MPMB's `calcChanges["hp"]` event. It fires on every HP recalculation and updates the dragon if the character's total level has changed since the last update.

---

## Stage Upgrade: Wyrmling to Young Dragon

When your total character level reaches **15**, the script automatically:

1. Alerts you that your dragon has grown into a Young Dragon.
2. Removes the wyrmling companion page.
3. Adds a new companion page with the Young Dragon stat block.
4. Transfers your dragon's nickname.
5. Recalculates and sets HP.
6. Re-applies proficiency bonus to all six saving throws.
7. Updates the companion notes section.

**Young Dragon benefits (vs. Wyrmling):**
- Can be used as a **mount**.
- While mounted: gain the dragon's damage resistances, immunities, and senses.
- **Multiattack** available when not being used as a mount.
- Wyrmlings cannot be used as mounts and do not have multiattack while fighting alongside you.

---

## Unbreakable Bond (Level 20)

When your total level reaches 20, the script adds a **"Dragon Auto-Succeed (Unbreakable Bond)"** tracker to your Limited Features section (1 use, recovers on long rest).

**Unbreakable Bond rules:**
- Dragon gains Multiattack even when mounted.
- Breath weapon recharges on a roll of 5-6 each round (instead of between encounters).
- Once per long rest: the dragon automatically succeeds a failed saving throw (track with the limited feature).

---

## Rules Reminders

- **Death-link**: If your dragon dies, you die within 24 hours unless the dragon is returned to life (via Dirge of the Dragonlords or resurrection magic).
- **One bond only**: Only one dragon can be bonded. The bond is permanent and cannot be undone via this script.
- **Breath weapon**: Once per encounter. Recharges after a long rest (or on 5-6 at level 20).

---

## Reload Behaviour

The Crown of the Dragonlords `eval` fires every time the PDF is opened (standard MPMB behaviour). The script detects if a dragon companion is already bonded and exits silently — you will not be prompted to bond again on every sheet load.

---

## If the Companion Page Cannot Be Created

If neither `ClassList.artificer` nor `ClassList.paladin` has `artificerCompFunc` defined, the bonding script cannot add a companion page automatically. You will receive an alert with these manual steps:

1. Add a companion page via Bookmarks > Functions > Add Page/Template.
2. Set Race/Creature to your chosen wyrmling key (e.g., `bronze dragon wyrmling`).
3. Set HP to `40 + (2 x total level)`.
4. Apply proficiency bonus to all six saving throws manually.

This situation is resolved by ensuring `OotD_AmazonianFix.js` is loaded before `OotD_GiftedOneDragon.js`.