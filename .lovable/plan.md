

# Antsan'ny Fitia Lyrics PWA - Implementation Plan

## Discovery

The GitHub repo (`rindraleon/Antsan-ny-fitia`) contains a single file: **`Antsan'ny fitia.json`** with this actual structure:

```text
{
  "songs": [
    {
      "id": 1,
      "title": "TANORANAO",
      "lyrics": "Full lyrics as single string with \\n line breaks",
      "author": "Rindra Léon",
      "year": 2021,
      "category": "SudAf"
    }
  ]
}
```

**Key difference from your example**: lyrics is a single string (not an array), and there's a `year` field instead of `updatedAt`. The file path has a special character: `Antsan'ny fitia.json`.

---

## Architecture

```text
Pages:  Home | Songs | Search | Favorites | Admin
        └──────── Bottom Nav Bar ────────────┘

Data Flow:
  GitHub JSON ──fetch──> localStorage (cache)
                              │
                         App reads from
                         localStorage
                              │
  Admin edits ──> localStorage ──push──> GitHub API (via Edge Function)
```

- **Primary data store**: localStorage (for offline + speed)
- **Remote source**: GitHub raw JSON (sync on demand)
- **GitHub writes**: Via a Supabase Edge Function (to keep GITHUB_TOKEN secure)
- **Admin auth**: Simple password checked against an environment variable via Edge Function

---

## Implementation Steps

### Phase 1: Core Data & Types
- Create `src/types/song.ts` with Song interface
- Create `src/lib/songStorage.ts` — localStorage helpers (get/set songs, favorites, last sync timestamp)
- Create `src/data/defaultSongs.ts` — embedded copy of current songs as fallback

### Phase 2: Pages & Navigation
- **Bottom navigation bar** component with 5 tabs (Home, Songs, Search, Favorites, Admin)
- **Home page** — welcome screen, last sync info, quick stats
- **Songs page** — scrollable list with category filter chips, song cards (title, category, author)
- **Song Detail page** — formatted lyrics, font size controls (A+/A-), auto-scroll toggle, favorite button, copy button, share button
- **Search page** — instant search across title/lyrics/category/author with highlighted results
- **Favorites page** — filtered list of favorited songs
- **Admin page** — password gate, CRUD form, sync controls

### Phase 3: Features
- **Favorites**: toggle in localStorage, heart icon on cards and detail page
- **Category filters**: chips derived from song data (SudAf, Tsapiky, etc.)
- **Font size control**: state persisted in localStorage
- **Auto-scroll**: configurable speed slider on detail page
- **Dark mode**: using `next-themes` (already installed)
- **Song numbering**: display as "Song 001" format
- **Recently viewed**: track last 10 songs in localStorage
- **Copy & Share**: Web Share API with clipboard fallback

### Phase 4: GitHub Sync
- **Fetch songs**: Call GitHub raw URL, update localStorage, show success toast
- **Edge Function** `github-sync` for admin writes:
  - Receives updated songs JSON
  - Fetches current file SHA from GitHub API
  - Commits updated JSON via GitHub Contents API
  - Requires secrets: `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_FILE_PATH`

### Phase 5: Admin
- **Edge Function** `admin-auth` — validates password against a stored secret `ADMIN_PASSWORD`
- Admin CRUD interface: create/edit/delete songs with multi-line lyrics editor
- Export JSON backup button
- Import JSON merge tool

### Phase 6: PWA & Offline
- Add `public/manifest.json` with app name, icons, theme color
- Register service worker for asset caching
- Offline banner component when navigator.onLine is false
- All song data reads from localStorage (works offline by default)

---

## Technical Details

### File Structure (new files)
```text
src/
  types/song.ts
  lib/songStorage.ts
  lib/githubSync.ts
  data/defaultSongs.ts
  context/ThemeContext.tsx
  components/
    BottomNav.tsx
    SongCard.tsx
    SongDetail.tsx
    CategoryFilter.tsx
    SearchBar.tsx
    AdminForm.tsx
    AdminLogin.tsx
    AutoScroll.tsx
    FontSizeControl.tsx
    OfflineBanner.tsx
    SyncButton.tsx
  pages/
    Index.tsx (Home)
    Songs.tsx
    SongPage.tsx
    Search.tsx
    Favorites.tsx
    Admin.tsx
public/
  manifest.json
  icons/ (app icons)
```

### Required Secrets (via Lovable Cloud)
- `GITHUB_TOKEN` — GitHub Personal Access Token with repo write access
- `ADMIN_PASSWORD` — password for admin access

### Constants (in code, not secret)
- `GITHUB_OWNER`: `rindraleon`
- `GITHUB_REPO`: `Antsan-ny-fitia`
- `GITHUB_FILE_PATH`: `Antsan'ny fitia.json`

### Edge Functions needed
1. `github-sync` — push updated JSON to GitHub
2. `admin-auth` — validate admin password

---

## Notes
- The UI language will be **mixed**: French/English for UI labels, Malagasy for song content and categories
- Songs will be embedded as default data so the app works immediately without a first sync
- All 372+ lines of song data from GitHub will be included

