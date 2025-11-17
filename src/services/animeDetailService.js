const axios = require('axios');
const cheerio = require('cheerio');

const LIVECHART_BASE_URL = 'https://www.livechart.me';

/**
 * Helper untuk mengambil field (Format, Source, Run time, Episodes)
 */
function getField($, label) {
  let value = null;

  $('div').each((i, el) => {
    const heading = $(el)
      .find('.text-xs.text-base-content\\/75')
      .text()
      .trim();

    if (heading === label) {
      const raw = $(el)
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();
      if (raw) value = raw;
    }
  });

  return value;
}

const animeDetailService = {
  async scrapeAnimeDetail(animeId) {
    try {
      const url = `${LIVECHART_BASE_URL}/anime/${animeId}`;
      console.log("🔄 Fetch:", url);

      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/html"
        },
        timeout: 20000
      });

      const detail = this._parseAnimeDetail(response.data, animeId);
      console.log("✅ Parsed:", detail.title);

      return detail;
    } catch (error) {
      console.error("❌ Error:", error.message);
      throw new Error("Failed to scrape anime detail: " + error.message);
    }
  },

  _parseAnimeDetail(html, animeId) {
    const $ = cheerio.load(html);

    // ================================
    // TITLE (FINAL FIX — 5 FALLBACKS)
    // ================================
    

    // Desktop: <span class="text-base-content">TITLE</span>
      let title = $('div.text-xl.font-medium span.text-base-content')
        .first()
        .text()
        .trim();

      // Mobile: <div class="text-xl font-medium line-clamp-1">TITLE</div>
      if (!title) {
        title = $('div.text-xl.font-medium.line-clamp-1')
          .first()
          .text()
          .trim();
      }

      // Fallback: elemen font-medium langsung
      if (!title) {
        title = $('div.text-xl.font-medium')
          .first()
          .text()
          .trim();
      }

// Last fallback: h1
if (!title) title = $('h1').first().text().trim() || null;

    // Case 4 — fallback: h1
    if (!title) {
      title = $('h1').first().text().trim();
    }

    if (!title) title = null;

    // ================================
    // POSTER
    // ================================
    const poster =
      $('img[alt*="poster"]').attr('src') ||
      $('img[src*="poster"]').attr('src') ||
      null;

    // ================================
    // RATING
    // ================================
    const ratingText = $('span.text-lg.font-medium').first().text().trim();
    const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    // Ratings Count
    const ratingsCountMatch = ratingText.match(/(\d+)\s*ratings/i);
    const ratingsCount = ratingsCountMatch ? ratingsCountMatch[1] : null;

    // ================================
    // STATUS
    // ================================
    let status = null;
    const statusHeader = $('div.font-medium')
      .filter((i, el) => $(el).text().trim() === "Status")
      .first();

    if (statusHeader.length) {
      status = statusHeader.parent().text().replace("Status", "").trim();
    }

    // ================================
    // ORIGINAL TITLE
    // ================================
    let originalTitle = null;

    $('div.text-sm').each((i, el) => {
      const head = $(el).find('div.font-medium').text().trim();
      if (head === "Original title") {
        originalTitle = $(el).text().replace("Original title", "").trim();
      }
    });

    // ================================
    // FORMAT, SOURCE, RUN TIME
    // ================================
    const format = getField($, "Format");

    // SOURCE (dual DOM)
    let source = getField($, "Source");
    if (!source) {
      const srcBlock = $('div.font-medium')
        .filter((i, el) => $(el).text().trim() === "Source")
        .first();
      if (srcBlock.length)
        source = srcBlock.parent().text().replace("Source", "").trim();
    }

    const runTime = getField($, "Run time");

    // ================================
    // EPISODES
    // ================================
    let totalEpisodes = null;

    const epRaw = getField($, "Episodes");
    if (epRaw) {
      const m = epRaw.match(/\/\s*(\d+|–)/);
      if (m) totalEpisodes = m[1] === "–" ? null : parseInt(m[1]);
    }

    // ================================
    // CURRENT EPISODE
    // ================================
    let currentEpisode = null;
    const epLinkText = $('a[href*="/schedules/"] span.font-medium')
      .first()
      .text()
      .trim();

    const epMatch = epLinkText.match(/EP(\d+)/i);
    if (epMatch) currentEpisode = parseInt(epMatch[1]);

    // ================================
    // SEASON + PREMIERE
    // ================================
    let season = null;
    let premiere = null;

    const headerText = $('[data-controller="anime-details-header"]').text();

    if (headerText) {
      const premMatch = headerText.match(/([A-Za-z]{3,9} \d{1,2}, \d{4})/);
      if (premMatch) premiere = premMatch[1];

      const seasonMatch = headerText.match(/\(([^)]+)\)/);
      if (seasonMatch) season = seasonMatch[1];
    }

    // ================================
    // STUDIOS
    // ================================
    const studios = [];

    const studioBlock = $('div.font-medium')
      .filter((i, el) => {
        const t = $(el).text().trim();
        return t === "Studio" || t === "Studios";
      })
      .first();

    if (studioBlock.length) {
      // Style 1 — Text
      const raw = studioBlock.parent().text().replace(/Studio[s]?/, "").trim();
      if (raw) studios.push(raw);

      // Style 2 — Chip buttons
      studioBlock.parent().next('.flex.flex-wrap.gap-2')
        .find('.lc-chip-button')
        .each((i, el) => {
          const st = $(el).text().trim();
          if (st && !studios.includes(st)) studios.push(st);
        });
    }

    // ================================
    // TAGS (2 STRUCTURE)
    // ================================
    const tags = [];

    const tagsBlock = $('div.font-medium')
      .filter((i, el) => $(el).text().trim() === "Tags")
      .first();

    if (tagsBlock.length) {
      // Style 1 — chips
      tagsBlock.parent().next('.flex.flex-wrap.gap-2')
        .find('.lc-chip-button')
        .each((i, el) => {
          const tg = $(el).text().trim();
          if (tg && !tags.includes(tg)) tags.push(tg);
        });

      // Style 2 — plain text list
      tagsBlock.parent().contents().each((i, el) => {
        if (el.type === "text") {
          const t = $(el).text().trim();
          if (t && t !== "Tags" && t.length < 40 && !tags.includes(t)) {
            tags.push(t);
          }
        }
      });
    }

    // ================================
    // SYNOPSIS
    // ================================
    const synopsis =
      $('div.text-italic').first().text().trim() ||
      $('[data-anime-details-target="synopsis"]').text().trim() ||
      "No synopsis available";

    // ================================
    // STREAMING
    // ================================
    const streaming = getField($, "Streams") || null;

    // ================================
    // LINKS
    // ================================
    const links = {
      livechart: `${LIVECHART_BASE_URL}/anime/${animeId}`,
      myanimelist: $('a[href*="myanimelist.net"]').attr('href') || null,
      anilist: $('a[href*="anilist.co"]').attr('href') || null,
      kitsu: $('a[href*="kitsu.app"]').attr('href') || null,
      imdb: $('a[href*="imdb.com"]').attr('href') || null
    };

    // ================================
    // RETURN CLEAN JSON
    // ================================
    return {
      id: animeId,
      title,
      originalTitle: originalTitle || title,
      poster,
      rating,
      ratingsCount,
      status,
      format,
      source,
      totalEpisodes,
      currentEpisode,
      runTime,
      season,
      premiere,
      studios,
      tags,
      synopsis,
      streaming,
      links
    };
  }
};

module.exports = animeDetailService;
