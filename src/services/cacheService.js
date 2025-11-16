/**
 * Service untuk mengelola cache data dengan support multiple keys
 */

const CACHE_DURATION = 60 * 60 * 1000; // 1 jam

const cacheService = {
  cache: new Map(), // Gunakan Map untuk multiple cache keys

  /**
   * Set cache data
   * @param {Array} data - Data to cache
   * @param {string} key - Cache key (default: 'default')
   */
  set(data, key = 'default') {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
    console.log(`💾 Cache updated for key: ${key}`);
  },

  /**
   * Get cache data jika masih valid
   * @param {string} key - Cache key (default: 'default')
   * @returns {Object|null} { data, timestamp } atau null jika expired
   */
  get(key = 'default') {
    const cacheItem = this.cache.get(key);
    
    if (!cacheItem) {
      return null;
    }

    const now = Date.now();
    const age = now - cacheItem.timestamp;

    if (age > CACHE_DURATION) {
      console.log(`⏰ Cache expired for key: ${key}`);
      this.clear(key);
      return null;
    }

    return {
      data: cacheItem.data,
      timestamp: cacheItem.timestamp,
      age: age
    };
  },

  /**
   * Check apakah cache masih valid
   * @param {string} key - Cache key (default: 'default')
   * @returns {boolean}
   */
  isValid(key = 'default') {
    return this.get(key) !== null;
  },

  /**
   * Clear cache untuk key tertentu
   * @param {string} key - Cache key (null untuk clear semua)
   */
  clear(key = null) {
    if (key === null) {
      this.cache.clear();
      console.log('🗑️ All cache cleared');
    } else {
      this.cache.delete(key);
      console.log(`🗑️ Cache cleared for key: ${key}`);
    }
  },

  /**
   * Get cache info
   * @returns {Object}
   */
  getInfo() {
    const info = {
      totalKeys: this.cache.size,
      keys: []
    };

    for (const [key, value] of this.cache.entries()) {
      const age = Date.now() - value.timestamp;
      const isValid = age <= CACHE_DURATION;
      
      info.keys.push({
        key: key,
        count: value.data.length,
        age: age,
        isValid: isValid
      });
    }

    return info;
  }
};

module.exports = cacheService;
