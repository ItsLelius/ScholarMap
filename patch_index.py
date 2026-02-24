#!/usr/bin/env python3
"""
Run this in your project folder:
  python patch_index.py

Changes both "Explore the Map" buttons to open app.html?view=map
so the map opens inside the app shell with full data.
"""

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Patch 1 — Hero section big blue CTA button
old1 = '<a href="app.html" class="group relative w-full sm:w-auto text-center text-white font-black py-4 px-12 rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,67,191,0.35)] hover:shadow-[0_20px_60px_rgba(26,67,191,0.45)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style="background-color:#1A43BF">'
new1 = '<a href="app.html?view=map" class="group relative w-full sm:w-auto text-center text-white font-black py-4 px-12 rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(26,67,191,0.35)] hover:shadow-[0_20px_60px_rgba(26,67,191,0.45)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95" style="background-color:#1A43BF">'

# Patch 2 — Footer "Explore the Map" button
old2 = '<a href="app.html" class="inline-flex items-center gap-2 bg-[#1A43BF] hover:brightness-110 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/30">'
new2 = '<a href="app.html?view=map" class="inline-flex items-center gap-2 bg-[#1A43BF] hover:brightness-110 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/30">'

count = 0

if old1 in html:
    html = html.replace(old1, new1, 1)
    count += 1
    print("✅ Hero CTA patched")
else:
    print("⚠️  Hero CTA not found — may already be patched")

if old2 in html:
    html = html.replace(old2, new2, 1)
    count += 1
    print("✅ Footer CTA patched")
else:
    print("⚠️  Footer CTA not found — may already be patched")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"\nDone. {count}/2 patches applied to index.html")