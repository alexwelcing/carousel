#!/usr/bin/env python3
"""
build_sheet_csv.py — generate Google-Sheets-friendly CSVs with all 2,462
welc.ing packets, plus the internal submissionUrl / submissionStatus
fields captured by the track-down-application-pages skill.

Output: 10 CSVs at /Users/alexwelcing/Documents/carousel/.internal/chunk-NN-of-10/
  - chunk-01-of-10/sheet-import.csv  (~246 rows)
  - chunk-02-of-10/sheet-import.csv  (~246 rows)
  - ...
  - chunk-10-of-10/sheet-import.csv  (~246 rows)

This chunking keeps each file well under Google Sheets' 10-million-cell
limit and lets the user import each sheet independently.

Columns (15 per row, each header is a literal header for the spreadsheet):
  - Company
  - Role Title
  - Location
  - Slug
  - Source (curated-role / top-target)
  - Submission URL    (the actual external apply URL, internal-only data)
  - Submission Status (live / dead / unknown / synthetic)
  - Submission Fingerprint (short SHA1 prefix of last-validated body)
  - Welc.ing Packet URL    (https://welc.ing/r/<id> — the URL the candidate
                             follows to reach the per-role landing page)
  - Resume PDF (light)
  - Resume PDF (print)
  - Cover Letter TXT
  - Cover Letter PDF
  - Pitch HTML
  - Pitch MP4 (if present)
"""
from __future__ import annotations

import csv
import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path.home() / "job-pipeline/scripts"))
from validate_submission_urls import parse_role_blocks  # noqa: E402

CAROUSEL = Path("/Users/alexwelcing/Documents/carousel")
MANIFEST = CAROUSEL / "public/applications/manifest.json"
ROLES_TS = CAROUSEL / "src/data/roles.ts"
# Top-level directory so the user can find the CSVs easily when uploading
# to Google Sheets. The path is `~/Documents/carousel/sheet-imports/`.
OUT_DIR = CAROUSEL / "sheet-imports"
DATE = datetime.now(timezone.utc).strftime("%Y-%m-%d")
NUM_CHUNKS = 10


def collect_submission_metadata() -> dict:
    """Parse roles.ts and return {slug: {submissionUrl, submissionStatus, submissionFingerprint}}."""
    out: dict = {}
    src = ROLES_TS.read_text()
    rows = parse_role_blocks(src)
    for r in rows:
        slug = r["slug"]
        out[slug] = {
            "submissionUrl": r.get("submissionUrl") or "",
            "submissionStatus": r.get("currentStatus") or "",
            "submissionFingerprint": r.get("submissionFingerprint") or "",
        }
    return out


def _abs(rel_path: str) -> str:
    if not rel_path:
        return ""
    return f"https://welc.ing{rel_path}"


def _row_for(p: dict, submission: dict) -> list:
    """Build one CSV row from a manifest packet + submission metadata."""
    slug = p["slug"]
    sub = submission.get(slug, {})
    return [
        p["company"],
        p["roleTitle"],
        p["location"],
        slug,
        p["source"],
        sub.get("submissionUrl", ""),
        sub.get("submissionStatus", ""),
        sub.get("submissionFingerprint", ""),
        f"https://welc.ing/r/{p['shareId']}",
        _abs(p["resumeLightPdf"]),
        _abs(p["resumePdf"]),
        _abs(p["coverLetterTxt"]),
        _abs(p["coverLetterPdf"]),
        _abs(p["pitchHtml"]),
        _abs(p.get("pitchVideoMp4", "")) if p.get("pitchVideoMp4") else "",
    ]


HEADER = [
    "Company",
    "Role Title",
    "Location",
    "Slug",
    "Source",
    "Submission URL",
    "Submission Status",
    "Submission Fingerprint",
    "Welc.ing Packet URL (welc.ing/r/<id>)",
    "Resume PDF (light)",
    "Resume PDF (print)",
    "Cover Letter TXT",
    "Cover Letter PDF",
    "Pitch HTML",
    "Pitch MP4 (if present)",
]


def build_chunks() -> list:
    """Generate 10 CSVs split from the manifest, with chunk-01-of-10/chunk-10-of-10 subdirs."""
    manifest = json.loads(MANIFEST.read_text())
    packets = manifest["packets"]
    submission = collect_submission_metadata()

    n = len(packets)
    chunk_size = math.ceil(n / NUM_CHUNKS)
    written: list = []

    for i in range(NUM_CHUNKS):
        start = i * chunk_size
        end = min(start + chunk_size, n)
        if start >= end:
            break  # no more rows
        chunk_dir = OUT_DIR / f"chunk-{i + 1:02d}-of-{NUM_CHUNKS:02d}"
        chunk_dir.mkdir(parents=True, exist_ok=True)
        out_path = chunk_dir / "sheet-import.csv"

        with out_path.open("w", newline="") as f:
            w = csv.writer(f)
            w.writerow(HEADER)
            for p in packets[start:end]:
                w.writerow(_row_for(p, submission))

        written.append({
            "chunk": i + 1,
            "path": out_path,
            "rows": end - start,
            "size_bytes": out_path.stat().st_size,
        })

    return written


if __name__ == "__main__":
    chunks = build_chunks()
    print(f"  wrote {len(chunks)} chunks to {OUT_DIR}/")
    for c in chunks:
        print(f"    chunk {c['chunk']:2d}/10  rows={c['rows']:4d}  "
              f"size={c['size_bytes']:7d}  path={c['path'].relative_to(CAROUSEL)}")