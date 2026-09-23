# -*- coding: utf-8 -*-
"""0.3.112 — insert the GHOSTWIRE.Mounts UI block and the Hardpoint Bay kiosk preset labels."""
import json, io
from collections import OrderedDict

MOUNTS = OrderedDict([
    ("Menu", OrderedDict([
        ("Mount", "Mount on…"),
        ("Unmount", "Unmount weapon"),
    ])),
    ("Title", "Mount {weapon}"),
    ("Prompt", "Bolt <strong>{weapon}</strong> ({scale} scale) onto an installed Weaponry kit on a drone or "
               "vehicle this hero owns. Fitting a gun to a hardpoint is a downtime §Craft Project at the "
               "table; this records the result. A mounted gun is fired with <strong>Gunnery</strong>."),
    ("Kit", "Hardpoint"),
    ("Confirm", "Mount"),
    ("Mounted", "{weapon} mounted on {kit} (hardpoints {used} / {hardpoints})."),
    ("Unmounted", "{weapon} unmounted from {kit}; the hardpoint is free."),
    ("ChatTitle", "Weapon mounted"),
    ("ChatBody", "{actor} mounted {weapon} on {kit} ({chassis})."),
    ("ChatHardpoints", "Hardpoints {used} / {hardpoints} · fired with {skill}."),
    ("ChatFielded", "Mirrored onto the fielded machine {machine}."),
    ("SheetMounted", "Mounted: {weapons} ({used} / {hardpoints})"),
    ("SheetMountedOn", "Mounted on: {kit} — {chassis}"),
    ("SheetMountable", "Mountable: needs a {scale}-scale hardpoint (§5F Weaponry kit)."),
    ("Short", OrderedDict([
        ("NotWeapon", "not a weapon"),
        ("NotMount", "not a hardpoint"),
        ("SameActor", "different owner"),
        ("KitNotInstalled", "kit not installed"),
        ("AlreadyMounted", "already mounted"),
        ("NotMountable", "not mount hardware"),
        ("TooLarge", "needs a {scale} mount"),
        ("NeedsTurret", "needs a powered turret"),
        ("NeedsIntegrated", "needs an integrated battery"),
        ("NoHardpoints", "hardpoints full"),
    ])),
    ("Blocked", OrderedDict([
        ("NotWeapon", "{weapon} isn’t a Ghostwire weapon."),
        ("NotMount", "{kit} isn’t a Weaponry kit, so nothing mounts on it."),
        ("SameActor", "{weapon} and {kit} must belong to the same hero."),
        ("KitNotInstalled", "{kit} isn’t installed on a drone or vehicle yet. Install the kit first."),
        ("AlreadyMounted", "{weapon} is already mounted on {kit}. Unmount it first."),
        ("NotMountable", "{weapon} isn’t mount hardware — only Heavy / Anti-veh pieces and the "
                         "vehicle-mount SKUs fit a hardpoint."),
        ("TooLarge", "{weapon} needs a {scale}-scale mount; {kit} is {kitScale}."),
        ("NeedsTurret", "{weapon} needs a powered turret ring; {kit} has no traverse."),
        ("NeedsIntegrated", "{weapon} is an integrated package; only a Heavy Hardpoint will take it."),
        ("NoHardpoints", "{kit} has {used} / {hardpoints} hardpoints filled ({mounted}). Unmount one first."),
        ("NoKits", "This hero owns no installed Weaponry kit. Install a Gun Rack, Twin Mount, Turret Ring, "
                   "or Heavy Hardpoint on a drone or vehicle first."),
    ])),
])

path = 'lang/en.json'
lang = json.load(io.open(path, encoding='utf8'), object_pairs_hook=OrderedDict)
G = lang['GHOSTWIRE']

# Insert Mounts right after Mods so the file reads in system order.
rebuilt = OrderedDict()
for key, value in G.items():
    rebuilt[key] = value
    if key == 'Mods':
        rebuilt['Mounts'] = MOUNTS
if 'Mounts' not in rebuilt:
    rebuilt['Mounts'] = MOUNTS
lang['GHOSTWIRE'] = rebuilt

G = lang['GHOSTWIRE']
G['Kiosk']['Presets']['VehicleWeapons'] = OrderedDict([
    ("Name", "Vehicle weapons"),
    ("ActorName", "Hardpoint Bay"),
    ("Tagline", "Guns that bolt on — vehicle and drone mount SKUs, plus the Mounted heavies."),
])

io.open(path, 'w', encoding='utf8', newline='\n').write(
    json.dumps(lang, indent=2, ensure_ascii=False) + '\n')
print('lang: GHOSTWIRE.Mounts +', len(MOUNTS), 'keys; Kiosk.Presets.VehicleWeapons added')
