# HTML Selectors Documentation

Dokumentasi lengkap untuk semua HTML selector yang digunakan dalam scraping detail anime.

## 📍 Selector Reference

### 1. Title
**Selector:**
```css
h1
[class*="title"]
```

**HTML Example:**
```html
<h1>SPY x FAMILY Season 3</h1>
```

---

### 2. Poster Image
**Selector:**
```css
img[alt*="poster"]
img[class*="poster"]
img[src*="poster"]
```

**HTML Example:**
```html
<img alt="SPY x FAMILY Season 3 poster" src="https://u.livechart.me/anime/12692/poster_image/..." class="overflow-hidden rounded-lg">
```

---

### 3. Rating
**Selector:**
```css
span.text-lg.font-medium
[class*="rating"]
.score
```

**HTML Example:**
```html
<span class="text-lg font-medium">8.06</span>
```

**Value:** `8.06` (float)

---

### 4. Ratings Count
**Selector:**
```css
div.text-sm.text-base-content\/75
[class*="ratings"]
```

**HTML Example:**
```html
<div class="text-sm text-base-content/75">473 ratings</div>
```

**Value:** `473` (extracted number)

---

### 5. Status
**Selector:**
```css
div.text-sm.font-medium
div.text-sm.text-base-content
[class*="status"]
```

**HTML Example:**
```html
<div class="text-sm font-medium">Status</div>
<div class="text-sm text-base-content">Releasing</div>
```

**Value:** `Releasing`

**Possible Values:** Releasing, Finished, Upcoming, Unknown

---

### 6. Original Title
**Selector:**
```css
div:contains("Original title")
dt:contains("Original title")
```

**HTML Example:**
```html
<div>Original title</div>
<div>SPY×FAMILY Season 3</div>
```

---

### 7. Format (TV, Movie, OVA, etc)
**Selector:**
```css
div:contains("Format")
dt:contains("Format")
```

**HTML Example:**
```html
<div>Format</div>
<div>TV</div>
```

**Possible Values:** TV, Movie, OVA, ONA, Special, etc.

---

### 8. Source (Manga, Light Novel, etc)
**Selector:**
```css
div:contains("Source")
dt:contains("Source")
```

**HTML Example:**
```html
<div>Source</div>
<div>Manga</div>
```

**Possible Values:** Manga, Light Novel, Web Manga, Original, Game, etc.

---

### 9. Total Episodes
**Selector:**
```css
div:contains("Episodes")
dt:contains("Episodes")
```

**HTML Example:**
```html
<div>Episodes</div>
<div>13</div>
```

**Value:** `13` (extracted number)

---

### 10. Current Episode
**Selector:**
```css
span[data-anime-details-target*="episode"]
span.text-sm.text-base-content\/75
[class*="current"]
[class*="episode"]
```

**HTML Example:**
```html
<span class="text-sm text-base-content/75" data-anime-details-target="viewRating">EP8</span>
```

**Value:** `8` (extracted from "EP8")

---

### 11. Run Time
**Selector:**
```css
div:contains("Run time")
dt:contains("Run time")
```

**HTML Example:**
```html
<div>Run time</div>
<div>24m</div>
```

**Value:** `24m`

---

### 12. Season
**Selector:**
```css
div:contains("Season")
dt:contains("Season")
```

**HTML Example:**
```html
<div>Season</div>
<div>Fall 2025</div>
```

**Value:** `Fall 2025`

---

### 13. Premiere Date
**Selector:**
```css
div:contains("Premiere")
dt:contains("Premiere")
```

**HTML Example:**
```html
<div>Premiere</div>
<div>Oct 4, 2025</div>
```

**Value:** `Oct 4, 2025`

---

### 14. Studios
**Selector:**
```css
div.text-lg.font-medium[data-anime-details-target*="studio"]
div:contains("Studios")
```

**HTML Example:**
```html
<div class="text-lg font-medium" data-anime-details-target="viewRating">
  <span>WIT STUDIO</span>
  <span>CloverWorks</span>
</div>
```

**Value:** `["WIT STUDIO", "CloverWorks"]` (array)

---

### 15. Tags/Genres
**Selector:**
```css
span.text-sm.text-base-content\/75[data-anime-details-target*="tag"]
[class*="tag"]
[class*="genre"]
[class*="badge"]
```

**HTML Example:**
```html
<span class="text-sm text-base-content/75" data-anime-details-target="viewRating">Action</span>
<span class="text-sm text-base-content/75" data-anime-details-target="viewRating">Comedy</span>
<span class="text-sm text-base-content/75" data-anime-details-target="viewRating">Childcare</span>
```

**Value:** `["Action", "Comedy", "Childcare"]` (array)

---

### 16. Synopsis
**Selector:**
```css
div.text-sm.text-base-content\/75[data-anime-details-target*="synopsis"]
[class*="synopsis"]
[class*="description"]
p
```

**HTML Example:**
```html
<div class="text-sm text-base-content/75" data-anime-details-target="viewRating">
  No synopsis has been added to this title.
</div>
```

**Value:** `"No synopsis has been added to this title."`

---

### 17. Streaming Info
**Selector:**
```css
div:contains("Streams")
dt:contains("Streams")
```

**HTML Example:**
```html
<div>Streams</div>
<div>Available on multiple platforms</div>
```

---

### 18. External Links
**Selector:**
```css
a[href*="myanimelist"]
a[href*="anilist"]
a[href*="kitsu"]
a[href*="imdb"]
```

**HTML Example:**
```html
<a href="https://myanimelist.net/anime/...">MyAnimeList</a>
<a href="https://anilist.co/anime/...">AniList</a>
<a href="https://kitsu.io/anime/...">Kitsu</a>
<a href="https://imdb.com/...">IMDB</a>
```

---

## 🎨 CSS Classes Used

| Class | Purpose |
|-------|---------|
| `text-lg` | Large text size |
| `font-medium` | Medium font weight |
| `text-sm` | Small text size |
| `text-base-content` | Base content color |
| `/75` | Opacity 75% |
| `overflow-hidden` | Hide overflow |
| `rounded-lg` | Large border radius |

---

## 📊 Data Attributes Used

| Attribute | Purpose |
|-----------|---------|
| `data-anime-details-target` | Target element for anime details |
| `alt` | Image alternative text |
| `href` | Link URL |
| `src` | Image source URL |

---

## 🔄 Fallback Strategy

Scraper menggunakan fallback strategy untuk robust parsing:

1. **Primary Selector** - Specific class/attribute selector
2. **Secondary Selector** - Generic class selector
3. **Tertiary Selector** - Element type selector
4. **Default Value** - If all selectors fail

**Contoh untuk Rating:**
```javascript
// Primary
const ratingText = $('span.text-lg.font-medium').first().text().trim() ||
// Secondary
                  $('[class*="rating"], .score').first().text().trim();
```

---

## ✅ Selector Coverage

| Field | Primary | Secondary | Tertiary |
|-------|---------|-----------|----------|
| Title | `h1` | `[class*="title"]` | - |
| Poster | `img[alt*="poster"]` | `img[class*="poster"]` | `img[src*="poster"]` |
| Rating | `span.text-lg.font-medium` | `[class*="rating"]` | `.score` |
| Ratings Count | `div.text-sm.text-base-content/75` | `[class*="ratings"]` | - |
| Status | `div.text-sm.font-medium` | `div.text-sm.text-base-content` | `[class*="status"]` |
| Studios | `div.text-lg.font-medium[data-anime-details-target*="studio"]` | `div:contains("Studios")` | - |
| Tags | `span.text-sm.text-base-content/75[data-anime-details-target*="tag"]` | `[class*="tag"]` | `[class*="badge"]` |
| Synopsis | `div.text-sm.text-base-content/75[data-anime-details-target*="synopsis"]` | `[class*="synopsis"]` | `p` |

---

## 🛠️ Testing Selectors

Untuk test selector di browser console:

```javascript
// Test rating selector
document.querySelector('span.text-lg.font-medium').textContent

// Test studios selector
document.querySelectorAll('div.text-lg.font-medium[data-anime-details-target*="studio"] span')

// Test tags selector
document.querySelectorAll('span.text-sm.text-base-content\\/75[data-anime-details-target*="tag"]')
```

---

## 📝 Notes

- Selectors menggunakan Tailwind CSS classes
- Escape forward slash dalam class selector: `\/` → `\\/`
- `:contains()` adalah Cheerio-specific selector (tidak ada di CSS standard)
- Fallback selectors penting untuk robustness terhadap perubahan HTML
- Data attributes (`data-*`) lebih stabil dari class names
