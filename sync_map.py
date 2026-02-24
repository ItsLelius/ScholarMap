#!/usr/bin/env python3
"""
Run this every time you add/edit a scholarship in scholarships.js:

  python sync_map.py

It reads js/scholarships.js and inlines the updated data into map.html
so the map always shows your latest scholarships.
"""

import re

with open("js/scholarships.js", "r", encoding="utf-8") as f:
    scholarships_js = f.read()

with open("map.html", "r", encoding="utf-8") as f:
    map_html = f.read()

pattern = r'<!-- Scholarship data — inlined so it works both standalone and inside iframe -->.*?<script>.*?</script>'
replacement = f"""<!-- Scholarship data — inlined so it works both standalone and inside iframe -->
<script>
{scholarships_js}
</script>"""

new_map = re.sub(pattern, replacement, map_html, flags=re.DOTALL)

if new_map == map_html:
    print("Nothing changed — marker not found in map.html")
else:
    with open("map.html", "w", encoding="utf-8") as f:
        f.write(new_map)
    count = scholarships_js.count("id:'") + scholarships_js.count('id:"')
    print(f"map.html synced — {count} scholarships loaded")
    print("Hard refresh your browser (Ctrl+Shift+R) to see changes.")