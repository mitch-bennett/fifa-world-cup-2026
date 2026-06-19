# Data Sources and Accuracy Policy

This project distinguishes between `sample`, `partial-official`, and `official` data.

## Current Status

- Status: `partial-official`
- Source type: official FIFA references, normalized into a subset JSON dataset
- Scope: 2 teams per group + 1 representative fixture per group

## Source References (Current)

- FIFA final draw results (group assignments):
  - https://www.fifa.market/en/articles/final-draw-results
- FIFA media release (updated 104-match schedule context):
  - https://tickets.fifa.com/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches
- FIFA match schedule article mirror used for match-number/date/venue lookup:
  - https://fifa-com.app/en/articles/View-the-FIFA-World-Cup-26%E2%84%A2-match-schedule

## Files in This Repo

- `src/data/countries.json`
- `src/data/groups.json`
- `src/data/schedule.json`
- `src/data/data-status.json`

## Phase A Workflow

1. Use authoritative references for group and fixture records.
2. Normalize into project JSON schemas.
3. Record references + verification date in `src/data/data-status.json`.
4. Upgrade status:
   - `sample` -> `partial-official` for verified subsets
   - `partial-official` -> `official` only when full 48-team / 104-match data is verified

## Policy

- Do not mark status `official` until full dataset verification is complete.
- If any record is inferred or incomplete, keep status at `sample` or `partial-official`.
