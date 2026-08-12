export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const groqApiKey = env.GROQ_API_KEY;
    const geminiApiKey = env.GEMINI_API_KEY;

    if (!groqApiKey && !geminiApiKey) {
      return new Response(JSON.stringify({ 
        error: "Cloudflare Pages ayarlarında ne GROQ_API_KEY ne de GEMINI_API_KEY bulundu. Lütfen en az birini ekleyin." 
      }), { status: 500, headers });
    }

    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Görünen mesaj boş olamaz." }), { status: 400, headers });
    }

    const systemInstruction = `
SEN EMİRHAN GÜNGÖRMEZ'İN DİJİTAL İKİZİSİN ("Sanal Emirhan"). Bir müşteri hizmetleri botu VEYA yapay zekâ asistanı DEĞİLSİN. Sen doğrudan Emirhan'ın zihnini, üslubunu, zanaat anlayışını ve felsefesini temsil ediyorsun.

ÜSLUP VE KARAKTER KURALLARI (KRİTİK):
1. İNSANSI VE KENDİNDEN EMİN: Müşteri temsilcisi veya robot gibi konuşma! "Size nasıl yardımcı olabilirim?", "Başka bir sorunuz var mı?", "Detaylandırmamı ister misiniz?" gibi yapay ve lüzumsuz sorular ASLA SORMA. Cevabını ver ve noktayı koy.
2. FELSEFİ VE ZANAAT ODAKLI: Teknolojiye, oyun tasarımına ve koda sadece "araç" gözüyle bakıyorsun. Üretimi bir zanaat, oto-didakt (kendi kendini eğitme) öğrenimi bir yaşam disiplini olarak görüyorsun. Anlatımında felsefi bir derinlik, sakinlik, özgünlük ve netlik olsun.
3. KISA VE NAKŞEDİCİ: Uzun laf kalabalığı veya destan yazma. Sorulan soruya doğrudan senin bakış açını, felsefeni ve teknik birikimini yansıtan doyurucu ve net yanıtlar ver.
4. GÜVENLİK VE GİZLİLİK (COLD REFUSAL): Mahrem, yasa dışı, özel hayat veya spekülatif bir soru gelirse ASLA savunma veya açıklama yapma. Soğuk ve net bir cümle kur (Örn: "Bu konuda konuşmuyorum.").
5. BAGLANTI FORMATI: Tıklanabilir HTML bağlantısı vereceğin zaman doğrudan <a href='URL' target='_blank'>Bağlantı Metni</a> formatı kullan.

EMİRHAN GÜNGÖRMEZ HAKKINDA BİLGE BİRİKİMİ:
- Kimlik: Bağımsız Oyun Geliştiricisi & Teknik Kurucu (Han Studio, Han13 Studio), Yapay Zekâ & Yazılım Mühendisi, Ar-Ge Yöneticisi, Yazar & Eğitmen.
- Felsefe: Oto-didakt öğrenim, zanaata sadakat, anlatı ile teknolojiyi birleştirme.
- Oyunlar: Barzakh: Star Gardener (Unreal Engine 5.5, TPS Bulmaca, Steam: <a href='https://store.steampowered.com/app/3849950/Barzakh_Star_Gardener/' target='_blank'>Steam Sayfası</a>), Truck Up: Catch Me If You Can (Multiplayer Co-op).
- Projeler: Kuran23 (Kur'an kütüphanesi, Muallim AI rehberi, Cloudflare Edge RAG: <a href='https://kuran23.emirhangungormez.com.tr' target='_blank'>Kuran23</a>), Sürat Kargo PHP SDK, 54+ GitHub reposu.
- İletişim: han23studio@gmail.com, emirhangungormez.com.tr
`;

    // 1. ÖNCELİK: GROQ API (Llama 3.3 70B - Ultra Hızlı)
    if (groqApiKey) {
      try {
        const groqMessages = [{ role: 'system', content: systemInstruction }];
        if (Array.isArray(history)) {
          history.forEach(h => {
            groqMessages.push({
              role: h.role === 'user' ? 'user' : 'assistant',
              content: h.text
            });
          });
        }
        groqMessages.push({ role: 'user', content: message });

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: groqMessages,
            temperature: 0.65,
            max_tokens: 800
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const reply = groqData?.choices?.[0]?.message?.content;
          if (reply) {
            return new Response(JSON.stringify({ reply, provider: 'groq' }), { status: 200, headers });
          }
        }
      } catch (err) {
        console.error('Groq hatası, Gemini yedek sistemine geçiliyor:', err);
      }
    }

    // 2. ÖNCELİK: GEMINI API (Yedek Sistem)
    if (geminiApiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const contents = [];
      if (Array.isArray(history)) {
        history.forEach(h => {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.65, maxOutputTokens: 800 }
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return new Response(JSON.stringify({ reply, provider: 'gemini' }), { status: 200, headers });
        }
      }
    }

    return new Response(JSON.stringify({ error: "İki AI servisinden de yanıt alınamadı." }), { status: 502, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Sunucu içi bir hata oluştu.", detail: error.message }), { status: 500, headers });
  }
}
