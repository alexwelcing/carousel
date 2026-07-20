#!/usr/bin/env python3
"""
fix_broken_copy.py — surgical replacement of broken engine output in
src/data/roles.ts. Targets the patterns emitted by `expand_similar_targets.py`
and the gerund-to-verb rewriter that produced nonsense like "I manatt".

Patterns fixed:
  1. tagline: '[ AI · AGENTS · DEVELOPER ]' → '[ AI · AGENTS ]'
     (3-tag Pillar for 2-tag Pillar — bogus, never legit)
  2. headline: 'I manatt document-AI ... I ship trustworthy AI on me — Built AI-based document scanning an'
     → 'I led document-AI ... I ship trustworthy AI on messy regulated documents.'
     (gerund-to-verb rewriter bug, truncated end)
  3. detail: 'Worked hands-on with Claude, OpenAI, Gemini, MiniMax, Copilot, and Z.ai as integration partners, not just API consumers.'
     → 'Worked hands-on with Claude, OpenAI, Gemini, and Copilot as integration partners, not just API consumers.'
     (data leak from engine pipeline; truncated "Z.ai" → remove)
  4. intro: same fix (different ending punctuation)

The fix is idempotent: running this script twice produces the same result
as running it once.
"""
import re
from pathlib import Path

PATH = Path("/Users/alexwelcing/Documents/carousel/src/data/roles.ts")

# Read the source
src = PATH.read_text()
original = src

# 1. Fix the broken "AI · AGENTS · DEVELOPER" tagline (3-tag Pillar
#    that expand_similar_targets.py wrongly generated).
# Every block using it is broken — this is a bogus tokenization.
TAGLINE_BROKEN = 'tagline: "[ AI \u00b7 AGENTS \u00b7 DEVELOPER ]"'
TAGLINE_FIXED = 'tagline: "[ AI \u00b7 AGENTS ]"'
src = src.replace(TAGLINE_BROKEN, TAGLINE_FIXED)

# 2. Fix the broken headline ending in "I ship trustworthy AI on me — Built AI-based document scanning an"
#    This is the same headline for all "document-AI" pillar roles.
#    The correct ending is: I ship trustworthy AI on messy regulated documents.
GOOD_HEADLINE = (
    "I led document-AI (extraction/accuracy on regulated legal docs) as a "
    "direct analog to claims/denials accuracy: I ship trustworthy AI on "
    "messy regulated documents."
)
# Replace the broken headline. The broken version starts with "I manatt document-AI"
# and we need to match the whole quote. Use a non-greedy match.
src = re.sub(
    r'"I manatt document-AI[^"]*"',
    '"' + GOOD_HEADLINE + '"',
    src,
)

# 3. Fix the "Worked hands-on with Claude, OpenAI, Gemini, MiniMax, Copilot, and Z.ai" data leak.
#    Two variants exist:
#    a) detail: "Worked hands-on with Claude, OpenAI, Gemini, MiniMax, Copilot, and Z.ai as integration partners, not just API consumers."
#    b) intro: "Worked hands-on with Claude, OpenAI, Gemini, MiniMax, Copilot, and Z.ai as integration partners."

GOOD_VENDOR_DETAIL = (
    "Worked hands-on with Claude, OpenAI, Gemini, and Copilot as integration partners, not just API consumers."
)
GOOD_VENDOR_INTRO = "Worked hands-on with Claude, OpenAI, Gemini, and Copilot as integration partners."

src = src.replace(
    "Worked hands-on with Claude, OpenAI, Gemini, MiniMax, Copilot, and Z.ai as integration partners, not just API consumers.",
    GOOD_VENDOR_DETAIL,
)
src = src.replace(
    "Worked hands-on with Claude, OpenAI, Gemini, MiniMax, Copilot, and Z.ai as integration partners.",
    GOOD_VENDOR_INTRO,
)

# Write only if changed
if src != original:
    PATH.write_text(src)
    print("  wrote " + str(PATH))
else:
    print("  no changes needed (file was already fixed)")

# Print stats
adonis_count = len(re.findall(r"  \{\n    slug: \"adonis-", src, re.S))
print("  adonis blocks in file: " + str(adonis_count))
print("  'I manatt document-AI' remaining: " + str(len(re.findall(r'I manatt document-AI', src))))
print("  'AI · AGENTS · DEVELOPER' remaining: " + str(len(re.findall(r'AI \u00b7 AGENTS \u00b7 DEVELOPER', src))))
print("  'MiniMax' remaining: " + str(src.count('MiniMax')))
print("  'document scanning an' remaining: " + str(len(re.findall(r'document scanning an', src))))
print("  'I ship trustworthy AI on messy' (good) count: " + str(len(re.findall(r'I ship trustworthy AI on messy', src))))
print("  'I ship trustworthy AI on me' (bad) count: " + str(len(re.findall(r'I ship trustworthy AI on me\b', src))))