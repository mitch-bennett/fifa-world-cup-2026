# Data Sources and Accuracy Policy

This project distinguishes between `sample` data and `official` data.

## Current Status

- Status: `sample`
- Source: local seeded JSON files in `src/data/`
- Purpose: UI and deployment validation

## Files

- `src/data/countries.json`
- `src/data/groups.json`
- `src/data/schedule.json`
- `src/data/data-status.json`

## Phase A Workflow

1. Select authoritative sources for groups and fixtures.
2. Record source URL(s) and verification date in `src/data/data-status.json`.
3. Replace seeded JSON values with verified records.
4. Set `status` to `official` only after verification is complete.

## Notes

- Do not mix seeded and official records without clearly labeling `status` as `sample`.
- Any new data import should include source attribution and date of verification.
