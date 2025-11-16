const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Service untuk scraping detail movie dari livechart.me
 */

const LIVECHART_BASE_URL = 'https://www.livechart.me';

const movieDetailService = {
  /**
   * Scrape detail movie berdasarkan ID
   * @param {string} movieId - Movie ID
   * @returns {Promise<Object>} Detail movie object
   */
  async scrapeMovieDetail(movieId) {
    try {
      const url = `${LIVECHART_BASE_URL}/anime/${movieId}`;
      console.log('🔄 Fetching movie detail dari:', url);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.livechart.me/'
        },
        timeout: 10000
      });

      const detail = this._parseMovieDetail(response.data, movieId);
      console.log(`✅ Berhasil scrape movie detail: ${detail.title}`);

      return detail;
    } catch (error) {
      console.error('❌ Error saat scraping movie detail:', error.message);
      throw new Error(`Failed to scrape movie detail: ${error.message}`);
    }
  },

  /**
   * Parse HTML dan ekstrak detail movie
   * @private
   * @param {string} html - HTML content
   * @param {string} movieId - Movie ID
   * @returns {Object} Detail movie object
   */
  _parseMovieDetail(html, movieId) {
    const $ = cheerio.load(html);

    // Title - dari h1 atau div dengan class tertentu
    const title = $('h1').first().text().trim() ||
                 $('[class*="title"]').first().text().trim();

    // Poster image - dari img dengan alt poster atau class poster
    const poster = $('img[alt*="poster"], img[class*="poster"]').first().attr('src') ||
                  $('img[src*="poster"]').first().attr('src');

    // Rating - dari span dengan class text-lg font-medium atau rating class
    const ratingText = $('span.text-lg.font-medium').first().text().trim() ||
                      $('[class*="rating"], .score').first().text().trim();
    const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    // Number of ratings - dari div dengan class text-sm text-base-content/75
    const ratingsCountText = $('div.text-sm.text-base-content\\/75').text().trim();
    const ratingsCountMatch = ratingsCountText.match(/(\d+)\s*ratings?/i);
    const ratingsCount = ratingsCountMatch ? ratingsCountMatch[1] : 
                        $('[class*="ratings"]').text().match(/(\d+)\s*ratings?/i)?.[1] || null;

    // Status - dari div dengan class text-sm font-medium atau text-base-content
    const status = $('div.text-sm.font-medium').first().text().trim() ||
                  $('div.text-sm.text-base-content').first().text().trim() ||
                  $('[class*="status"]').first().text().trim() || 'Unknown';

    // Original title
    const originalTitle = $('div:contains("Original title")').next().text().trim() ||
                         $('dt:contains("Original title")').next().text().trim();

    // Format (Movie, etc)
    const format = $('div:contains("Format")').next().text().trim() ||
                  $('dt:contains("Format")').next().text().trim() ||
                  'Movie';

    // Source (Manga, Light Novel, Original, etc)
    const source = $('div:contains("Source")').next().text().trim() ||
                  $('dt:contains("Source")').next().text().trim() ||
                  'Unknown';

    // Runtime
    const runTime = $('div:contains("Run time")').next().text().trim() ||
                   $('dt:contains("Run time")').next().text().trim() ||
                   'Unknown';

    // Release date
    const releaseDate = $('div:contains("Release")').next().text().trim() ||
                       $('dt:contains("Release")').next().text().trim() ||
                       'Unknown';

    // Studios
    const studios = [];
    $('div.text-lg.font-medium[data-anime-details-target*="studio"]').find('a, span').each((i, el) => {
      const studio = $(el).text().trim();
      if (studio && !studios.includes(studio)) {
        studios.push(studio);
      }
    });
    
    // Fallback untuk studios
    if (studios.length === 0) {
      $('div:contains("Studios")').next().find('a, span').each((i, el) => {
        const studio = $(el).text().trim();
        if (studio && !studios.includes(studio)) {
          studios.push(studio);
        }
      });
    }

    // Tags/Genres
    const tags = [];
    $('span.text-sm.text-base-content\\/75[data-anime-details-target*="tag"]').each((i, el) => {
      const tag = $(el).text().trim();
      if (tag && tag.length > 0 && tag.length < 50) {
        tags.push(tag);
      }
    });
    
    // Fallback untuk tags
    if (tags.length === 0) {
      $('[class*="tag"], [class*="genre"], [class*="badge"]').each((i, el) => {
        const tag = $(el).text().trim();
        if (tag && tag.length > 0 && tag.length < 50) {
          tags.push(tag);
        }
      });
    }

    // Synopsis
    const synopsis = $('div.text-sm.text-base-content\\/75[data-anime-details-target*="synopsis"]').first().text().trim() ||
                    $('[class*="synopsis"], [class*="description"]').first().text().trim() ||
                    $('p').first().text().trim() ||
                    'No synopsis available';

    // Streaming info
    const streamingText = $('div:contains("Streams")').next().text().trim() ||
                         $('dt:contains("Streams")').next().text().trim();

    // Links
    const links = {
      livechart: `${LIVECHART_BASE_URL}/anime/${movieId}`,
      myanimelist: $('a[href*="myanimelist"]').attr('href') || null,
      anilist: $('a[href*="anilist"]').attr('href') || null,
      kitsu: $('a[href*="kitsu"]').attr('href') || null,
      imdb: $('a[href*="imdb"]').attr('href') || null
    };

    return {
      id: movieId,
      title: title,
      originalTitle: originalTitle || title,
      poster: poster || null,
      rating: rating,
      ratingsCount: ratingsCount,
      status: status,
      format: format,
      source: source,
      runTime: runTime,
      releaseDate: releaseDate,
      studios: studios.length > 0 ? studios : [],
      tags: [...new Set(tags)], // Remove duplicates
      synopsis: synopsis,
      streaming: streamingText || 'Not available',
      links: links
    };
  }
};

module.exports = movieDetailService;
