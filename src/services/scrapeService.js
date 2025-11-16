const axios = require('axios');
const cheerio = require('cheerio');
const { cleanEpisodeInfo, cleanStudio } = require('../utils/dataFormatter');

/**
 * Service untuk scraping data anime dari livechart.me
 */

const LIVECHART_BASE_URL = 'https://www.livechart.me';
const SEASONS = ['winter', 'spring', 'summer', 'fall'];
const CURRENT_YEAR = new Date().getFullYear();

const scrapeService = {
  /**
   * Scrape semua anime dari livechart.me
   * @param {string} season - Season (winter, spring, summer, fall) - default: current season
   * @param {number} year - Year - default: current year
   * @returns {Promise<Array>} Array of anime objects
   */
  async scrapeAllAnime(season = null, year = null) {
    try {
      // Jika tidak ada parameter, gunakan season dan year saat ini
      if (!season || !year) {
        const now = new Date();
        const currentMonth = now.getMonth();
        
        // Tentukan season berdasarkan bulan
        if (!season) {
          if (currentMonth >= 0 && currentMonth < 3) season = 'winter';
          else if (currentMonth >= 3 && currentMonth < 6) season = 'spring';
          else if (currentMonth >= 6 && currentMonth < 9) season = 'summer';
          else season = 'fall';
        }
        
        if (!year) year = CURRENT_YEAR;
      }

      // Validate season
      if (!SEASONS.includes(season.toLowerCase())) {
        throw new Error(`Invalid season. Must be one of: ${SEASONS.join(', ')}`);
      }

      const url = `${LIVECHART_BASE_URL}/${season}-${year}/tv?ongoing=all`;
      console.log('🔄 Fetching data dari:', url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.livechart.me/'
        },
        timeout: 10000
      });

      const animeList = this._parseAnimeData(response.data);
      console.log(`✅ Berhasil scrape ${animeList.length} anime`);
      
      return animeList;
    } catch (error) {
      console.error('❌ Error saat scraping:', error.message);
      throw new Error(`Scraping failed: ${error.message}`);
    }
  },

  /**
   * Parse HTML dan ekstrak data anime
   * @private
   * @param {string} html - HTML content
   * @returns {Array} Array of anime objects
   */
  _parseAnimeData(html) {
    const $ = cheerio.load(html);
    const animeList = [];

    $('article.anime').each((index, element) => {
      try {
        const $element = $(element);
        const anime = this._extractAnimeInfo($element, $);
        
        if (anime.title) {
          animeList.push(anime);
        }
      } catch (err) {
        console.warn(`⚠️ Error parsing anime item ${index}:`, err.message);
      }
    });

    return animeList;
  },

  /**
   * Scrape semua movie dari livechart.me
   * @param {string} season - Season (winter, spring, summer, fall) - default: current season
   * @param {number} year - Year - default: current year
   * @returns {Promise<Array>} Array of movie objects
   */
  async scrapeAllMovies(season = null, year = null) {
    try {
      // Jika tidak ada parameter, gunakan season dan year saat ini
      if (!season || !year) {
        const now = new Date();
        const currentMonth = now.getMonth();
        
        // Tentukan season berdasarkan bulan
        if (!season) {
          if (currentMonth >= 0 && currentMonth < 3) season = 'winter';
          else if (currentMonth >= 3 && currentMonth < 6) season = 'spring';
          else if (currentMonth >= 6 && currentMonth < 9) season = 'summer';
          else season = 'fall';
        }
        
        if (!year) year = CURRENT_YEAR;
      }

      // Validate season
      if (!SEASONS.includes(season.toLowerCase())) {
        throw new Error(`Invalid season. Must be one of: ${SEASONS.join(', ')}`);
      }

      const url = `${LIVECHART_BASE_URL}/${season}-${year}/movies?ongoing=all`;
      console.log('🔄 Fetching movie data dari:', url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.livechart.me/'
        },
        timeout: 10000
      });

      const movieList = this._parseAnimeData(response.data);
      console.log(`✅ Berhasil scrape ${movieList.length} movie`);
      
      return movieList;
    } catch (error) {
      console.error('❌ Error saat scraping movie:', error.message);
      throw new Error(`Movie scraping failed: ${error.message}`);
    }
  },

  /**
   * Scrape semua OVA dari livechart.me
   * @param {string} season - Season (winter, spring, summer, fall) - default: current season
   * @param {number} year - Year - default: current year
   * @returns {Promise<Array>} Array of OVA objects
   */
  async scrapeAllOVAs(season = null, year = null) {
    try {
      // Jika tidak ada parameter, gunakan season dan year saat ini
      if (!season || !year) {
        const now = new Date();
        const currentMonth = now.getMonth();
        
        // Tentukan season berdasarkan bulan
        if (!season) {
          if (currentMonth >= 0 && currentMonth < 3) season = 'winter';
          else if (currentMonth >= 3 && currentMonth < 6) season = 'spring';
          else if (currentMonth >= 6 && currentMonth < 9) season = 'summer';
          else season = 'fall';
        }
        
        if (!year) year = CURRENT_YEAR;
      }

      // Validate season
      if (!SEASONS.includes(season.toLowerCase())) {
        throw new Error(`Invalid season. Must be one of: ${SEASONS.join(', ')}`);
      }

      const url = `${LIVECHART_BASE_URL}/${season}-${year}/ovas?ongoing=all`;
      console.log('🔄 Fetching OVA data dari:', url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.livechart.me/'
        },
        timeout: 10000
      });

      const ovaList = this._parseAnimeData(response.data);
      console.log(`✅ Berhasil scrape ${ovaList.length} OVA`);
      
      return ovaList;
    } catch (error) {
      console.error('❌ Error saat scraping OVA:', error.message);
      throw new Error(`OVA scraping failed: ${error.message}`);
    }
  },

  /**
   * Scrape semua (anime + movie + OVA) dari livechart.me
   * @param {string} season - Season (winter, spring, summer, fall) - default: current season
   * @param {number} year - Year - default: current year
   * @returns {Promise<Object>} Object dengan anime, movie, dan OVA
   */
  async scrapeAll(season = null, year = null) {
    try {
      // Jika tidak ada parameter, gunakan season dan year saat ini
      if (!season || !year) {
        const now = new Date();
        const currentMonth = now.getMonth();
        
        // Tentukan season berdasarkan bulan
        if (!season) {
          if (currentMonth >= 0 && currentMonth < 3) season = 'winter';
          else if (currentMonth >= 3 && currentMonth < 6) season = 'spring';
          else if (currentMonth >= 6 && currentMonth < 9) season = 'summer';
          else season = 'fall';
        }
        
        if (!year) year = CURRENT_YEAR;
      }

      // Validate season
      if (!SEASONS.includes(season.toLowerCase())) {
        throw new Error(`Invalid season. Must be one of: ${SEASONS.join(', ')}`);
      }

      const url = `${LIVECHART_BASE_URL}/${season}-${year}/all?ongoing=all`;
      console.log('🔄 Fetching all data dari:', url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.livechart.me/'
        },
        timeout: 10000
      });

      const allList = this._parseAnimeData(response.data);
      console.log(`✅ Berhasil scrape ${allList.length} total (anime + movie + OVA)`);
      
      return allList;
    } catch (error) {
      console.error('❌ Error saat scraping all:', error.message);
      throw new Error(`All scraping failed: ${error.message}`);
    }
  },

  /**
   * Sort anime data
   * @private
   * @param {Array} animeList - Array of anime objects
   * @param {string} sortBy - Sort field (rating, title, episodes, airdates)
   * @param {string} order - Sort order (asc, desc)
   * @returns {Array} Sorted anime array
   */
  _sortAnimeData(animeList, sortBy = 'rating', order = 'desc') {
    const sorted = [...animeList];

    switch (sortBy.toLowerCase()) {
      case 'rating':
        sorted.sort((a, b) => {
          const scoreA = parseFloat(a.score) || 0;
          const scoreB = parseFloat(b.score) || 0;
          return order === 'asc' ? scoreA - scoreB : scoreB - scoreA;
        });
        break;

      case 'title':
        sorted.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return order === 'asc' 
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        });
        break;

      case 'episodes':
        sorted.sort((a, b) => {
          const epA = parseInt(a.episodes) || 0;
          const epB = parseInt(b.episodes) || 0;
          return order === 'asc' ? epA - epB : epB - epA;
        });
        break;

      case 'airdates':
      case 'airdate':
        // Sort by status (Ongoing first, then Upcoming, then Finished)
        const statusOrder = { 'Ongoing': 0, 'Upcoming': 1, 'Finished': 2, 'Unknown': 3 };
        sorted.sort((a, b) => {
          const statusA = statusOrder[a.status] || 3;
          const statusB = statusOrder[b.status] || 3;
          return order === 'asc' ? statusA - statusB : statusB - statusA;
        });
        break;

      default:
        // Default sort by rating
        sorted.sort((a, b) => {
          const scoreA = parseFloat(a.score) || 0;
          const scoreB = parseFloat(b.score) || 0;
          return order === 'desc' ? scoreB - scoreA : scoreA - scoreB;
        });
    }

    return sorted;
  },

  _extractAnimeInfo($element, $) {
    const title = $element.find('h3, [data-anime-card-list-target]').first().text().trim() ||
                 $element.attr('data-anime-title');
    
    const link = $element.find('a[href*="/anime/"]').first().attr('href');
    const animeId = $element.attr('data-anime-id');
    
    let status = $element.find('[class*="status"], .badge').first().text().trim();
    if (!status) {
      const statusText = $element.find('span, div').text();
      if (statusText.includes('Ongoing')) status = 'Ongoing';
      else if (statusText.includes('Upcoming')) status = 'Upcoming';
      else status = 'Unknown';
    }
    
    const episodeInfo = $element.find('[class*="episode"], .eps').text().trim();
    const studio = $element.find('[class*="studio"]').text().trim();
    const score = $element.find('.score, [class*="rating"]').text().trim();
    const posterImg = $element.find('img').first().attr('src');

    return {
      id: animeId || null,
      title: title,
      link: link ? (link.startsWith('http') ? link : 'https://www.livechart.me' + link) : null,
      status: status,
      episodes: cleanEpisodeInfo(episodeInfo),
      studio: cleanStudio(studio),
      score: score || 'N/A',
      poster: posterImg || null
    };
  }
};

module.exports = scrapeService;
