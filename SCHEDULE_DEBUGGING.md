# 🔧 Schedule Endpoint - Debugging & Fixes

## 🐛 Issue

Schedule endpoint mengembalikan data kosong untuk semua hari:
```json
{
  "monday": { "count": 0, "anime": [] },
  "tuesday": { "count": 0, "anime": [] },
  ...
}
```

## 🔍 Root Cause

LiveChart.me menggunakan **client-side rendering dengan JavaScript** untuk menampilkan schedule. Ketika axios melakukan request, HTML yang dikembalikan belum ter-render sepenuhnya, sehingga selector tidak menemukan elemen anime.

### Evidence:
- HTML response hanya berisi `<script>` tags untuk JavaScript bundles
- Data anime di-load secara dinamis setelah JavaScript dijalankan
- Cheerio hanya bisa parse HTML statis, bukan hasil render JavaScript

---

## ✅ Solusi

Ada beberapa opsi untuk mengatasi masalah ini:

### Option 1: Gunakan Puppeteer (Recommended)
Gunakan headless browser untuk render JavaScript sebelum scraping.

```javascript
const puppeteer = require('puppeteer');

async function getScheduleWithPuppeteer() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.livechart.me/schedule');
  await page.waitForSelector('[data-timeslot-day]'); // Wait for JS to render
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  // Sekarang bisa scrape dengan selector
  // ...
  
  await browser.close();
}
```

**Pros:**
- ✅ Fully rendered HTML
- ✅ Akurat 100%
- ✅ Support semua dynamic content

**Cons:**
- ❌ Lebih lambat (perlu browser instance)
- ❌ Lebih banyak resource
- ❌ Perlu install Puppeteer

---

### Option 2: Gunakan Playwright
Alternatif Puppeteer yang lebih modern.

```javascript
const { chromium } = require('playwright');

async function getScheduleWithPlaywright() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.livechart.me/schedule');
  await page.waitForLoadState('networkidle');
  
  const html = await page.content();
  // Scrape dengan cheerio...
}
```

---

### Option 3: Gunakan API Endpoint
Jika LiveChart.me memiliki API endpoint untuk schedule, gunakan itu langsung.

```javascript
// Contoh: jika ada GraphQL API
const query = `
  query {
    schedule {
      monday { anime { title time } }
      tuesday { anime { title time } }
      ...
    }
  }
`;
```

---

### Option 4: Gunakan Selenium
Alternatif lain untuk browser automation.

```javascript
const { Builder, By } = require('selenium-webdriver');

async function getScheduleWithSelenium() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .build();
  
  try {
    await driver.get('https://www.livechart.me/schedule');
    await driver.wait(until.elementLocated(By.css('[data-timeslot-day]')), 10000);
    
    const html = await driver.getPageSource();
    // Scrape dengan cheerio...
  } finally {
    await driver.quit();
  }
}
```

---

## 🎯 Recommended Implementation

Untuk project ini, saya merekomendasikan **Option 1: Puppeteer** karena:

1. ✅ Paling reliable untuk JavaScript-heavy sites
2. ✅ Maintained dengan baik
3. ✅ Good documentation
4. ✅ Bisa di-cache untuk performa

### Implementation Steps:

**1. Install Puppeteer:**
```bash
npm install puppeteer
```

**2. Update scheduleService.js:**
```javascript
const puppeteer = require('puppeteer');

async function getScheduleWithBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto('https://www.livechart.me/schedule', {
    waitUntil: 'networkidle2'
  });
  
  // Wait untuk schedule data ter-render
  await page.waitForSelector('[data-timeslot-day]', { timeout: 10000 });
  
  const html = await page.content();
  await browser.close();
  
  // Sekarang parse dengan cheerio
  const $ = cheerio.load(html);
  // ... scraping logic ...
}
```

**3. Update Cache:**
```javascript
// Cache schedule dengan TTL lebih panjang (2-4 jam)
// karena scraping dengan browser lebih lambat
const SCHEDULE_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours
```

---

## 📊 Performance Considerations

| Method | Speed | Accuracy | Resource | Maintenance |
|--------|-------|----------|----------|-------------|
| Cheerio (current) | ⚡⚡⚡ | ❌ 0% | 💚 Low | ✅ Easy |
| Puppeteer | ⚡ | ✅ 100% | 🔴 High | ⚠️ Medium |
| Playwright | ⚡ | ✅ 100% | 🔴 High | ✅ Good |
| Selenium | ⚡ | ✅ 100% | 🔴 Very High | ⚠️ Complex |
| API | ⚡⚡⚡ | ✅ 100% | 💚 Low | ✅ Best |

---

## 🔄 Temporary Workaround

Sambil menunggu implementasi Puppeteer, Anda bisa:

1. **Mock data untuk testing:**
```javascript
const mockSchedule = {
  monday: {
    day: 'monday',
    count: 2,
    anime: [
      {
        id: '12692',
        title: 'SPY x FAMILY Season 3',
        time: '5:15 AM',
        episode: 'EP8',
        studio: 'WIT STUDIO',
        status: 'Airing'
      }
    ]
  }
  // ... other days
};
```

2. **Return mock data untuk development:**
```javascript
if (process.env.NODE_ENV === 'development') {
  return mockSchedule;
}
```

---

## 📝 Next Steps

1. **Short term:** Gunakan mock data untuk development
2. **Medium term:** Implement Puppeteer untuk production
3. **Long term:** Cari API endpoint resmi atau contact LiveChart.me untuk data access

---

## 📞 Alternative: Contact LiveChart.me

Pertimbangkan untuk menghubungi LiveChart.me untuk:
- API access
- Data partnership
- Official data source

---

**Status:** ⚠️ Pending Implementation
**Priority:** Medium (Schedule data tidak critical untuk core functionality)
**Estimated Fix Time:** 2-4 hours dengan Puppeteer
