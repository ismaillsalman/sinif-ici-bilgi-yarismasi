import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Geçerli bir mesaj gönderilmedi.' },
        { status: 400 }
      );
    }

    const rawApiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.replace(/^["']|["']$/g, '').trim() : '';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'AI asistan şu anda yapılandırılmadı. Lütfen sunucu ortam değişkenlerinde GEMINI_API_KEY tanımlayın.',
        },
        { status: 503 }
      );
    }

    // System prompt for the AI teacher
    const systemInstruction = `Sen bir fen bilimleri öğretmenisin. Adın "Fen Bilimleri AI Öğretmeni". 
Görevin ortaokul (5-8. sınıf) seviyesindeki öğrencilere fen bilimleri konularında yardım etmek.
Kuralların:
- Her zaman Türkçe cevap ver.
- Sade, anlaşılır ve öğrenci seviyesine uygun bir dil kullan.
- Gerektiğinde örnekler ver ve günlük hayattan bağlantılar kur.
- Karmaşık kavramları basit kelimelerle açıkla.
- Soruyu cevaplarken önce kısa bir özet ver, sonra detaylandır.
- Öğrenciyi motive eden, destekleyici bir üslup kullan.
- Sadece fen bilimleri (fizik, kimya, biyoloji, yer bilimleri, astronomi) konularında cevap ver.
- Fen bilimleri dışındaki sorularda nazikçe konuyu fen bilimlerine yönlendir.`;

    // Models to try in order (flash-lite models have separate quotas and lower latency)
    const configuredModel = process.env.GEMINI_MODEL;
    const candidateModels = Array.from(
      new Set(
        [
          configuredModel,
          'gemini-3.5-flash-lite',
          'gemini-3.1-flash-lite',
          'gemini-3.6-flash',
        ].filter(Boolean) as string[]
      )
    );

    let lastError = '';

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: message }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errMsg = errorData?.error?.message || `HTTP ${response.status}`;
          lastError = errMsg;
          console.warn(`Gemini API (${model}) hatası: ${response.status} - ${errMsg}. Diğer modele geçiliyor...`);

          // If rate limit (429) or high demand (503), try next model immediately
          if (response.status === 429 || response.status === 503) {
            continue;
          }
          // If 404 (model not found), try next model
          if (response.status === 404) {
            continue;
          }
          continue;
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        const reply = parts
          .map((p: { text?: string }) => p.text || '')
          .filter(Boolean)
          .join('\n')
          .trim();

        if (reply) {
          return NextResponse.json({ reply });
        }

        console.warn(`Gemini API (${model}): Boş cevap döndü, diğer model deneniyor.`);
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Bağlantı hatası';
        console.warn(`Gemini API (${model}) ağ hatası:`, err);
      }
    }

    // If all models hit quota or failed, gracefully provide education response instead of crashing
    console.warn('Tüm Gemini modelleri kota/bağlantı sınırına ulaştı. Akıllı yedek cevap döndürülüyor.', lastError);
    return NextResponse.json({
      reply: getMockResponse(message),
      isFallback: true,
    });
  } catch (error) {
    console.error('Chat API Route Error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

// Fallback mock responses if the API call fails
function getMockResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('atom')) {
    return `Harika bir soru! 🔬\n\n**Atom**, maddenin en küçük yapı taşıdır. Her şey atomlardan oluşur — sen, ben, su, hava, hepsi!\n\nAtomun 3 temel parçacığı vardır:\n1. **Proton** (+): Çekirdekte bulunur, pozitif yüklüdür\n2. **Nötron** (0): Çekirdekte bulunur, yüksüzdür\n3. **Elektron** (-): Çekirdeğin etrafında döner, negatif yüklüdür\n\n💡 Bunu bir Güneş sistemine benzetebilirsin: Çekirdek güneş gibidir, elektronlar ise gezegenler gibi etrafında döner!\n\nBaşka sorun var mı? 😊`;
  }

  if (lower.includes('fotosentez')) {
    return `Mükemmel soru! 🌱\n\n**Fotosentez**, bitkilerin güneş ışığını kullanarak kendi besinlerini üretmesidir.\n\nFormülü: **6CO₂ + 6H₂O + Güneş ışığı → C₆H₁₂O₆ + 6O₂**\n\nBasitçe anlatırsak:\n- Bitkiler **karbondioksit** (CO₂) ve **su** (H₂O) alır\n- **Güneş ışığı** enerjisini kullanır\n- **Glikoz** (şeker/besin) ve **oksijen** üretir\n\n🍃 Yani bitkiler bizim nefes aldığımız oksijeni üretir! Bu yüzden ağaçlar çok önemlidir.\n\nFotosentez **yapraklardaki kloroplast** organelinde gerçekleşir. Yaprakların yeşil olmasının sebebi de klorofil pigmentidir!`;
  }

  if (lower.includes('yerçekimi') || lower.includes('yer çekimi')) {
    return `Süper bir soru! 🌍\n\n**Yerçekimi**, kütlesi olan tüm cisimlerin birbirini çekmesidir.\n\nIsaac Newton, bir elmanın ağaçtan düşmesini gözlemlemiş ve yerçekimi yasasını keşfetmiş! 🍎\n\nÖnemli bilgiler:\n- **Kütle** arttıkça yerçekimi kuvveti **artar**\n- **Uzaklık** arttıkça yerçekimi kuvveti **azalır**\n- Dünya'nın yerçekimi ivmesi: **g = 9,8 m/s²**\n\n💡 Günlük hayattan örnekler:\n- Topun yere düşmesi\n- Ayın Dünya'nın etrafında dönmesi\n- Gezegenlerin Güneş'in etrafında dönmesi\n\nHepsi yerçekimi sayesinde olur!`;
  }

  return `Teşekkürler, bu güzel bir soru! 🔬\n\nBu konuda sana yardımcı olmaya çalışayım. Sorduğun konu fen bilimleri alanında çok önemli bir yere sahip.\n\nDaha detaylı bir cevap verebilmem için sorunu biraz daha açar mısın? Örneğin:\n- Hangi sınıf seviyesinde bu konuyu işliyorsun?\n- Konunun hangi kısmında zorlanıyorsun?\n\nBu arada şu konularda da soru sorabilirsin:\n🔬 Fizik (kuvvet, hareket, enerji, elektrik, ışık)\n🧪 Kimya (atom, element, bileşik, karışım)\n🧬 Biyoloji (hücre, fotosentez, sindirim, solunum)\n🌍 Yer Bilimleri (deprem, volkan, kayaçlar)\n🌌 Astronomi (gezegenler, yıldızlar, uzay)\n\nMerak ettiğin her şeyi sorabilirsin! 😊`;
}
