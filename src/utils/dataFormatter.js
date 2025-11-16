/**
 * Utility functions untuk formatting dan cleaning data
 */

/**
 * Clean dan format episode info
 * @param {string} episodeText - Raw episode text
 * @returns {string} Cleaned episode info (e.g., "EP6")
 */
function cleanEpisodeInfo(episodeText) {
  if (!episodeText) return 'N/A';

  // Cari pattern "EP" diikuti angka atau hanya angka dengan "eps"
  const epMatch = episodeText.match(/(?:EP|ep)?(\d+).*?(?:eps?|episodes?)/i);
  if (epMatch) {
    return 'EP' + epMatch[1];
  }

  // Fallback: cari hanya angka pertama
  const justNumber = episodeText.match(/(\d+)/);
  return justNumber ? 'EP' + justNumber[1] : 'N/A';
}

/**
 * Clean dan format studio name
 * @param {string} studioText - Raw studio text
 * @returns {string} Cleaned studio name
 */
function cleanStudio(studioText) {
  if (!studioText) return 'N/A';

  // Bersihkan multiple studio names (ambil yang pertama)
  let cleaned = studioText.replace(/\s+/g, ' ').split(/[,\n]/)[0].trim();
  
  return cleaned || 'N/A';
}

/**
 * Format score/rating
 * @param {string} scoreText - Raw score text
 * @returns {string|number} Formatted score
 */
function formatScore(scoreText) {
  if (!scoreText) return 'N/A';

  const score = parseFloat(scoreText);
  return isNaN(score) ? 'N/A' : score.toFixed(2);
}

/**
 * Format response object
 * @param {Object} options - Response options
 * @returns {Object} Formatted response
 */
function formatResponse(options = {}) {
  const {
    success = true,
    data = null,
    message = null,
    total = null,
    cached = false,
    timestamp = null,
    error = null
  } = options;

  const response = {
    success,
    timestamp: timestamp || new Date().toISOString()
  };

  if (error) {
    response.error = error;
  }

  if (message) {
    response.message = message;
  }

  if (data !== null) {
    response.data = data;
  }

  if (total !== null) {
    response.total = total;
  }

  if (cached) {
    response.cached = cached;
  }

  return response;
}

/**
 * Validate anime object
 * @param {Object} anime - Anime object
 * @returns {boolean}
 */
function isValidAnime(anime) {
  return anime && 
         anime.title && 
         typeof anime.title === 'string' &&
         anime.title.length > 0;
}

module.exports = {
  cleanEpisodeInfo,
  cleanStudio,
  formatScore,
  formatResponse,
  isValidAnime
};
