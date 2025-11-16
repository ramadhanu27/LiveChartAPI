const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Web Scraper untuk livechart.me
 * Mengambil data anime dari Fall 2025 season
 */

async function scrapeAnimeData() {
  try {
    const url = 'https://www.livechart.me/fall-2025/tv?ongoing=all';
    
    console.log('🔄 Scraping data dari:', url);
    console.log('⏳ Menunggu response...\n');
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.livechart.me/'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const animeList = [];

    console.log('📊 Parsing HTML...\n');

    // Selector utama: article.anime
    $('article.anime').each((index, element) => {
      try {
        const $element = $(element);
        
        // 1. Judul anime
        const title = $element.find('h3, [data-anime-card-list-target]').first().text().trim() ||
                     $element.attr('data-anime-title');
        
        // 2. Link anime
        const link = $element.find('a[href*="/anime/"]').first().attr('href');
        
        // 3. ID anime dari data attribute
        const animeId = $element.attr('data-anime-id');
        
        // 4. Status (Ongoing, Upcoming, etc)
        const statusElement = $element.find('[class*="status"], .badge, span[class*="badge"]').first();
        const status = statusElement.text().trim() || 'Unknown';
        
        // 5. Episode info - ekstrak hanya angka episode
        let episodeText = $element.find('[class*="episode"], .eps, span[class*="ep"]').text().trim();
        // Cari pattern "EP" diikuti angka atau hanya angka dengan "eps"
        const epMatch = episodeText.match(/(?:EP|ep)?(\d+).*?(?:eps?|episodes?)/i);
        if (epMatch) {
          episodeText = 'EP' + epMatch[1];
        } else {
          const justNumber = episodeText.match(/(\d+)/);
          episodeText = justNumber ? 'EP' + justNumber[1] : 'N/A';
        }
        
        // 6. Studio
        const studioElement = $element.find('[class*="studio"], .studio').first();
        const studio = studioElement.text().trim() || 'N/A';
        
        // 7. Rating/Score
        const scoreElement = $element.find('.score, [class*="rating"], span[class*="score"]').first();
        const score = scoreElement.text().trim() || 'N/A';
        
        // 8. Poster image
        const posterImg = $element.find('img').first().attr('src');
        
        // 9. Genres
        const genres = [];
        $element.find('[class*="genre"], .genre').each((i, el) => {
          const genre = $(el).text().trim();
          if (genre) genres.push(genre);
        });
        
        // 10. Air date/time
        const airDate = $element.find('[class*="date"], .air-date').text().trim();

        if (title) {
          animeList.push({
            id: animeId || null,
            title: title,
            link: link ? (link.startsWith('http') ? link : 'https://www.livechart.me' + link) : null,
            status: status,
            episodes: episodeText || 'N/A',
            studio: studio,
            score: score,
            genres: genres.length > 0 ? genres : [],
            airDate: airDate || 'N/A',
            poster: posterImg || null
          });
        }
      } catch (err) {
        console.error(`❌ Error parsing anime item ${index}:`, err.message);
      }
    });

    return animeList;
  } catch (error) {
    console.error('❌ Error saat scraping:', error.message);
    throw error;
  }
}

/**
 * Main function untuk testing
 */
async function main() {
  try {
    const animeData = await scrapeAnimeData();
    
    console.log(`\n✅ Berhasil scrape ${animeData.length} anime!\n`);
    
    // Display sample data
    if (animeData.length > 0) {
      console.log('📺 Sample data (3 anime pertama):\n');
      animeData.slice(0, 3).forEach((anime, index) => {
        console.log(`${index + 1}. ${anime.title}`);
        console.log(`   Status: ${anime.status}`);
        console.log(`   Studio: ${anime.studio}`);
        console.log(`   Episodes: ${anime.episodes}`);
        console.log(`   Link: ${anime.link}`);
        console.log('');
      });
    }
    
    // Save to JSON file
    const outputFile = 'anime_data.json';
    fs.writeFileSync(outputFile, JSON.stringify(animeData, null, 2));
    console.log(`💾 Data disimpan ke: ${outputFile}`);
    
    // Display statistics
    console.log('\n📈 Statistik:');
    console.log(`   Total anime: ${animeData.length}`);
    console.log(`   Dengan poster: ${animeData.filter(a => a.poster).length}`);
    console.log(`   Dengan score: ${animeData.filter(a => a.score !== 'N/A').length}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { scrapeAnimeData };
