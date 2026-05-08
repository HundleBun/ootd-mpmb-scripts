/*  -INFORMATION-

    Subject:    Epic Paths and Divine Blessings
    Effect:     This script adds the eight Epic Paths and their Divine Blessings
                from Odyssey of the Dragonlords to MPMB's Character Record Sheet.

                Each Epic Path is implemented as a feat taken at character creation.
                Selecting a path feat automatically generates a dedicated notes page
                containing the full background, heroic tasks, and item options for
                that path.

                Each Divine Blessing is implemented as a separate feat to be taken
                once the corresponding Heroic Tasks have been completed. Blessings
                surface in the Class Features column via limfeaname so they are
                visible during play without opening the feat list.

                The Gifted One and Vanished One paths include an extraFeatures
                sub-choice for Crown of the Dragonlords attunement, which adds
                Bond of the Dragonlords and Dirge of the Dragonlords to the
                character's spell list when activated mid-campaign.

                Dirge of the Dragonlords is defined in this script. If another
                loaded script already defines it, the later definition will take
                precedence — verify with the JS console if unexpected behaviour
                occurs.

    Sheet:      v13.2.0 and newer

*/

var iFileName = "OotD_EpicPaths.js";
RequiredSheetVersion("13.2.0");

SourceList["OotD-EP"] = {
    name : "Odyssey of the Dragonlords: Epic Paths",
    abbreviation : "OotD-EP",
    abbreviationSpellsheet : "OE",
    group : "Player Companions",
    url : "https://www.arcanumworlds.com/odyssey-of-the-dragonlords",
    date : "2019/09/01"
};

// ============================================================
// SPELL DEFINITION — Dirge of the Dragonlords
// Defined here because it is not present in the base OotD
// race/class scripts. Bond of the Dragonlords is assumed to
// already exist from those scripts and is not redefined.
// ============================================================

SpellsList["dirge of the dragonlords"] = {
    name : "Dirge of the Dragonlords",
    source : ["OotD-EP", 54],
    classes : ["bard", "cleric", "paladin"],
    level : 3,
    school : "Necro",
    time : "1 h",
    range : "Touch",
    components : "V,M\u0192",
    compMaterial : "An offering of gems and coins worth at least 1,000 gp, which the spell consumes",
    duration : "Instantaneous",
    description : "Return a dead bonded dragon to life with 1 HP; closes wounds, restores missing parts, neutralizes poisons, cures nonmagical diseases; does not remove magical diseases, curses, or similar effects",
    descriptionFull : "You return a dead dragon that has been bonded to a Dragonlord back to life. The dragon returns to life with 1 hit point. All of the dragon's mortal wounds are closed, and any missing body parts are restored.\n\nThis spell also neutralizes any poisons and cures nonmagical diseases that affected the dragon at the time it died. This spell doesn't, however, remove magical diseases, curses, or similar effects; if these aren't first removed prior to casting the spell, they take effect when the dragon returns to life."
};

// ============================================================
// EPIC PATH FEATS (taken at character creation)
// ============================================================

FeatsList["epic path: cursed one"] = {
    name : "Epic Path: Cursed One",
    source : ["OotD-EP", 22],
    descriptionFull : "You come from a great family or tribe that has been cursed for centuries, owing to the actions of one of your distant ancestors who angered the Titans. The stigma has haunted you for all your life. As long as you remain cursed, you will be incapable of living a full life, and your family or tribe may not survive another generation unless you find a way to lift the curse.\n\n\u2022 Restrictions: None.\n\u2022 Adventure Hook: The Oracle reveals that she knows who can end the curse.\n\nHeroic Tasks:\n   \u2022 To end your family's curse.\n   \u2022 To find a family artifact that is key to ending the curse. Pick one lesser and one greater magic item from this list:\n      \u2022 (Lesser) Gem of Brightness: only you can attune.\n      \u2022 (Greater) Staff of Fire: can be any melee weapon.\n      \u2022 (Greater) Belt of Fire Giant Strength: this belt also grants resistance to fire.\n      \u2022 (Greater) Efreeti Bottle: only you can attune.\n\nMonstrous Races: This path is especially compatible with monstrous races, as many of them have been subjected to curses.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of the Gods (take the corresponding feat).",
    description : "Cursed family/tribe; lift the curse to earn Blessing of the Gods. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Roleplay-only; mechanical benefit comes from the Blessing of the Gods feat.",
    toNotesPage : [{
        name : "Epic Path: Cursed One",
        source : ["OotD-EP", 22],
        popupName : "Epic Path: Cursed One — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You come from a great family or tribe that has been cursed for centuries, owing to the actions of one of your distant ancestors who angered the Titans. The stigma has haunted you for all your life. Wherever you go, you are shunned by the ignorant and the superstitious. As long as you remain cursed, you will be incapable of living a full life, and your family or tribe may not survive another generation unless you find a way to lift the curse.",
            "",
            "Restrictions: None.",
            "Adventure Hook: The Oracle reveals that she knows who can end the curse.",
            "Inspired by: Cadmus, Atreus (Greek Tragedies)",
            "",
            "HEROIC TASKS",
            "\u2022 To end your family's curse.",
            "\u2022 To find a family artifact that is key to ending the curse.",
            "  Pick ONE LESSER and ONE GREATER magic item from the list below:",
            "  (Lesser) Gem of Brightness — only you can attune.",
            "  (Greater) Staff of Fire — can be any melee weapon.",
            "  (Greater) Belt of Fire Giant Strength — also grants resistance to fire.",
            "  (Greater) Efreeti Bottle — only you can attune.",
            "",
            "MONSTROUS RACES",
            "Monstrous races are especially compatible with this path, since many have been subjected to curses.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of the Gods feat. You and your direct family become immune to curses, diseases, and the poisoned condition."
        ]
    }]
};

FeatsList["epic path: demi-god"] = {
    name : "Epic Path: Demi-God",
    source : ["OotD-EP", 22],
    descriptionFull : "You are a mortal child of Pythor, the god of battle. Your temper is legendary. From an early age, you demonstrated unnatural talent in everything that interested you. You've never met your father, but your mother was a woman famed for both her beauty and her skill as a harpist. She was carried away by a green dragon when you were very young. A family of soldiers adopted you, and then raised you to be a mighty champion for the city of Mytros. You are a favorite child of the city, and bards already sing of your great deeds while travelling the Heartlands.\n\nAs a youth, the Oracle predicted a great destiny, one in which you might be able to join the pantheon alongside your divine father, who has recently fallen into despair and drunkenness. According to the Oracle, Pythor can be brought back from his drunken oblivion if you are able to achieve the three great labors that defeated him.\n\n\u2022 Restrictions: You must be a native to Thylea.\n\u2022 Adventure Hook: You have been summoned by the Oracle due to your fame and divine heritage.\n\nHeroic Tasks:\n   \u2022 Find your mother (Ophea or a name created by you).\n   \u2022 Defeat Pythor's greatest foe. According to legend this is a green dragon known as Hexia.\n   \u2022 Finish building Pythor's greatest weapon. Choose either:\n      \u2022 Rod of Lordly Might; or\n      \u2022 Luck Blade (can be any type of sword).\n\nMonstrous Races: Pythor was known to take many forms, bedding both mortals and the native races of Thylea. As one of the monstrous races, you are unlikely to be a champion from Mytros. Instead, you are a champion of the druids of Oldwood or one of the tribes of the steppes.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of Health (take the corresponding feat).",
    description : "Child of Pythor; complete three labors to redeem your father and earn Blessing of Health. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Restriction: must be a native to Thylea. Roleplay-only; mechanical benefit comes from the Blessing of Health feat.",
    toNotesPage : [{
        name : "Epic Path: Demi-God",
        source : ["OotD-EP", 22],
        popupName : "Epic Path: Demi-God — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You are a mortal child of Pythor, the god of battle. Your temper is legendary. You've never met your father, but your mother was a woman famed for beauty and her skill as a harpist — she was carried away by a green dragon when you were very young. A family of soldiers adopted you and raised you to be a mighty champion for the city of Mytros.",
            "As a youth, the Oracle predicted a great destiny: you may be able to join the pantheon alongside your divine father, who has recently fallen into despair and drunkenness. Pythor can be redeemed if you achieve the three great labors that once defeated him.",
            "",
            "Restrictions: Must be a native to Thylea.",
            "Adventure Hook: You have been summoned by the Oracle due to your fame and divine heritage.",
            "Inspired by: Heracles, Kratos",
            "",
            "HEROIC TASKS",
            "\u2022 Find your mother (Ophea, or a name of your choice).",
            "\u2022 Defeat Pythor's greatest foe — according to legend, a green dragon known as Hexia.",
            "\u2022 Finish building Pythor's greatest weapon. Choose ONE:",
            "  Rod of Lordly Might",
            "  Luck Blade (can be any type of sword)",
            "",
            "MONSTROUS RACES",
            "Pythor was known to take many forms. As a monstrous race, you are a champion of the druids of Oldwood or one of the tribes of the steppes rather than a champion of Mytros.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of Health feat. Your Constitution score increases by 2, up to a maximum of 22."
        ]
    }]
};

FeatsList["epic path: doomed one"] = {
    name : "Epic Path: Doomed One",
    source : ["OotD-EP", 23],
    descriptionFull : "You come from a famous and distinguished family with ancestors that include Dragonlords and gods. However, you had the misfortune of being born under a fell astrological sign, one that portended a doom of epic proportions. Your parents died shortly after you were born, under mysterious circumstances.\n\nAll your life you have been plagued by ill luck, and you have long suspected that your death will be as ugly as it is spectacular. The prophets and fortune tellers of Mytros make signs against evil when they see you in the street, and you have always been treated with prejudice and superstitious dread. Nevertheless, you've been called by fate to the Temple of the Oracle, and this can only mean that your nameless doom is now at hand. The Oracle has promised that your doom can be avoided, for she alone knows what will protect you.\n\n\u2022 Restrictions: You must be a native to Thylea.\n\u2022 Adventure Hook: The Oracle knows that your doom reflects the doom of the world. If you save yourself, you will be able to save the world.\n\nHeroic Tasks:\n   \u2022 To defeat the creature that has been fated to kill you.\n   \u2022 To forge the one artifact that will protect you from your doom. These items provide resistance to all damage that originates from the creature that is fated to kill you. Choose one from the following list:\n      \u2022 Robe of the Archmagi\n      \u2022 Breastplate of Invulnerability\n      \u2022 Cloak of Invisibility\n\nMonstrous Races: Your ancestors are not Dragonlords; instead one of your ancestors is a Titan, such as Lutheria or Sydon.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of Protection (take the corresponding feat).",
    description : "Born under a fell sign of epic doom; defeat your fated killer and forge a protective artifact to earn Blessing of Protection. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Restriction: must be a native to Thylea. Roleplay-only; mechanical benefit comes from the Blessing of Protection feat.",
    toNotesPage : [{
        name : "Epic Path: Doomed One",
        source : ["OotD-EP", 23],
        popupName : "Epic Path: Doomed One — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You come from a famous family with ancestors that include Dragonlords and gods. However, you were born under a fell astrological sign portending a doom of epic proportions. Your parents died shortly after you were born under mysterious circumstances. All your life you have been plagued by ill luck. The Oracle has promised that your doom can be avoided — she alone knows what will protect you.",
            "",
            "Restrictions: Must be a native to Thylea.",
            "Adventure Hook: The Oracle knows your doom reflects the doom of the world. If you save yourself, you will save the world.",
            "Inspired by: Achilles, Elric of Melnibone",
            "",
            "HEROIC TASKS",
            "\u2022 Defeat the creature that has been fated to kill you.",
            "\u2022 Forge the one artifact that will protect you from your doom.",
            "  The chosen item provides resistance to all damage from the creature fated to kill you.",
            "  Choose ONE:",
            "  Robe of the Archmagi",
            "  Breastplate of Invulnerability",
            "  Cloak of Invisibility",
            "",
            "MONSTROUS RACES",
            "Your ancestors are not Dragonlords; instead one of your ancestors is a Titan, such as Lutheria or Sydon.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of Protection feat. You gain +1 to AC and to all saving throws."
        ]
    }]
};

FeatsList["epic path: dragonslayer"] = {
    name : "Epic Path: Dragonslayer",
    source : ["OotD-EP", 23],
    descriptionFull : "You have a tragic past. Something terrible happened to you when you were young, and it forced you to reckon with the darkness within much sooner than anyone should ever have to. This tragic event shaped your identity and drove you to become who you are today. You know that it was a dragon who was responsible for destroying your childhood. The dragon might have razed your village to the ground\u2014or it might have ruined your life in more insidious ways while polymorphed into the shape of a man or woman. Either way, you wish to discover the identity and the location of the dragon so that you can seek it out and exact brutal vengeance upon it.\n\n\u2022 Restrictions: None.\n\u2022 Adventure Hook: The Oracle knows how to find the dragon that was responsible for your tragedy.\n\nHeroic Tasks:\n   \u2022 To kill the dragon responsible for your tragedy.\n   \u2022 To find items that are key to killing dragons. Pick one lesser and one greater magic item from this list:\n      \u2022 (Lesser) Armor of Resistance\u2014Fire: this can be any armor type.\n      \u2022 (Lesser) Ring of Resistance\u2014Fire: only you can attune to this ring.\n      \u2022 (Greater) Dragonslayer: can be any melee weapon.\n      \u2022 (Greater) Quiver of Elhonna (Ehlonna): includes five arrows of slaying (dragons) or bolts of slaying (dragons).\n      \u2022 (Greater) Wand of Binding: only you can attune.\n\nMonstrous Races: This path is especially compatible with monstrous races, since many have ancient grudges against dragons.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of Dragon Slaying (take the corresponding feat).",
    description : "A dragon destroyed your childhood; hunt it down and arm yourself to earn Blessing of Dragon Slaying. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Roleplay-only; mechanical benefit comes from the Blessing of Dragon Slaying feat.",
    toNotesPage : [{
        name : "Epic Path: Dragonslayer",
        source : ["OotD-EP", 23],
        popupName : "Epic Path: Dragonslayer — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You have a tragic past. Something terrible happened to you when you were young and forced you to reckon with darkness much sooner than anyone should. You know that a dragon was responsible for destroying your childhood — it may have razed your village, or ruined your life in more insidious ways while polymorphed into human form. You wish to find it and exact brutal vengeance.",
            "",
            "Restrictions: None.",
            "Adventure Hook: The Oracle knows how to find the dragon responsible for your tragedy.",
            "Inspired by: Perseus, Turin Turambar",
            "",
            "HEROIC TASKS",
            "\u2022 Kill the dragon responsible for your tragedy.",
            "\u2022 Find items that are key to killing dragons.",
            "  Pick ONE LESSER and ONE GREATER magic item from the list below:",
            "  (Lesser) Armor of Resistance — Fire: can be any armor type.",
            "  (Lesser) Ring of Resistance — Fire: only you can attune to this ring.",
            "  (Greater) Dragonslayer: can be any melee weapon.",
            "  (Greater) Quiver of Elhonna (Ehlonna): five arrows or bolts of slaying (dragons).",
            "  (Greater) Wand of Binding: only you can attune.",
            "",
            "MONSTROUS RACES",
            "Especially compatible with monstrous races, since many have ancient grudges against dragons.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of Dragon Slaying feat. You have advantage on all attacks against dragons; dragons have disadvantage on saving throws against your spells."
        ]
    }]
};

FeatsList["epic path: gifted one"] = {
    name : "Epic Path: Gifted One",
    source : ["OotD-EP", 24],
    descriptionFull : "Ever since you were a child you've shown remarkable promise, effortlessly mastering every activity you've attempted. You have no explanation, but most people assume that you must have divine blood flowing through your veins. As you are from a common, or barbarian, family, you have been the target of seething envy from the children of the nobility and the wealthy who believe you do not deserve your gifts. You've therefore spent most of your life proving your worth. You want to achieve fame and fortune and have your name remembered down the ages. Mostly\u2026 you want to become a Dragonlord. If you could find a dragon egg and successfully hatch it, you could join the list of legendary heroes that are still remembered after five centuries. The call of the Oracle has given you an opportunity to prove your worth.\n\n\u2022 Restrictions: You must be a native to Thylea.\n\u2022 Adventure Hook: The Oracle promises that the prophecy will put you on the path to become a Dragonlord.\n\nHeroic Tasks:\n   \u2022 To found a new order of Dragonlords. To do so you must find the Fortress of the Dragonlords. This fortress is the magical item Instant Fortress (Daern's Instant Fortress).\n   \u2022 To attune with one of the Crowns of the Dragonlords. This will allow you to cast the spells Bond of the Dragonlords and Dirge of the Dragonlords.\n   \u2022 To find a dragon egg, hatch it and raise the dragon to be your companion.\n\nNote for Paladins: Paladins who take the Oath of the Dragonlord probably shouldn't choose the Gifted One as their epic path, as they receive similar powers automatically.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of the Dragonlords (take the corresponding feat).",
    description : "Seek to become a Dragonlord; find a Crown, a dragon egg, and the Fortress to earn Blessing of the Dragonlords. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Restriction: must be a native to Thylea. Not recommended for Paladins with the Oath of the Dragonlord. Roleplay-only; mechanical benefit comes from the Blessing of the Dragonlords feat.",
    toNotesPage : [{
        name : "Epic Path: Gifted One",
        source : ["OotD-EP", 24],
        popupName : "Epic Path: Gifted One — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "Ever since childhood you've shown remarkable promise, effortlessly mastering every activity you've attempted. Most assume you have divine blood. You come from a common or barbarian family and have spent your life proving your worth. Above all, you want to become a Dragonlord — find a dragon egg and successfully hatch it, and you could join the ranks of legendary heroes still remembered after five centuries.",
            "",
            "Restrictions: Must be a native to Thylea.",
            "Adventure Hook: The Oracle promises the prophecy will put you on the path to become a Dragonlord.",
            "Inspired by: Jason and the Argonauts, Daenerys",
            "Note for Paladins: Paladins with the Oath of the Dragonlord should not choose this path, as they receive similar powers automatically.",
            "",
            "HEROIC TASKS",
            "\u2022 Found a new order of Dragonlords by finding the Fortress of the Dragonlords",
            "  (the magical item Instant Fortress / Daern's Instant Fortress).",
            "\u2022 Attune with one of the Crowns of the Dragonlords.",
            "  When attuned, activate the 'Crown of the Dragonlords' feature on your sheet to add",
            "  Bond of the Dragonlords and Dirge of the Dragonlords to your spell list.",
            "\u2022 Find a dragon egg, hatch it, and raise it as your companion.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of the Dragonlords feat. While mounted on a dragon, gain its damage resistances, immunities, senses, and (for adult/ancient dragons) shared legendary resistance."
        ]
    }],
    extraFeatures : {
        "Crown of the Dragonlords (Gifted One)" : {
            name : "Crown of the Dragonlords (Gifted One)",
            source : ["OotD-EP", 24],
            minlevel : 1,
            description : "You have attuned to one of the Crowns of the Dragonlords, granting you the ability to cast Bond of the Dragonlords and Dirge of the Dragonlords. Activate this feature when the DM awards the Crown mid-campaign.",
            limfeaname : "Crown of the Dragonlords (Gifted One)",
            spellcastingBonus : [{
                name : "Crown of the Dragonlords",
                spells : ["bond of the dragonlords", "dirge of the dragonlords"],
                selection : ["bond of the dragonlords", "dirge of the dragonlords"],
                firstCol : "atwill",
                times : 2
            }]
        }
    }
};

FeatsList["epic path: haunted one"] = {
    name : "Epic Path: Haunted One",
    source : ["OotD-EP", 24],
    descriptionFull : "You were once in possession of the rarest treasure in Thylea: a truly happy life. You had a loving partner, beautiful children, and lived in a great house in the city of Mytros. As the first child of a powerful family with godly lineage, you were destined to be the next ruler of Mytros.\n\nThen one day, everything changed. You returned home to find your house cold and empty. Your friends and neighbors have no memory of your family, almost as if they never existed. For a while, you struggled against insanity. Now you've resolved to find your family, whatever the cost. You'll travel to the ends of the earth and fight the gods themselves if needed. You'll do whatever it takes to bring back the people you love, even if everyone thinks you're crazy.\n\n\u2022 Restrictions: You must be a native to Thylea.\n\u2022 Adventure Hook: The Oracle claims that saving the world and fulfilling the prophecy will give you answers about your family's disappearance.\n\nHeroic Tasks:\n   \u2022 To be reunited with your family.\n   \u2022 To reclaim your family name and legacy by tracking down your family artifacts. Pick one lesser and one greater family artifact from this list:\n      \u2022 (Lesser) Ring of Protection: this signet ring was worn by members of your lost family.\n      \u2022 (Lesser) Amulet of Health: this amulet is emblazoned with your family crest.\n      \u2022 (Lesser) Ioun Stone, Awareness: this stone was a jewel given to your ancestors by the gods.\n      \u2022 (Greater) Helm of Brilliance: this crown was worn by your ancestors, who were past rulers of Mytros.\n      \u2022 (Greater) Dancing Sword: this sword (it can be of any type) contains the soul of the family's founder.\n      \u2022 (Greater) Rod of Absorption: this rod was always carried by the leader of your family.\n\nMonstrous Races: You were the leader of a tribe of centaurs, satyrs, minotaurs, or sirens from the far reaches of the steppes. Your tribe vanished as if they had never existed.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of Magic Resistance (take the corresponding feat).",
    description : "Your family vanished without a trace; find them and reclaim your legacy to earn Blessing of Magic Resistance. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Restriction: must be a native to Thylea. Roleplay-only; mechanical benefit comes from the Blessing of Magic Resistance feat.",
    toNotesPage : [{
        name : "Epic Path: Haunted One",
        source : ["OotD-EP", 24],
        popupName : "Epic Path: Haunted One — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You were once in possession of the rarest treasure in Thylea: a truly happy life — a loving partner, beautiful children, a great house in Mytros, and a destiny to rule the city. Then one day you returned home to find your house cold and empty. Your friends and neighbors have no memory of your family, almost as if they never existed. You have resolved to find your family, whatever the cost.",
            "",
            "Restrictions: Must be a native to Thylea.",
            "Adventure Hook: The Oracle claims that saving the world will give you answers about your family's disappearance.",
            "Inspired by: Orpheus, Harry Potter",
            "",
            "HEROIC TASKS",
            "\u2022 Be reunited with your family.",
            "\u2022 Reclaim your family name and legacy by tracking down your family artifacts.",
            "  Pick ONE LESSER and ONE GREATER family artifact from the list below:",
            "  (Lesser) Ring of Protection — signet ring worn by members of your lost family.",
            "  (Lesser) Amulet of Health — emblazoned with your family crest.",
            "  (Lesser) Ioun Stone, Awareness — a jewel given to your ancestors by the gods.",
            "  (Greater) Helm of Brilliance — worn by your ancestors, past rulers of Mytros.",
            "  (Greater) Dancing Sword — any sword type; contains the soul of the family's founder.",
            "  (Greater) Rod of Absorption — always carried by the leader of your family.",
            "",
            "MONSTROUS RACES",
            "You were the leader of a tribe of centaurs, satyrs, minotaurs, or sirens from the far reaches of the steppes. Your tribe vanished as if they had never existed.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of Magic Resistance feat. You have advantage on saving throws against spells and other magical effects."
        ]
    }]
};

FeatsList["epic path: lost one"] = {
    name : "Epic Path: Lost One",
    source : ["OotD-EP", 25],
    descriptionFull : "You hail from a distant land, where your people worshiped foreign gods and spoke languages unknown to the people of Thylea. You sailed in search of the fabled treasures of the Dragonlords, but your ship and most of your crew were destroyed in a storm. Found by fishermen and brought to the city of Mytros, you discovered that your arrival had been prophesied by the Oracle.\n\nYou may not believe in any of the Oracle's prophecies, but one thing is for certain: you are somehow stranded on Thylea's shores, and your fate is now here. If the Oracle believes that you are one of the chosen few, then you must do what you can to help.\n\n\u2022 Restrictions: You must be an explorer from distant lands.\n\u2022 Adventure Hook: The Oracle thinks you have been sent from the outside world by the gods in order to fulfill the prophecy.\n\nHeroic Tasks:\n   \u2022 Find your surviving crew members.\n   \u2022 Find a way to get back home.\n   \u2022 Find the fabled treasures of the Dragonlords. The treasure trove includes three gems worth 10,000 gp (a diamond, a ruby, and a sapphire), 2,000 pp, and 10,000 gp. It also includes one item from the following list:\n      \u2022 Gem of Seeing\n      \u2022 Necklace of Prayer Beads\n      \u2022 Glamoured Studded Leather\n      \u2022 Rod of Rulership\n\nMonstrous Races: You were a stranger in your own land, across the Forgotten Sea. The tribes of Thylea welcomed you as family, but you still wish to return to your homeland.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of Luck (take the corresponding feat).",
    description : "Shipwrecked outsider stranded on Thylea; find your crew, get home, and claim the Dragonlords' treasure to earn Blessing of Luck. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Restriction: must be an explorer from distant lands. Roleplay-only; mechanical benefit comes from the Blessing of Luck feat.",
    toNotesPage : [{
        name : "Epic Path: Lost One",
        source : ["OotD-EP", 25],
        popupName : "Epic Path: Lost One — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You hail from a distant land where your people worshiped foreign gods and spoke languages unknown to Thylea. You sailed in search of the fabled treasures of the Dragonlords, but your ship and most of your crew were destroyed in a storm. Found by fishermen and brought to Mytros, you discovered that your arrival had been prophesied by the Oracle. Whether you believe it or not, you are stranded on Thylea's shores and your fate is now here.",
            "",
            "Restrictions: Must be an explorer from distant lands.",
            "Adventure Hook: The Oracle believes you were sent from the outside world by the gods to fulfill the prophecy.",
            "Inspired by: Narnia, Wizard of Oz",
            "",
            "HEROIC TASKS",
            "\u2022 Find your surviving crew members.",
            "\u2022 Find a way to get back home.",
            "\u2022 Find the fabled treasures of the Dragonlords.",
            "  The treasure trove includes: three gems worth 10,000 gp each (diamond, ruby, sapphire),",
            "  2,000 pp, and 10,000 gp, plus ONE magic item from the list below:",
            "  Gem of Seeing",
            "  Necklace of Prayer Beads",
            "  Glamoured Studded Leather",
            "  Rod of Rulership",
            "",
            "MONSTROUS RACES",
            "You were a stranger in your own land, across the Forgotten Sea. The tribes of Thylea welcomed you as family, but you still wish to return to your homeland.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of Luck feat. Once per long rest, reroll any one attack roll, ability check, or saving throw (must use the second roll)."
        ]
    }]
};

FeatsList["epic path: vanished one"] = {
    name : "Epic Path: Vanished One",
    source : ["OotD-EP", 25],
    descriptionFull : "You are one of the Dragonlords, the legendary outside explorers who first discovered Thylea. You were present when the tiny settlement of Mytros was founded, but you've been missing for almost 500 years. During an expedition into the Cerulean Gulf, you fell victim to the irresistible charms of a nymph named Versi. You've spent the last five centuries in a waking dream, trapped in her cave with no knowledge of time passing or events on the mainland. Versi released her hold on you when you were called by fate to save Thylea, but she made you swear an oath to return to her once your quest is completed. Versi is known as the Oracle by most of the inhabitants of Thylea.\n\nCenturies of Leisure: The time that you have spent with Versi has created gaps in your memory. You are no longer the great Dragonlord that you once were. You must relearn all of the skills lost to you.\n\n\u2022 Restrictions: You must be an explorer from distant lands.\n\u2022 Adventure Hook: You are the Oracle's favorite pet.\n\nHeroic Tasks:\n   \u2022 To find if you have any descendants.\n   \u2022 To reclaim your title as a Dragonlord. In order to do this you must:\n      \u2022 Attune with one of the Crowns of the Dragonlords. This will allow you to cast the spells Bond of the Dragonlords and Dirge of the Dragonlords.\n      \u2022 Find a dragon egg, hatch it and raise the dragon to be your companion.\n   \u2022 To get back your fabled armor. Choose one item from the following list:\n      \u2022 Boots of Speed: Emblazoned on the boots is the image of your old dragon mount.\n      \u2022 Dragon Scale Mail: Made from the scales, given willingly, of your old dragon mount.\n      \u2022 Cloak of the Bat: Only you can attune to this cloak. Instead of transforming into a bat, this cloak allows you to transform into a pseudodragon.\n\nNote for Paladins: Paladins who take the Oath of the Dragonlord probably shouldn't choose the Vanished One as their epic path, as they receive similar powers automatically.\n\nMonstrous Races: You were not one of the Dragonlords. Instead, you were a champion from one of the native tribes that were defeated by the Dragonlords. You want to claim the power of a dragon and rebuild the order to include all the diverse peoples of Thylea.\n\nDivine Blessing (upon completion of Heroic Tasks): Blessing of the Dragonlords (take the corresponding feat).",
    description : "An ancient Dragonlord missing for 500 years; reclaim your title and legacy to earn Blessing of the Dragonlords. See notes page for full path details and heroic tasks.",
    prerequisite : "Chosen at character creation as your Epic Path. Restriction: must be an explorer from distant lands. Not recommended for Paladins with the Oath of the Dragonlord. Roleplay-only; mechanical benefit comes from the Blessing of the Dragonlords feat.",
    toNotesPage : [{
        name : "Epic Path: Vanished One",
        source : ["OotD-EP", 25],
        popupName : "Epic Path: Vanished One — Heroic Tasks & Details",
        note : [
            "BACKGROUND",
            "You are one of the original Dragonlords who first discovered Thylea, present when Mytros was founded — but you have been missing for almost 500 years. During an expedition into the Cerulean Gulf you fell victim to the charms of a nymph named Versi, spending five centuries in a waking dream in her cave. Versi released you when fate called you to save Thylea, but she made you swear an oath to return once your quest is complete. She is known to most inhabitants as the Oracle.",
            "",
            "Centuries of Leisure: The time spent with Versi has created gaps in your memory. You are no longer the great Dragonlord you once were and must relearn your lost skills.",
            "",
            "Restrictions: Must be an explorer from distant lands.",
            "Adventure Hook: You are the Oracle's favorite pet.",
            "Inspired by: Odysseus, Captain America",
            "Note for Paladins: Paladins with the Oath of the Dragonlord should not choose this path, as they receive similar powers automatically.",
            "",
            "HEROIC TASKS",
            "\u2022 Find out if you have any descendants.",
            "\u2022 Reclaim your title as a Dragonlord:",
            "  Attune with one of the Crowns of the Dragonlords.",
            "  When attuned, activate the 'Crown of the Dragonlords' feature on your sheet to add",
            "  Bond of the Dragonlords and Dirge of the Dragonlords to your spell list.",
            "  Find a dragon egg, hatch it, and raise it as your companion.",
            "\u2022 Recover your fabled armor. Choose ONE:",
            "  Boots of Speed — emblazoned with the image of your old dragon mount.",
            "  Dragon Scale Mail — made from the scales, given willingly, of your old dragon mount.",
            "  Cloak of the Bat — only you can attune; transforms into a pseudodragon instead of a bat.",
            "",
            "MONSTROUS RACES",
            "You were not one of the Dragonlords. Instead, you were a champion from one of the native tribes defeated by the Dragonlords. You want to claim the power of a dragon and rebuild the order to include all peoples of Thylea.",
            "",
            "DIVINE BLESSING (upon completion of all Heroic Tasks)",
            "Take the Blessing of the Dragonlords feat. While mounted on a dragon, gain its damage resistances, immunities, senses, and (for adult/ancient dragons) shared legendary resistance."
        ]
    }],
    extraFeatures : {
        "Crown of the Dragonlords (Vanished One)" : {
            name : "Crown of the Dragonlords (Vanished One)",
            source : ["OotD-EP", 25],
            minlevel : 1,
            description : "You have attuned to one of the Crowns of the Dragonlords, granting you the ability to cast Bond of the Dragonlords and Dirge of the Dragonlords. Activate this feature when the DM awards the Crown mid-campaign.",
            limfeaname : "Crown of the Dragonlords (Vanished One)",
            spellcastingBonus : [{
                name : "Crown of the Dragonlords",
                spells : ["bond of the dragonlords", "dirge of the dragonlords"],
                selection : ["bond of the dragonlords", "dirge of the dragonlords"],
                firstCol : "atwill",
                times : 2
            }]
        }
    }
};

// ============================================================
// DIVINE BLESSING FEATS (taken upon completion of Heroic Tasks)
// limfeaname causes each blessing to surface in the Class
// Features column with its Epic Path clearly attributed.
// ============================================================

FeatsList["blessing of the gods"] = {
    name : "Blessing of the Gods",
    source : ["OotD-EP", 22],
    descriptionFull : "You and your direct family are immune to curses, diseases, and the poisoned condition.\n\nThis is the Divine Blessing for the Cursed One epic path. Take this feat only after completing all Heroic Tasks for that path.",
    description : "You and your direct family are immune to curses, diseases, and the poisoned condition.",
    prerequisite : "Completion of all Cursed One Heroic Tasks (DM approval). Epic Path: Cursed One.",
    limfeaname : "Blessing of the Gods (Epic Path: Cursed One)",
    savetxt : { immune : ["curses", "diseases", "poisoned condition"] }
};

FeatsList["blessing of health"] = {
    name : "Blessing of Health",
    source : ["OotD-EP", 22],
    descriptionFull : "Your Constitution score increases by 2, up to a maximum of 22.\n\nThis is the Divine Blessing for the Demi-God epic path. Take this feat only after completing all Heroic Tasks for that path.",
    description : "Your Constitution score increases by 2, up to a maximum of 22.",
    prerequisite : "Completion of all Demi-God Heroic Tasks (DM approval). Epic Path: Demi-God.",
    limfeaname : "Blessing of Health (Epic Path: Demi-God)",
    scores : [0, 0, 2, 0, 0, 0],
    scoresMaximum : [0, 0, 22, 0, 0, 0]
};

FeatsList["blessing of protection"] = {
    name : "Blessing of Protection",
    source : ["OotD-EP", 23],
    descriptionFull : "You gain a +1 bonus to your AC and to all saving throws.\n\nThis is the Divine Blessing for the Doomed One epic path. Take this feat only after completing all Heroic Tasks for that path.",
    description : "You gain a +1 bonus to your AC and to all saving throws.",
    prerequisite : "Completion of all Doomed One Heroic Tasks (DM approval). Epic Path: Doomed One.",
    limfeaname : "Blessing of Protection (Epic Path: Doomed One)",
    extraAC : [{
        name : "Blessing of Protection",
        mod : 1,
        magic : false,
        stopeval : false
    }],
    savetxt : { text : ["+1 bonus to all saving throws"] },
    saves : [1, 1, 1, 1, 1, 1]
};

FeatsList["blessing of dragon slaying"] = {
    name : "Blessing of Dragon Slaying",
    source : ["OotD-EP", 23],
    descriptionFull : "You have advantage on all attacks against creatures with the dragon type. Creatures with the dragon type have disadvantage on saving throws against your spells.\n\nThis is the Divine Blessing for the Dragonslayer epic path. Take this feat only after completing all Heroic Tasks for that path.",
    description : "You have advantage on attacks against dragons; dragons have disadvantage on saves against your spells.",
    prerequisite : "Completion of all Dragonslayer Heroic Tasks (DM approval). Epic Path: Dragonslayer.",
    limfeaname : "Blessing of Dragon Slaying (Epic Path: Dragonslayer)"
};

FeatsList["blessing of the dragonlords"] = {
    name : "Blessing of the Dragonlords",
    source : ["OotD-EP", 24],
    descriptionFull : "While mounted on a dragon, you gain that dragon's damage resistances, damage immunities, and senses (blindsight, darkvision, and its passive perception if it is greater than yours). If the dragon is an adult or ancient dragon, you can also use its legendary resistance (but this counts towards the total number of uses per day).\n\nThis is the Divine Blessing for the Gifted One and Vanished One epic paths. Take this feat only after completing all Heroic Tasks for the relevant path.",
    description : "While mounted on a dragon, you gain its damage resistances, immunities, senses, and (for adult/ancient dragons) shared use of its legendary resistance.",
    prerequisite : "Completion of all Gifted One or Vanished One Heroic Tasks (DM approval). Epic Path: Gifted One or Vanished One.",
    limfeaname : "Blessing of the Dragonlords (Epic Path: Gifted/Vanished One)"
};

FeatsList["blessing of magic resistance"] = {
    name : "Blessing of Magic Resistance",
    source : ["OotD-EP", 24],
    descriptionFull : "You have advantage on saving throws against spells and other magical effects.\n\nThis is the Divine Blessing for the Haunted One epic path. Take this feat only after completing all Heroic Tasks for that path.",
    description : "You have advantage on saving throws against spells and other magical effects.",
    prerequisite : "Completion of all Haunted One Heroic Tasks (DM approval). Epic Path: Haunted One.",
    limfeaname : "Blessing of Magic Resistance (Epic Path: Haunted One)",
    savetxt : { adv_vs : ["spells", "magical effects"] }
};

FeatsList["blessing of luck"] = {
    name : "Blessing of Luck",
    source : ["OotD-EP", 25],
    descriptionFull : "You may reroll any one attack roll, ability check, or saving throw. You must use the second roll. The blessing cannot be used again until after a long rest (at least several nights' sleep, as the GM decides).\n\nThis is the Divine Blessing for the Lost One epic path. Take this feat only after completing all Heroic Tasks for that path.",
    description : "Reroll any one attack roll, ability check, or saving throw (must use the second roll). Recharges on a long rest.",
    prerequisite : "Completion of all Lost One Heroic Tasks (DM approval). Epic Path: Lost One.",
    limfeaname : "Blessing of Luck (Epic Path: Lost One)",
    usages : 1,
    recovery : "long rest",
    action : ["reaction", " (Blessing of Luck)"]
};