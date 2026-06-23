# Site Review Checklist

Use this file to capture pass/fail and notes for each checkpoint.

How to fill:
- Mark `Status` as `PASS`, `FAIL`, or `PARTIAL`.
- Add short notes in the `Comments` field.

---

## 1) Home (`/`)

### 1.1 Globe renders
- Status: PASS
- Comments: the interactive globe section is larger than intended (not centered like the 'world cup atlas' top banner)

### 1.2 Clicking markers changes preview card
- Status: PARTIAL
- Comments: the markers are there but the preview card is too far off to the side

### 1.3 `Open Profile` goes to correct country
- Status: FAIL
- Comments: can't see anything to click on it'

---

## 2) Country (`/country/:code`)

### 2.1 Facts + team snapshot are correct for seeded teams
- Status: PASS
- Comments:

### 2.2 Mini-globe renders
- Status: PARTIAL
- Comments: renders but is very dark, should spin to center the country

### 2.3 English-labeled capital map renders with correct capital marker
- Status: PARTIAL
- Comments: change to highlight the country capital, not center. Addressed:
  MapLibre map now centers on the capital with an orange capital marker, and
  labels are localized to English (Geoapify vector tiles via VITE_GEOAPIFY_KEY).

### 2.4 Fixtures list shows only that team's matches
- Status: PARTIAL
- Comments: shows only that team match but incorrect data, maybe just from the test sample pull

---

## 3) Groups (`/groups`)

### 3.1 Each group card renders
- Status: PASS
- Comments:

### 3.2 Team pills are clickable
- Status: PASS
- Comments:

### 3.3 Selected pill updates preview summary for that group
- Status: PARTIAL
- Comments: unsure what this means

---

## 4) Schedule (`/schedule`)

### 4.1 Group filter works
- Status: PASS
- Comments:

### 4.2 Team filter works
- Status: PASS
- Comments:

### 4.3 Date filter works
- Status: PASS
- Comments:

### 4.4 Sort flips chronological order
- Status: PASS
- Comments:

### 4.5 Reset returns defaults
- Status: PASS
- Comments:

### 4.6 Empty-state appears when filters exclude all matches
- Status: PASS
- Comments:

---

## 5) Responsive (~390px width)

### 5.1 Nav remains usable
- Status:
- Comments: which nav? overall?

### 5.2 Filters remain usable
- Status: PASS
- Comments:

### 5.3 Cards/content do not overlap or clip
- Status: PASS
- Comments:

---

## Overall Summary

- Overall status: in good shape
- Highest-priority fixes: home page centering
- Nice-to-have improvements: confirm data will be accurate, add where each country's team is staying in the host nation
