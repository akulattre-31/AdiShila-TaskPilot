import re

with open('stitch_screen.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Convert class= to className=
html = html.replace('class=', 'className=')
# Fix self-closing tags
html = re.sub(r'(<(img|input)[^>]+)(?<!/)>', r'\1 />', html)

# Convert inline styles
html = html.replace('style="font-variation-settings: \'FILL\' 1;"', 'style={{ fontVariationSettings: "\\"FILL\\" 1" }}')

aside_match = re.search(r'(<aside.*?</aside>)', html, re.DOTALL)
header_match = re.search(r'(<header.*?</header>)', html, re.DOTALL)
main_match = re.search(r'(<main.*?</main>)', html, re.DOTALL)

if aside_match:
    with open('aside.jsx', 'w', encoding='utf-8') as f: f.write(aside_match.group(1))
if header_match:
    with open('header.jsx', 'w', encoding='utf-8') as f: f.write(header_match.group(1))
if main_match:
    with open('main.jsx', 'w', encoding='utf-8') as f: f.write(main_match.group(1))

print("Extraction complete.")
