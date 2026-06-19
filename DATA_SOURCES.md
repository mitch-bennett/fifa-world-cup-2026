# Data Sources and Accuracy Policy

This project distinguishes between `sample`, `partial-official`, and `official` data.

## Current Status

- Status: `official`
- Scope in repo:
  - Full 48-team groups (A-L)
  - Full 104-match schedule

## Source References

Primary references:
- FIFA final draw results:
  - https://www.fifa.market/en/articles/final-draw-results
- FIFA updated schedule release:
  - https://inside.fifa.com/organisation/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches
- FIFA schedule PDF:
  - https://digitalhub.fifa.com/asset/4b5d4417-3343-4732-9cdf-14b6662af407/FWC26-Match-Schedule_English.pdf

Structured secondary source used to complete machine-readable fixture rows:
- https://www.fifaworldcupnews.com/fifa-world-cup-2026-fixtures/

## Normalization Notes

- Group-stage fixtures (matches 1-72) were parsed from structured secondary tables and code-mapped to the project schema.
- Official FIFA PDF match numbers and kickoff times were used to normalize all 104 match IDs and times.
- Knockout fixtures use pathway placeholders (`1A`, `W97`, etc.) until participants are determined.

## Files in This Repo

- `src/data/countries.json`
- `src/data/groups.json`
- `src/data/schedule.json`
- `src/data/data-status.json`
