# -*- coding: utf-8 -*-
"""0.3.112 — generate the §3H vehicle & mounted weapon SKUs + their lang entries.

One-shot generator kept in tools/ so the numbers in src/packs/gear/weapons/mounted/*.json and
lang/en.json can be re-derived instead of hand-edited. Run from the module root:
    python tools/_gen-mounted-weapons.py
"""
import json, io, os, glob, hashlib, string

# ---------------------------------------------------------------- ids
existing = set()
for f in glob.glob('src/packs/**/*.json', recursive=True):
    d = json.load(io.open(f, encoding='utf8'))
    for doc in [d] + d.get('effects', []) + d.get('items', []) + d.get('pages', []) + d.get('results', []):
        if isinstance(doc, dict) and doc.get('_id'):
            existing.add(doc['_id'])
print('existing ids:', len(existing))

ALPHA = string.ascii_letters + string.digits
OUT_DIR = 'src/packs/gear/weapons/mounted'


def keep_id(path, seed):
    """Reuse the id already on disk so a re-run never mints a second copy of a shipped SKU."""
    if os.path.exists(path):
        return json.load(io.open(path, encoding='utf8'))['_id']
    return mk_id(seed)


def mk_id(seed):
    n = 0
    while True:
        h = hashlib.sha256((seed + (str(n) if n else '')).encode()).digest()
        out = ''.join(ALPHA[b % len(ALPHA)] for b in h)[:16]
        if out not in existing:
            existing.add(out)
            return out
        n += 1


FOLDER_ID = keep_id(os.path.join(OUT_DIR, '_folder.json'), 'gw0312-folder-weapons-mounted')
print('folder id', FOLDER_ID)

AVAIL_LABEL = {'street': 'Street', 'professional': 'Professional', 'restricted': 'Restricted',
               'military': 'Military', 'prototype': 'Prototype'}
BAND_LABEL = {'heavy': 'Heavy', 'anti-veh': 'Anti-veh', 'medium': 'Medium', 'light': 'Light'}
TIER_OF_ECHELON = {1: 'T4', 2: 'T3', 3: 'T2', 4: 'T1'}
AVAIL_NUM = {'street': 5, 'professional': 4, 'restricted': 3, 'military': 2, 'prototype': 1}
SCALE_KITS = {
    'category-3': 'Gun Rack, Twin Mount, Turret Ring, or Heavy Hardpoint',
    'medium': 'Turret Ring',
    'heavy': 'Heavy Hardpoint',
}

WEAPON_MOD_LINKS = (
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.jtVTepYrWmTwfzNJ]{Smartlink}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.98UNcvBWHLroYAWA]{Suppressor}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.fHmRuh92kBkUJyA2]{Recoil Comp}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.KvmcpBf0TQElFGuh]{Extended Mag}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.NMhaEkNDiDEIeIxx]{Smart-Scope}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.3XE8fdbl3slh9W5D]{Gas-Seal Kit}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.KSErZpMGtrAf8OWq]{Underbarrel Mount}, '
    '@UUID[Compendium.draw-steel-ghostwire.mods.Item.ZQGpCYRch5xML8iS]{Personalized Grip}')

# dsid, LangKey, name, corp, sci, echelon, avail, price, slots, damage, dtype, range,
# band, mountScale, mountType, tags, img, blurb
SKUS = [
    ('hornet-pod', 'HornetPod', 'Hornet Pod', 'Kestrel Swarmcaster', 'drone-scale burst pod',
     1, 'professional', 900, 2, 6, 'kinetic', 'Short', 'medium', 'category-3', '',
     ['Mounted', 'Vehicle', 'Drone-scale', 'Auto'],
     'icons/weapons/artillery/mount-weapon-auto-steel.webp',
     'A fist-sized caseless burst pod built to hang off a courier drone without wrecking its trim. '
     'Two seconds of noise, then it is dry until somebody reloads it by hand.'),

    ('roadspike', 'Roadspike', 'Roadspike', 'Ferrum Lane-Sweeper', 'pintle vehicle machine gun',
     1, 'professional', 1200, 2, 9, 'kinetic', 'Medium', 'heavy', 'category-3', '',
     ['Mounted', 'Vehicle', 'Auto', 'Loud'],
     'icons/weapons/guns/machine-gun-drum.webp',
     'The pintle gun every scrap hauler in the Flats eventually grows. Belt-fed, unsubtle, and cheap '
     'enough that losing one to a lane camera is a cost of doing business.'),

    ('streetlash', 'Streetlash', 'Streetlash', 'Ironclad Coaxial Pair', 'twinned vehicle machine guns',
     2, 'restricted', 3400, 3, 9, 'kinetic', 'Long', 'heavy', 'category-3', '',
     ['Mounted', 'Vehicle', 'Auto', 'Loud', 'Dual-feed'],
     'icons/weapons/guns/gun-chain-gatling-belt.webp',
     'Two barrels off one feed, timed so the rig never stops talking while a belt changes. Ironclad '
     'convoy crews call the sound “the lash”.'),

    ('ashwalker', 'Ashwalker', 'Ashwalker', 'Ferrum Hull-Clearer', 'vehicle flame projector',
     2, 'restricted', 4200, 3, 9, 'fire', 'Short', 'heavy', 'category-3', '',
     ['Mounted', 'Vehicle', 'Blast', 'Loud'],
     'icons/weapons/artillery/mount-weapon-sprayer-chem-green-purple.webp',
     'Sold as an ash-and-growth clearance head for reclamation rigs. Nobody buying one is clearing '
     'ash. It hoses the lane in front of the bumper and leaves it burning.'),

    ('lanternhead', 'Lanternhead', 'Lanternhead', 'Nyx Streetlight', 'turret grenade thrower',
     3, 'military', 9500, 4, 10, 'fire', 'Medium', 'heavy', 'medium', 'turret',
     ['Mounted', 'Turret', 'Vehicle', 'Blast', 'Loud'],
     'icons/weapons/artillery/mount-weapon-launcher-steel.webp',
     'A low-velocity thrower on a powered ring, lobbing its rounds over cover instead of through it. '
     'Cartel crews light a block with it and call that street lighting.'),

    ('crownfire', 'Crownfire', 'Crownfire', 'Ironclad Traverse Autocannon', 'powered turret autocannon',
     3, 'military', 13000, 4, 11, 'AP', 'Long', 'heavy', 'medium', 'turret',
     ['Mounted', 'Turret', 'Vehicle', 'Auto', 'Loud'],
     'icons/weapons/artillery/mount-weapon-cannon-steel.webp',
     'The gun that made Ironclad convoy escort a solved problem: a full-traverse autocannon that '
     'walks its burst through engine blocks and the wall behind them.'),

    ('hailstorm', 'Hailstorm', 'Hailstorm', 'Ironclad Rotary Battery', 'integrated rotary gun battery',
     4, 'prototype', 30000, 5, 14, 'kinetic', 'Long', 'anti-veh', 'heavy', 'integrated',
     ['Mounted', 'Integrated', 'Vehicle', 'Auto', 'Loud'],
     'icons/weapons/guns/gun-chain-gatling-heavy.webp',
     'Not a gun you bolt on — a battery the frame is rebuilt around, drawing off the drive and '
     'feeding from a bin in the floor. It does not aim so much as erase an arc.'),

    ('godsfinger', 'Godsfinger', 'God’s-Finger', 'Ferrum Breach Cannon',
     'integrated anti-vehicle cannon',
     4, 'prototype', 38000, 5, 14, 'AP', 'Extreme', 'anti-veh', 'heavy', 'integrated',
     ['Mounted', 'Integrated', 'Vehicle', 'Loud'],
     'icons/weapons/artillery/cannon-tech-white.webp',
     'One barrel, one recoil stage, one job: put a hole through whatever is on the far side of the '
     'overpass. Riggers who own one talk about it the way priests talk about judgment.'),

    ('quiverframe', 'Quiverframe', 'Quiverframe', 'Kestrel Guided Rack', 'integrated missile rack',
     4, 'prototype', 44000, 5, 14, 'fire', 'Extreme', 'anti-veh', 'heavy', 'integrated',
     ['Mounted', 'Integrated', 'Vehicle', 'Blast', 'Smart-ready'],
     'icons/weapons/artillery/missile-rocket-launch-orange.webp',
     'A flush rack of guided tubes faired into the hull, cued off the rig’s own sensor lock. '
     'Kestrel sells it as a survey package. The survey it performs is of a rooftop, briefly.'),
]

TAG_NOTES = {
    'Blast': '<p><strong>Blast:</strong> hits an area.</p>',
    'Auto': '<p><strong>Auto:</strong> sustained fire — an <strong>Ammo Bin</strong> (§5F) on '
            'the same machine keeps it talking.</p>',
    'Turret': '<p><strong>Turret:</strong> needs a powered ring — only a <strong>Turret Ring</strong> '
              'will take it, and it fires through that kit’s wide arc.</p>',
    'Integrated': '<p><strong>Integrated:</strong> a package the frame is rebuilt around — only a '
                  '<strong>Heavy Hardpoint</strong> will take it.</p>',
    'Drone-scale': '<p><strong>Drone-scale:</strong> light enough that a Personal or Light frame keeps '
                   'its trim carrying one.</p>',
    'Dual-feed': '<p><strong>Dual-feed:</strong> pairs cleanly with a <strong>Twin Mount</strong>’s '
                 'shared feed.</p>',
    'Smart-ready': '<p><strong>Smart-ready:</strong> takes a Smartlink / Smart-Scope cleanly, and rides '
                   'the machine’s own sensor lock.</p>',
}

os.makedirs(OUT_DIR, exist_ok=True)

folder = {
    "_id": FOLDER_ID,
    "_key": "!folders!%s" % FOLDER_ID,
    "name": "GHOSTWIRE.Gear.Folders.WeaponsMounted",
    "type": "Item",
    "folder": "XLspd2sc9I6l34wi",
    "description": "",
    "color": None,
    "sorting": "a",
    "sort": 22000,
    "flags": {},
}
io.open(os.path.join(OUT_DIR, '_folder.json'), 'w', encoding='utf8', newline='\n').write(
    json.dumps(folder, indent=2, ensure_ascii=False) + '\n')

lang_items = {}
master_rows = []
for (dsid, key, name, corp, sci, ech, avail, price, slots, dmg, dtype, rng, band,
     mscale, mtype, tags, img, blurb) in SKUS:
    item_id = keep_id(os.path.join(OUT_DIR, '%s.json' % dsid), 'gw0312-' + dsid)
    gear = {
        "echelon": ech,
        "availability": avail,
        "price": price,
        "modSlots": slots,
        "tags": tags,
        "modFamily": ["weapon"],
        "damage": dmg,
        "damageType": dtype,
        "range": rng,
        "weaponBand": band,
        "mountScale": mscale,
        "vehicleMount": True,
    }
    if mtype:
        gear["mountType"] = mtype
    doc = {
        "_id": item_id,
        "_key": "!items!%s" % item_id,
        "name": "GHOSTWIRE.Gear.Items.%s.Name" % key,
        "type": "treasure",
        "img": img,
        "system": {
            "description": {"value": "GHOSTWIRE.Gear.Items.%s.Description" % key, "director": ""},
            "source": {"book": "Ghostwire Core Rulebook", "page": "Master Gear List",
                       "license": "Draw Steel Creator License"},
            "_dsid": dsid,
            "kind": "weapon",
            "category": "",
            "echelon": ech,
            "keywords": ["heavy"],
            "quantity": 1,
            "project": {"prerequisites": "", "source": "", "rollCharacteristic": [],
                        "yield": {"amount": "1", "display": ""}, "goal": None},
        },
        "effects": [],
        "folder": FOLDER_ID,
        "sort": 0,
        "ownership": {"default": 0},
        "flags": {"draw-steel-ghostwire": {"gear": gear}},
    }
    io.open(os.path.join(OUT_DIR, '%s.json' % dsid), 'w', encoding='utf8', newline='\n').write(
        json.dumps(doc, indent=2, ensure_ascii=False) + '\n')

    tag_line = '[%s], %s' % (BAND_LABEL[band], ', '.join(tags))
    parts = [
        '<p><em>%s · %s · %s</em></p>' % (name, corp, sci),
        '<p><strong>Echelon</strong> %d · <strong>Availability:</strong> %s · '
        '<strong>Cost:</strong> ¥%s · <strong>Mod slots:</strong> %s · '
        '<strong>Tags:</strong> %s</p>' % (ech, AVAIL_LABEL[avail], format(price, ','), slots, tag_line),
        '<p><strong>Weapon Base:</strong> %d %s (%s band) · <strong>Range:</strong> %s</p>'
        % (dmg, dtype, BAND_LABEL[band], rng),
        '<p>%s</p>' % blurb,
        '<p><em>Kit doctrine (if any) still supplies Draw Steel damage/Stamina bands; this item’s '
        'Weapon Base / armor profile is the object. Gear costs ¥; Kit doctrine never does.</em></p>',
        '<p><strong>Vehicle mount (%s scale):</strong> hardpoint hardware, not a gun you carry. Bolt it '
        'onto an installed <strong>%s</strong> on a drone or vehicle (§5F Weaponry kit — one '
        'kit at a time) with <em>Mount on…</em> from the weapon’s row; <em>Unmount weapon</em> '
        'frees the hardpoint. Fired with <strong>Gunnery</strong> — Rigged Fire from the pilot’s '
        'seat. Deploy mirrors it onto the machine’s Inventory.</p>' % (mscale, SCALE_KITS[mscale]),
    ]
    for tag in tags:
        if tag in TAG_NOTES:
            parts.append(TAG_NOTES[tag])
    if slots:
        parts.append('<p><strong>Mod slots (%d):</strong> Fill them with weapon mods from '
                     '<strong>Ghostwire Mods · Weapon Mods</strong>: %s. Installing is a downtime '
                     'Project (§Craft) keyed to each mod’s skill (Electronics or Repair); '
                     'toggling an installed mod is a field action.</p>' % (slots, WEAPON_MOD_LINKS))
    lang_items[key] = {"Name": name, "Description": ''.join(parts)}

    master_rows.append('| %s / %s / %s | %s | %d | %s | %d %s | %s | %d | %s | [%s] %s |' % (
        name, corp, sci, TIER_OF_ECHELON[ech], AVAIL_NUM[avail], format(price, ','), dmg, dtype,
        rng, slots, mscale + (' ' + mtype if mtype else ''), BAND_LABEL[band], ' '.join(tags)))

# ---------------------------------------------------------------- lang/en.json
lang_path = 'lang/en.json'
lang = json.load(io.open(lang_path, encoding='utf8'))
G = lang['GHOSTWIRE']
G['Gear']['Folders']['WeaponsMounted'] = 'Vehicle & Mounted Weapons'
G['Gear']['Items'].update(lang_items)
io.open(lang_path, 'w', encoding='utf8', newline='\n').write(
    json.dumps(lang, indent=2, ensure_ascii=False) + '\n')

print('wrote %d SKUs + lang' % len(SKUS))
print()
print('| Name *(slang / corp / sci)* | Tier | Avail | Cost \xa5 | Damage | Range | Mod Slots | Mount | Tags |')
print('|---|---|---|---|---|---|---|---|---|')
for row in master_rows:
    print(row)
