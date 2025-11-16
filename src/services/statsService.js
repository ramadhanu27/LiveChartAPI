const scrapeService = require('./scrapeService');
const cacheService = require('./cacheService');

/**
 * Service untuk statistics anime dari livechart.me
 */

const statsService = {
  /**
   * Dapatkan total anime
   * @param {string} season - Season (winter, spring, summer, fall)
   * @param {number} year - Year
   * @returns {Promise<Object>} Total anime stats
   */
  async getTotalAnime(season = null, year = null) {
    try {
      // Ambil data anime
      const cacheKey = `${season || 'current'}-${year || 'current'}`;
      let animeData = cacheService.get(cacheKey)?.data;
      
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime(season, year ? parseInt(year) : null);
        cacheService.set(animeData, cacheKey);
      }

      // Hitung statistik
      const totalAnime = animeData.length;
      const avgRating = this._calculateAverageRating(animeData);
      const statusBreakdown = this._getStatusBreakdown(animeData);

      return {
        total: totalAnime,
        averageRating: avgRating,
        statusBreakdown: statusBreakdown,
        season: season || 'current',
        year: year || 'current'
      };
    } catch (error) {
      console.error('❌ Error saat menghitung total anime:', error.message);
      throw new Error(`Failed to get total anime stats: ${error.message}`);
    }
  },

  /**
   * Dapatkan statistik per genre/tag
   * @param {string} season - Season
   * @param {number} year - Year
   * @returns {Promise<Object>} Genre statistics
   */
  async getStatsByGenre(season = null, year = null) {
    try {
      // Ambil data anime
      const cacheKey = `${season || 'current'}-${year || 'current'}`;
      let animeData = cacheService.get(cacheKey)?.data;
      
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime(season, year ? parseInt(year) : null);
        cacheService.set(animeData, cacheKey);
      }

      // Hitung statistik per genre
      const genreStats = {};
      
      animeData.forEach(anime => {
        // Coba extract genre dari berbagai sumber
        let genres = [];
        
        // Source 1: tags field
        if (anime.tags && Array.isArray(anime.tags)) {
          genres = [...anime.tags];
        }
        
        // Source 2: title parsing (extract genre dari title jika ada)
        // Contoh: "One Piece (Action, Adventure)" -> extract "Action", "Adventure"
        if (anime.title && genres.length === 0) {
          const titleMatch = anime.title.match(/\((.*?)\)/);
          if (titleMatch) {
            genres = titleMatch[1].split(',').map(g => g.trim());
          }
        }
        
        // Source 3: Default genre berdasarkan status/type
        if (genres.length === 0) {
          // Assign default genre berdasarkan status
          if (anime.status === 'Ongoing') {
            genres = ['Ongoing'];
          } else if (anime.status === 'Upcoming') {
            genres = ['Upcoming'];
          } else {
            genres = ['Other'];
          }
        }
        
        // Tambahkan ke genre stats
        genres.forEach(genre => {
          const cleanGenre = genre.trim();
          if (cleanGenre && cleanGenre.length > 0) {
            if (!genreStats[cleanGenre]) {
              genreStats[cleanGenre] = {
                count: 0,
                totalRating: 0,
                avgRating: 0,
                titles: []
              };
            }
            genreStats[cleanGenre].count++;
            const rating = parseFloat(anime.score) || 0;
            genreStats[cleanGenre].totalRating += rating;
            genreStats[cleanGenre].titles.push(anime.title);
          }
        });
      });

      // Hitung average rating per genre
      Object.keys(genreStats).forEach(genre => {
        genreStats[genre].avgRating = (genreStats[genre].totalRating / genreStats[genre].count).toFixed(2);
      });

      // Sort by count descending
      const sortedGenres = Object.entries(genreStats)
        .sort((a, b) => b[1].count - a[1].count)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      return {
        total: Object.keys(sortedGenres).length,
        genres: sortedGenres,
        season: season || 'current',
        year: year || 'current'
      };
    } catch (error) {
      console.error('❌ Error saat menghitung stats per genre:', error.message);
      throw new Error(`Failed to get genre stats: ${error.message}`);
    }
  },

  /**
   * Dapatkan statistik per studio
   * @param {string} season - Season
   * @param {number} year - Year
   * @returns {Promise<Object>} Studio statistics
   */
  async getStatsByStudio(season = null, year = null) {
    try {
      // Ambil data anime
      const cacheKey = `${season || 'current'}-${year || 'current'}`;
      let animeData = cacheService.get(cacheKey)?.data;
      
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime(season, year ? parseInt(year) : null);
        cacheService.set(animeData, cacheKey);
      }

      // Hitung statistik per studio
      const studioStats = {};
      
      animeData.forEach(anime => {
        const studio = anime.studio || 'Unknown';
        
        if (!studioStats[studio]) {
          studioStats[studio] = {
            count: 0,
            totalRating: 0,
            avgRating: 0,
            titles: []
          };
        }
        
        studioStats[studio].count++;
        const rating = parseFloat(anime.score) || 0;
        studioStats[studio].totalRating += rating;
        studioStats[studio].titles.push(anime.title);
      });

      // Hitung average rating per studio
      Object.keys(studioStats).forEach(studio => {
        studioStats[studio].avgRating = (studioStats[studio].totalRating / studioStats[studio].count).toFixed(2);
      });

      // Sort by count descending
      const sortedStudios = Object.entries(studioStats)
        .sort((a, b) => b[1].count - a[1].count)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      return {
        total: Object.keys(sortedStudios).length,
        studios: sortedStudios,
        season: season || 'current',
        year: year || 'current'
      };
    } catch (error) {
      console.error('❌ Error saat menghitung stats per studio:', error.message);
      throw new Error(`Failed to get studio stats: ${error.message}`);
    }
  },

  /**
   * Dapatkan statistik per season
   * @returns {Promise<Object>} Season statistics
   */
  async getStatsBySeason() {
    try {
      const SEASONS = ['winter', 'spring', 'summer', 'fall'];
      const CURRENT_YEAR = new Date().getFullYear();
      const seasonStats = {};

      // Ambil data untuk setiap season tahun ini
      for (let season of SEASONS) {
        try {
          const cacheKey = `${season}-${CURRENT_YEAR}`;
          let animeData = cacheService.get(cacheKey)?.data;
          
          if (!animeData) {
            animeData = await scrapeService.scrapeAllAnime(season, CURRENT_YEAR);
            cacheService.set(animeData, cacheKey);
          }

          const avgRating = this._calculateAverageRating(animeData);
          const statusBreakdown = this._getStatusBreakdown(animeData);

          seasonStats[season] = {
            total: animeData.length,
            averageRating: avgRating,
            statusBreakdown: statusBreakdown
          };
        } catch (err) {
          console.warn(`⚠️ Error fetching ${season} data:`, err.message);
          seasonStats[season] = {
            total: 0,
            averageRating: 0,
            statusBreakdown: {}
          };
        }
      }

      return {
        year: CURRENT_YEAR,
        seasons: seasonStats
      };
    } catch (error) {
      console.error('❌ Error saat menghitung stats per season:', error.message);
      throw new Error(`Failed to get season stats: ${error.message}`);
    }
  },

  /**
   * Helper: Hitung average rating
   * @private
   */
  _calculateAverageRating(animeList) {
    if (!animeList || animeList.length === 0) return 0;
    
    const totalRating = animeList.reduce((sum, anime) => {
      return sum + (parseFloat(anime.score) || 0);
    }, 0);
    
    return (totalRating / animeList.length).toFixed(2);
  },

  /**
   * Helper: Dapatkan breakdown status
   * @private
   */
  _getStatusBreakdown(animeList) {
    const breakdown = {
      'Ongoing': 0,
      'Upcoming': 0,
      'Finished': 0,
      'Unknown': 0
    };

    animeList.forEach(anime => {
      const status = anime.status || 'Unknown';
      if (breakdown.hasOwnProperty(status)) {
        breakdown[status]++;
      } else {
        breakdown['Unknown']++;
      }
    });

    return breakdown;
  }
};

module.exports = statsService;
