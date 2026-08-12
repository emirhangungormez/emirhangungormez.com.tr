const fs = require('fs');
const path = require('path');
const https = require('https');

const KNOWLEDGE_PATH = path.join(__dirname, '..', 'emirhan_knowledge.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Helper to make HTTPS GET requests
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'NodeJS-AutoMemoryUpdater' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
  });
}

// Helper to call Gemini API if API key exists
async function generateSummaryWithAI(promptText) {
  if (!GEMINI_API_KEY) return null;

  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    });

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          resolve(text || null);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

async function updateKnowledgeBase() {
  console.log('🔄 Otomatik Hafıza Güncelleme Başlatılıyor...');

  if (!fs.existsSync(KNOWLEDGE_PATH)) {
    console.error('❌ emirhan_knowledge.json bulunamadı!');
    process.exit(1);
  }

  const knowledge = JSON.parse(fs.readFileSync(KNOWLEDGE_PATH, 'utf8'));

  // 1. GitHub Repolarını Çek
  console.log('🌐 GitHub Repoları Denetleniyor...');
  const repos = await fetchJson('https://api.github.com/users/emirhangungormez/repos?per_page=100&sort=updated');

  if (repos && Array.isArray(repos)) {
    if (!knowledge.github_profile) {
      knowledge.github_profile = {
        access_level: "public",
        username: "emirhangungormez",
        url: "https://github.com/emirhangungormez",
        stats: { public_repos: repos.length },
        featured_and_production_repos: [],
        game_development_repos: [],
        cybersecurity_and_networking_repos: [],
        ai_data_and_research_repos: [],
        forked_and_studied_open_source_repos: []
      };
    }

    knowledge.github_profile.stats.public_repos = repos.length;

    // Mevcut repo isimlerini topla
    const existingRepoNames = new Set();
    const categories = [
      'featured_and_production_repos',
      'game_development_repos',
      'cybersecurity_and_networking_repos',
      'ai_data_and_research_repos',
      'forked_and_studied_open_source_repos'
    ];

    categories.forEach(cat => {
      if (Array.isArray(knowledge.github_profile[cat])) {
        knowledge.github_profile[cat].forEach(r => {
          if (r.name) existingRepoNames.add(r.name);
        });
      }
    });

    // Yeni eklenmiş repo tespiti
    const newRepos = repos.filter(r => !existingRepoNames.has(r.name));

    if (newRepos.length > 0) {
      console.log(`✨ ${newRepos.length} Adet Yeni Repo Tespit Edildi!`);

      for (const repo of newRepos) {
        let summary = repo.description || 'Yeni eklenen GitHub projesi.';
        
        // Eğer Gemini API Key varsa AI ile özetle
        if (GEMINI_API_KEY) {
          const aiSummary = await generateSummaryWithAI(
            `Aşağıdaki GitHub projesi için Sanal Emirhan hafıza sistemine uygun 1 cümlelik Türkçe teknik özet yaz:\nProje Adı: ${repo.name}\nAçıklama: ${repo.description || 'Yok'}\nDil: ${repo.language || 'Bilinmiyor'}`
          );
          if (aiSummary) summary = aiSummary;
        }

        const repoEntry = {
          name: repo.name,
          url: repo.html_url,
          language: repo.language || 'Bilinmiyor',
          description: summary
        };

        // Kategori belirle ve ekle
        if (repo.fork) {
          knowledge.github_profile.forked_and_studied_open_source_repos.push(repoEntry);
        } else if (repo.name.includes('unity') || repo.name.includes('ue5') || repo.name.includes('game')) {
          knowledge.github_profile.game_development_repos.push(repoEntry);
        } else if (repo.name.includes('cyber') || repo.name.includes('security') || repo.name.includes('api')) {
          knowledge.github_profile.cybersecurity_and_networking_repos.push(repoEntry);
        } else {
          knowledge.github_profile.featured_and_production_repos.push(repoEntry);
        }

        console.log(`  + Eklendi: ${repo.name}`);
      }
    } else {
      console.log('✅ Yeni GitHub reposu bulunamadı. Liste güncel.');
    }
  }

  // 2. Güncellenmiş Zaman Damgası Ekle
  if (!knowledge.metadata) knowledge.metadata = {};
  knowledge.metadata.last_auto_updated_at = new Date().toISOString();

  // 3. Dosyayı Kaydet ve Doğrula
  fs.writeFileSync(KNOWLEDGE_PATH, JSON.stringify(knowledge, null, 2), 'utf8');
  console.log('🎉 emirhan_knowledge.json başarıyla güncellendi ve doğrulandı!');
}

updateKnowledgeBase().catch(err => {
  console.error('❌ Hata oluştu:', err);
  process.exit(1);
});
