# -*- coding: utf-8 -*-
"""0.3.112 — insert §3H (Vehicle & Mounted Weapons) into docs/masters/GHOSTWIRE_GEAR_MASTER.md.

The table is re-derived from the shipped SKUs so the master and src/packs cannot drift.
Run from the module root: python tools/_gen-gear-master-3h.py
"""
import json, io, os, glob

MODULE_ID = 'draw-steel-ghostwire'
SRC = 'src/packs/gear/weapons/mounted'
MASTER = 'docs/masters/GHOSTWIRE_GEAR_MASTER.md'

lang = json.load(io.open('lang/en.json', encoding='utf8'))['GHOSTWIRE']['Gear']['Items']

TIER_OF_AVAIL = {'street': 'T5', 'professional': 'T4', 'restricted': 'T3',
                 'military': 'T2', 'prototype': 'T1'}
AVAIL_NUM = {'street': 5, 'professional': 4, 'restricted': 3, 'military': 2, 'prototype': 1}
BAND_LABEL = {'heavy': 'Heavy', 'anti-veh': 'Anti-veh', 'medium': 'Medium', 'light': 'Light'}
TIER_ORDER = ['T5', 'T4', 'T3', 'T2', 'T1']

rows = []
for path in sorted(glob.glob(os.path.join(SRC, '*.json'))):
    if path.endswith('_folder.json'):
        continue
    d = json.load(io.open(path, encoding='utf8'))
    gear = d['flags'][MODULE_ID]['gear']
    key = d['name'].replace('GHOSTWIRE.Gear.Items.', '').replace('.Name', '')
    name = lang[key]['Name']
    # the tri-register line is the first <em> of the card
    desc = lang[key]['Description']
    tri = desc.split('<em>', 1)[1].split('</em>', 1)[0]
    mount = gear['mountScale'] + ((' ' + gear['mountType']) if gear.get('mountType') else '')
    tier = TIER_OF_AVAIL[gear['availability']]
    rows.append((TIER_ORDER.index(tier), gear['price'], (
        '| %s | %s | %d | %s | %d %s | %s | %d | %s | [%s] %s |' % (
            tri.replace(' · ', ' / '), tier, AVAIL_NUM[gear['availability']],
            format(gear['price'], ','), gear['damage'], gear['damageType'], gear['range'],
            gear['modSlots'], mount, BAND_LABEL[gear['weaponBand']],
            ' '.join(t for t in gear['tags'] if t != 'Mounted')))))
rows.sort()
table = '\n'.join(r[2] for r in rows)

SECTION = """### 3H — Vehicle & Mounted Weapons (hardpoint hardware)

*New in 0.3.112. §5F says it plainly: "Mounted weapons themselves come from Category 3 unless the
weaponry SKU is an integrated package." These are those weapons — guns with no hand-held mode, bought
to be bolted onto an installed **Weaponry kit** (§5F) on a drone or vehicle. Every row is fired with
**Gunnery**, which in play means the pilot's **Rigged Fire** (or the machine's own action), never Heavy
Weapons. Category-3 heavies that already ship tagged **Mounted** — Wallbreaker, Siege Missile — remain
mountable and are still Heavy Weapons in a hero's hands; the skill follows where the gun sits.*

**Mount scale** is the ladder the kit has to reach: **category-3 < medium < heavy**. A mount takes any
gun at its own scale or below, so a Turret Ring carries a Category-3 gun happily and a Gun Rack cannot
swallow an anti-vehicle cannon. Two extra requirements run the other way: a **turret** gun needs a
powered ring (Turret Ring only), and an **integrated** package needs the battery mount (Heavy Hardpoint
only). Kit capacity is the same table §5F prints — Gun Rack 1, Twin Mount 2, Turret Ring 1, Heavy
Hardpoint 1.

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Range | Mod Slots | Mount | Tags |
|---|---|---|---|---|---|---|---|---|
%s

*(Availability, price band and mod slots still come from Item Tier alone, §F5/§F6. Weapon Base still
reads through the Damage-Bridge: Heavy ≈ 9, Anti-veh ≈ 14, ±1–2 within band. **Auto** rows want an
**Ammo Bin** (§5F) on the same machine for sustained fire. Buying one: the **Hardpoint Bay** kiosk
preset stocks this whole table plus the Mounted heavies.)*

---

""" % table

master = io.open(MASTER, encoding='utf8').read()
anchor = '---\n\n## Category 4 — Matrix Gear'
assert anchor in master, 'Category 4 anchor not found'
if '### 3H ' in master:
    start = master.index('### 3H ')
    end = master.index(anchor, start)
    master = master[:start] + SECTION + master[end:]
else:
    master = master.replace(anchor, SECTION + anchor.split('---\n\n', 1)[1], 1)
io.open(MASTER, 'w', encoding='utf8', newline='\n').write(master)
print('gear master §3H: %d rows' % len(rows))
