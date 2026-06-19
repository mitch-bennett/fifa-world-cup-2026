# Data Sources and Accuracy Policy

This project distinguishes between `sample`, `partial-official`, and `official` data.

## Current Status

- Status: `partial-official`
- Source type: FIFA references normalized into local JSON
- Scope now in repo:
  - Full 48-team group structure (A-L)
  - 24 official-source opening group-stage fixtures
  - Not yet full 104-match schedule

## Source References (Current)

- FIFA final draw results:
  - https://www.fifa.market/en/articles/final-draw-results
- FIFA media release on updated schedule:
  - https://inside.fifa.com/organisation/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches
- FIFA schedule PDF (Digital Hub):
  - https://digitalhub.fifa.com/asset/4b5d4417-3343-4732-9cdf-14b6662af407/FWC26-Match-Schedule_English.pdf

## Files in This Repo

- `src/data/countries.json`
- `src/data/groups.json`
- `src/data/schedule.json`
- `src/data/data-status.json`

## Phase A Next Step

1. Import all remaining fixtures from the official schedule PDF.
2. Normalize all 104 matches into `src/data/schedule.json`.
3. Verify every team code appears in countries and groups.
4. Switch status to `official` only after complete validation.

## Policy

- Do not mark status `official` until full 48-team / 104-match verification is complete.
- Any inferred or placeholder values must keep status as `partial-official`.
