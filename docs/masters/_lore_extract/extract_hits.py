from pathlib import Path
from pypdf import PdfReader
import re

folder = Path(r"C:\Users\mfran\Dropbox\ai-brain\projects\draw steel")
out = Path(r"C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\draw-steel-ghostwire\docs\masters\_lore_extract")
out.mkdir(parents=True, exist_ok=True)
pat = re.compile(
    r"raptor|t-?rex|tyranno|dinosaur|saurian|ganger|enforcer|patrol|fauna|jungle|predator|beast|"
    r"hollow men|metermen|glass viper|rust saint|ninth ward|aureole|greenline|ironclad|"
    r"rogue spirit|black ice|sprite|security|demon|angel|war dog|cinderhold|ranger",
    re.I,
)
interesting = re.compile(
    r"raptor|dino|t-?rex|saur|fauna|jungle|predator|ganger|enforcer|aureole|hollow|metermen|"
    r"viper|saint|king|beast|greenline|ironclad|cinderhold|ranger|sprite|demon|spirit",
    re.I,
)
for p in sorted(folder.glob("GHOSTWIRE*.pdf")):
    print("PDF", p.name)
    try:
        r = PdfReader(str(p))
    except Exception as e:
        print(" fail", e)
        continue
    hits = []
    for i, page in enumerate(r.pages):
        try:
            t = page.extract_text() or ""
        except Exception:
            continue
        for line in t.splitlines():
            s = " ".join(line.split())
            if 15 < len(s) < 240 and pat.search(s):
                hits.append(f"p{i+1}: {s}")
    dest = out / (re.sub(r"[^\w\-]+", "_", p.stem) + "_hits.txt")
    dest.write_text("\n".join(hits), encoding="utf-8")
    print(" pages", len(r.pages), "hits", len(hits))
    for h in hits:
        if interesting.search(h):
            print(h)
