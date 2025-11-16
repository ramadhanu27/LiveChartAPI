const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Service untuk scraping schedule data dari livechart.me
 */

const LIVECHART_BASE_URL = 'https://www.livechart.me';

const scheduleService = {
  /**
   * Scrape schedule dari livechart.me
   * @param {string} day - Day filter (optional): monday, tuesday, wednesday, thursday, friday, saturday, sunday
   * @returns {Promise<Object>} Schedule data
   */
  async getSchedule(day = null) {
    try {
      const url = `${LIVECHART_BASE_URL}/schedule`;
      console.log('🔄 Fetching schedule dari:', url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });

      const $ = cheerio.load(response.data);
      const schedule = {};

      // Parse schedule untuk setiap hari
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      days.forEach(dayName => {
        // Cari container untuk hari tertentu - coba berbagai selector
        let $dayContainer = $(`[data-timeslot-day="${dayName}"]`);
        
        // Fallback: cari berdasarkan class atau text content
        if ($dayContainer.length === 0) {
          $dayContainer = $(`div:contains("${dayName.charAt(0).toUpperCase() + dayName.slice(1)}")`).closest('[class*="timeslot"]');
        }

        if ($dayContainer.length > 0) {
          const animeList = [];

          // Parse anime dalam hari tersebut
          // Coba berbagai selector untuk anime blocks
          let $animeElements = $dayContainer.find('[data-schedule-anime-target]');
          
          // Fallback: cari semua link anime dalam container
          if ($animeElements.length === 0) {
            $animeElements = $dayContainer.find('a[href*="/anime/"]').closest('[class*="block"], [class*="card"], div');
          }

          $animeElements.each((index, element) => {
            const $element = $(element);
            
            // Extract anime info menggunakan berbagai selector
            let title = '';
            let time = '';
            let link = '';
            let poster = '';
            let studioText = '';
            let statusText = '';

            // Title: cari dari berbagai kemungkinan
            title = $element.find('[data-schedule-anime-target="title"]').text().trim();
            if (!title) {
              title = $element.find('a[href*="/anime/"]').attr('title') || '';
            }
            if (!title) {
              title = $element.find('.text-base-content, .font-medium').first().text().trim();
            }
            if (!title) {
              // Fallback: ambil text dari link
              title = $element.find('a[href*="/anime/"]').text().trim();
            }

            // Time: cari dari span dengan data-timeslot-targets
            time = $element.find('[data-timeslot-targets="time"]').text().trim();
            if (!time) {
              time = $element.find('span[class*="text-sm"]').first().text().trim();
            }

            // Link & ID
            const $link = $element.find('a[href*="/anime/"]').first();
            link = $link.attr('href') || '';
            const animeId = link ? link.split('/anime/')[1]?.split('/')[0] : null;

            // Poster
            poster = $element.find('img').attr('src') || '';

            // Studio: cari dari text-xs atau class tertentu
            studioText = $element.find('.text-xs, [class*="studio"]').first().text().trim();

            // Status: cari dari badge atau class tertentu
            statusText = $element.find('[class*="badge"], [class*="status"]').first().text().trim();

            // Episode info
            let episodeInfo = $element.find('[class*="episode"], .text-xs').text().trim();
            if (episodeInfo.includes('EP')) {
              episodeInfo = episodeInfo.match(/EP\d+/)?.[0] || 'N/A';
            }

            if (title && title.length > 0) {
              animeList.push({
                id: animeId,
                title: title,
                time: time || 'N/A',
                episode: episodeInfo || 'N/A',
                link: link ? (link.startsWith('http') ? link : `${LIVECHART_BASE_URL}${link}`) : null,
                studio: studioText || 'N/A',
                status: statusText || 'N/A',
                poster: poster || null
              });
            }
          });

          schedule[dayName] = {
            day: dayName,
            count: animeList.length,
            anime: animeList
          };
        } else {
          schedule[dayName] = {
            day: dayName,
            count: 0,
            anime: []
          };
        }
      });

      console.log('✅ Berhasil scrape schedule');
      return schedule;
    } catch (error) {
      console.error('❌ Error saat scraping schedule:', error.message);
      throw new Error(`Schedule scraping failed: ${error.message}`);
    }
  },

  /**
   * Dapatkan schedule untuk hari tertentu
   * @param {string} day - Day name (monday, tuesday, etc)
   * @returns {Promise<Object>} Schedule untuk hari tertentu
   */
  async getScheduleByDay(day = null) {
    try {
      const schedule = await this.getSchedule();

      if (!day) {
        // Return semua hari
        return schedule;
      }

      // Validate day
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const dayLower = day.toLowerCase();

      if (!validDays.includes(dayLower)) {
        throw new Error(`Invalid day. Must be one of: ${validDays.join(', ')}`);
      }

      // Return hanya hari yang diminta
      return {
        [dayLower]: schedule[dayLower]
      };
    } catch (error) {
      console.error('❌ Error saat get schedule by day:', error.message);
      throw new Error(`Failed to get schedule by day: ${error.message}`);
    }
  },

  /**
   * Dapatkan schedule hari ini
   * @returns {Promise<Object>} Schedule hari ini
   */
  async getTodaySchedule() {
    try {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = new Date();
      const dayIndex = today.getDay();
      const todayName = days[dayIndex];

      const schedule = await this.getSchedule();
      
      return {
        today: todayName,
        date: today.toISOString().split('T')[0],
        schedule: schedule[todayName]
      };
    } catch (error) {
      console.error('❌ Error saat get today schedule:', error.message);
      throw new Error(`Failed to get today schedule: ${error.message}`);
    }
  },

  /**
   * Dapatkan schedule minggu depan
   * @returns {Promise<Object>} Schedule minggu depan
   */
  async getUpcomingSchedule() {
    try {
      const schedule = await this.getSchedule();
      
      // Hitung total anime minggu depan
      const totalAnime = Object.values(schedule).reduce((sum, day) => sum + day.count, 0);
      
      return {
        week: 'upcoming',
        totalAnime: totalAnime,
        schedule: schedule
      };
    } catch (error) {
      console.error('❌ Error saat get upcoming schedule:', error.message);
      throw new Error(`Failed to get upcoming schedule: ${error.message}`);
    }
  }
};

module.exports = scheduleService;
