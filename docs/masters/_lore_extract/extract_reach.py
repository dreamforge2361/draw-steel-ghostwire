from pathlib import Path
from pypdf import PdfReader
import re
pdf = Path(r"C:\Users\mfran\Dropbox\ai-brain\projects\draw steel\GHOSTWIRE - The Ossian Reach Handbook.pdf")
out = Path(r"C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\draw-steel-ghostwire\docs\masters\_lore_extract\Ossian_Reach_hits.txt")
pat = re.compile(r"raptor|t-?rex|dino|saur|fauna|jungle|beast|predator|ganger|patrol|guard|enforcer|raider|ranger|wastes|mutant|spirit|demon|hollow|metermen|viper|saint|king|aureole|greenline|ironclad|cinderhold|feral|wildlife|creature|pack", re.I)
r = PdfReader(str(pdf))
print("pages", len(r.pages))
hits = []
for i in range(len(r.pages)):
    try:
        t = r.pages[i].extract_text() or ""
    except Exception as e:
        print("fail page", i+1, e)
        continue
    for line in t.splitlines():
        s = " ".join(line.split())
        if 12 < len(s) < 280 and pat.search(s):
            hits.append(f"p{i+1}: {s}")
out.write_text("\n".join(hits), encoding="utf-8")
print("hits", len(hits))
for h in hits:
    if re.search(r"raptor|dino|t-?rex|saur|fauna|jungle|beast|predator|wildlife|creature|raider|feral", h, re.I):
        print(h)
