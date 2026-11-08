"""Index four CC0 / CC BY sound-effect collections on GitHub into one catalog (sfx_catalog.csv)."""
import csv, json, os, re, subprocess, urllib.parse
from concurrent.futures import ThreadPoolExecutor
H = '/home/claude'
EXT = ('.wav', '.ogg', '.mp3', '.flac')
SRC = [  # (local clone, owner/repo as on GitHub, subdirs to skip, licence, credit)
    ('lavenderdotpet/cc0-public-domain-sounds', 'lavenderdotpet/CC0-Public-Domain-Sounds', (), 'CC0-1.0', ''),
    ('code4fukui/sound-cc0', 'code4fukui/sound-cc0', (), 'CC0-1.0', ''),
    ('facebookincubator/meta-open-sound', 'facebookincubator/Meta-open-sound', ('systems',), 'CC-BY-4.0',
     '"Oculus Audio Pack 01" by Oculus VR, LLC, licensed under CC BY 4.0'),
]
# category: first rule whose words appear in the pack + file name wins
CATS = [
    ('music', r'jingle|music|cello|melod|song|loop_?music|sting(?!er)|piano|guitar'),
    ('voice', r'voice|vocal|voiceover|announc|speech|laugh|scream|grunt|breath|cough|sneez|gasp|moan|hum\b|whisper'),
    ('cat', r'\bcat\b|meow|purr|kitten|hiss'),
    ('creature', r'creature|monster|beast|growl|roar|zombie|demon|ghost|snarl|animal|dog|bark|bird|insect|frog'),
    ('footsteps', r'foot|step|walk|run\b|running|shoe|heel|jump|land'),
    ('door', r'door|latch|lock|key|knob|hinge|creak|gate|squeak|drawer|cabinet'),
    ('glass-break', r'glass|shatter|break|crash|smash|debris|crack|ceramic|plate'),
    ('impact', r'impact|hit|punch|thud|thump|bang|slam|knock|kick|bump|fall|drop|body|smack|slap|whack|collide'),
    ('whoosh', r'whoosh|woosh|swoosh|swish|swipe|wind_?up|transition|swing|fly|pass_?by'),
    ('horror', r'horror|scary|spooky|creepy|tension|riser|drone|dark|eerie|stinger|suspense|weird'),
    ('water', r'water|splash|drip|liquid|pour|bubble|slime|mud|rain|wet|plop'),
    ('ambience', r'amb|ambient|ambience|room ?tone|atmos|wind|forest|city|traffic|crowd|night|farm|construction|fan|weather|thunder|fire'),
    ('ui', r'interface|\bui\b|click|button|select|confirm|error|toggle|switch|tick|tap|notif|menu|back_|open_|close_|bong|pluck|scroll|maximi|minimi'),
    ('scifi', r'sci-?fi|laser|zap|space|robot|computer|digital|electr|beep|bleep|power|engine|alarm|phaser|glitch|synth'),
    ('retro-game', r'retro|arcade|8bit|chiptune|coin|pickup|powerup|jump_|rpg|casino|chip|dice|card'),
    ('weapon', r'gun|shot|pistol|rifle|weapon|explos|blast|sword|blade|knife|reload|warfork|grenade'),
    ('paper', r'paper|book|page|writ|pencil|pen\b|cutter|card'),
    ('mechanism', r'mechan|gear|machine|tool|saw|drill|motor|clock|cube|rummag|chair|can\b|bottle|pill|metal|wood'),
    ('household', r'kitchen|cup|mug|cutlery|spoon|fork|plate|keyboard|typing|phone|tv|switch'),
]
CATS.insert(0, ('music', r'^2\d{3}-\d\d-\d\d |2htc'))
CATS.append(('foley', r'cloth|plastic|rustl|cork|lid|toaster|silverware|box|toilet|rattle|spring|bag|zip|caster|texture|goosh|squish|melon|fuzz|record'))
# Oculus files are named by the UCS convention: the capitals before the first underscore are the category
UCS = {'AMB': 'ambience', 'FEET': 'footsteps', 'CREA': 'creature', 'ANML': 'creature', 'BIRD': 'creature', 'UI': 'ui', 'MUSC': 'music',
       'FGHT': 'impact', 'METL': 'impact', 'PLAS': 'impact', 'DSGN': 'horror', 'GORE': 'impact', 'VOX': 'voice', 'HMN': 'voice',
       'BLLT': 'weapon', 'WEAP': 'weapon', 'GUN': 'weapon', 'CLOTH': 'foley', 'OBJ': 'foley', 'WOOD': 'foley', 'VEGE': 'foley',
       'DOOR': 'door', 'DRWR': 'door', 'VEH': 'mechanism', 'TRN': 'mechanism', 'MECH': 'mechanism', 'MACH': 'mechanism', 'TOOL': 'mechanism',
       'CLOCK': 'mechanism', 'WATR': 'water', 'BOAT': 'water', 'SWSH': 'whoosh', 'WHSH': 'whoosh', 'WIND': 'ambience', 'TOON': 'retro-game'}
CRX = [(c, re.compile(p, re.I)) for c, p in CATS]
def words(s):
    s = re.sub(r'([a-z])([A-Z])', r'\1 \2', s)
    return [w for w in re.split(r'[^A-Za-z]+', s.lower()) if len(w) > 1 and w not in {'cc', 'sfx', 'wav', 'ogg', 'mp', 'flac', 'the', 'and', 'of', 'os', 'lp', 'loop'} or w == 'loop']
def dur(p):
    try: return round(float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], timeout=20)), 3)
    except Exception: return ''
rows = []
for local, gh, skip, lic, credit in SRC:
    root = f'{H}/{local}'
    sha = subprocess.check_output(['git', '-C', root, 'rev-parse', 'HEAD'], text=True).strip()
    for dp, dn, fn in os.walk(root):
        rel_d = os.path.relpath(dp, root)
        if rel_d.startswith('.git') or rel_d.split(os.sep)[0] in skip: dn[:] = []; continue
        for f in fn:
            if not f.lower().endswith(EXT) or f.startswith('._') or '__MACOSX' in dp: continue
            rel = os.path.normpath(os.path.join(rel_d, f))
            if gh.startswith('facebook') and '/wav/' in f'/{rel}': continue   # the Oculus pack ships wav + ogg; keep the ogg
            pack = rel.split(os.sep)[0] if os.sep in rel else gh.split('/')[1]
            if gh.startswith('facebook'): pack = 'oculus-audio-pack'
            name = os.path.splitext(f)[0]
            text = f'{pack} {rel}'.replace('_', ' ')
            cat = next((c for c, rx in CRX if rx.search(text)), 'misc')
            # the file's own name decides when the pack alone matched something broader
            own = next((c for c, rx in CRX if rx.search(name.replace('_', ' '))), None)
            if own: cat = own
            m = re.match(r'([A-Z]+)', name) if gh.startswith('facebook') else None
            if m:
                pre = next((k for k in sorted(UCS, key=len, reverse=True) if m.group(1).startswith(k)), None)
                if pre: cat = UCS[pre]
                if 'Scrm' in name or 'Laff' in name: cat = 'voice'
            tags = sorted(set(words(name) + words(pack)))[:14]
            rows.append({'id': '', 'category': cat, 'name': name, 'pack': pack, 'tags': ' '.join(tags), 'duration_s': '',
                         'format': f.rsplit('.', 1)[1].lower(), 'license': lic, 'credit': credit, 'repo': gh, 'path': rel.replace(os.sep, '/'),
                         'url': f'https://raw.githubusercontent.com/{gh}/{sha}/' + urllib.parse.quote(rel.replace(os.sep, '/')),
                         '_local': os.path.join(root, rel)})
with ThreadPoolExecutor(16) as ex:
    for r, d in zip(rows, ex.map(dur, [r['_local'] for r in rows])): r['duration_s'] = d
rows.sort(key=lambda r: (r['category'], r['pack'].lower(), r['name'].lower()))
seen = {}
for r in rows:
    base = re.sub(r'[^a-z0-9]+', '-', f"{r['category']}-{r['name']}".lower()).strip('-')[:60]
    seen[base] = seen.get(base, 0) + 1; r['id'] = base if seen[base] == 1 else f'{base}-{seen[base]}'
F = ['id', 'category', 'name', 'pack', 'tags', 'duration_s', 'format', 'license', 'credit', 'repo', 'path', 'url']
with open('/home/claude/sfxlib/sfx_catalog.csv', 'w', newline='') as fh:
    w = csv.DictWriter(fh, F); w.writeheader(); [w.writerow({k: r[k] for k in F}) for r in rows]
json.dump([{k: r[k] for k in F + ['_local']} for r in rows], open('/home/claude/sfxlib/_local.json', 'w'))
from collections import Counter
print(len(rows), Counter(r['category'] for r in rows).most_common(), Counter(r['license'] for r in rows))
