# PROJE PROMPTU: Sınıf İçi Bilgi Yarışması ve Soru Bankası Sistemi

Aşağıdaki promptu kod editörüne (Cursor, Windsurf, Claude Code vb.) doğrudan yapıştırabilirsin.

---

## GÖREV

"Sınıf İçi Bilgi Yarışması ve Soru Bankası Sistemi" adında, Kahoot benzeri ama bir öğretmenin kendi müfredatına özel, kalıcı veri tutan bir web uygulamasının **sadece arayüzünü (frontend)** oluştur. Veritabanı bağlantıları daha sonra ben yapacağım; şimdilik tüm veriler mock/local state veya localStorage benzeri geçici yapılarla simüle edilecek, ancak kod, ileride gerçek bir backend'e (örn. Supabase/Postgres) kolayca bağlanabilecek şekilde katmanlı ve temiz yazılmalı.

## TEKNİK GEREKSİNİMLER

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Yayınlama:** GitHub üzerinden Vercel'e deploy edilecek — proje yapısı Vercel ile sıfır ek konfigürasyonla uyumlu olmalı
- **Veri katmanı:** Tüm veri erişimi `lib/data/` veya `services/` gibi ayrı bir katmanda soyutlanmalı (repository pattern), böylece ileride gerçek bir veritabanı bağlanınca sadece bu katman değişecek, UI bileşenlerine dokunulmayacak
- **Ortam değişkenleri:** `.env.local.example` dosyası oluştur; veritabanı bağlantı bilgileri ve AI API key için placeholder değişkenler tanımla (örn. `DATABASE_URL`, `AI_API_KEY`)

## ROLLER VE GİRİŞ

İki ayrı rol/giriş akışı olmalı (basit bir mock auth yeterli, gerçek kimlik doğrulama sonra eklenecek):

1. **Öğretmen**
2. **Öğrenci**

Giriş sonrası her rol kendi paneline yönlendirilmeli.

## ÖĞRETMEN PANELİ

- **Soru Bankası Yönetimi**
  - Yeni soru ekleme formu: soru metni, çoktan seçmeli şıklar, doğru cevap, **konu/ünite** etiketi, **zorluk seviyesi** (kolay/orta/zor)
  - Soru listesi: filtreleme (ünite, zorluk seviyesine göre) ve arama
  - Soru düzenleme ve silme
- **Quiz Oluşturma**
  - Soru bankasından seçilen sorularla yeni bir quiz/yarışma oluşturma
  - Quiz'i öğrencilere açma/kapatma (canlı oturum benzeri, Kahoot'taki gibi bir "başlat" ekranı olabilir — basit bir mock lobi/kod ekranı yeterli)
- **İstatistik Paneli**
  - Sınıfın ünite/konu bazında ortalama başarı yüzdesi (grafik: bar chart)
  - "Sınıfın en zayıf olduğu konular" listesi — düşükten yükseğe sıralı
  - Öğrenci bazında performans tablosu (isim, katıldığı quiz sayısı, ortalama puan)
  - Zaman içindeki gelişim grafiği (opsiyonel çizgi grafik)

## ÖĞRENCİ PANELİ

- Açık/aktif quizlere katılma ekranı (soru-cevap akışı, süre sayacı, anlık geri bildirim — doğru/yanlış)
- Quiz sonunda puan ve doğru/yanlış özeti
- **Geçmiş performans:** öğrencinin bugüne kadarki tüm quiz sonuçları, konu bazlı başarı grafiği
- Basit bir profil/skor kartı (toplam puan, rozet/başarı gibi motive edici küçük bir unsur eklenebilir — opsiyonel)

## YAPAY ZEKA FEN BİLİMLERİ ÖĞRETMENİ (AI ASİSTAN)

- Öğrenci panelinde ayrı bir sekme/bölüm: **"Fen Bilimleri Yapay Zeka Öğretmeni"**
- Öğrenci serbest metinle fen bilimleri sorusu sorabilmeli, AI (bir dil modeli API'si — API key ile) buna öğretmen edasıyla, öğrenci seviyesine uygun sade bir dille cevap vermeli
- Bu entegrasyonu ayrı bir API route (`app/api/ai-science-teacher/route.ts` gibi) üzerinden yap; API key'i `.env.local` üzerinden okuyacak şekilde kur, kodun içine **asla** gerçek bir key gömme
- Sohbet arayüzü basit bir chat UI olsun (mesaj balonları, yükleniyor durumu, hata durumu)
- Şimdilik API key placeholder olacağı için, key tanımlı değilse arayüzde nazik bir "AI asistan şu anda yapılandırılmadı" mesajı göster (uygulama çökmemeli)

## VERİ MODELİ (mock/tip tanımları)

TypeScript interface'leri olarak tanımla, örnek:

- `Question`: id, text, options[], correctAnswerIndex, unit/topic, difficulty
- `Quiz`: id, title, questionIds[], createdAt, status (draft/active/closed)
- `Student`: id, name, class
- `QuizResult`: id, studentId, quizId, score, answeredQuestions[] (questionId, isCorrect, timeSpent)
- `TopicPerformance`: studentId veya class bazında, topic, correctRate

## SAYFA/ROUTE YAPISI (öneri)

```
/                          → giriş/rol seçimi
/teacher/dashboard         → öğretmen ana panel
/teacher/questions         → soru bankası
/teacher/quizzes           → quiz oluştur/yönet
/teacher/statistics        → istatistik paneli
/student/dashboard         → öğrenci ana panel
/student/quiz/[quizId]     → aktif quiz ekranı
/student/history           → geçmiş performans
/student/ai-science        → AI fen bilimleri öğretmeni
```

## TASARIM

- Sade, modern, öğretmen/öğrenci için sezgisel bir arayüz
- Kahoot'un canlılığından ilham al ama daha "kurumsal/okul" hissi olsun (aşırı renkli/oyuncak gibi olmasın)
- Mobil uyumlu (responsive) olsun, öğrenciler telefondan da katılabilmeli
- Grafikler için `recharts` kullanılabilir

## ORTAM DEĞİŞKENLERİ (.env.local)

Aşağıdaki değerleri `.env.local` dosyasına ekle (bu dosya `.gitignore` içinde olmalı, GitHub'a asla push edilmemeli):

```
AI_API_KEY="your-api-key-here"

DATABASE_URL="postgres://user:password@host:5432/dbname"
POSTGRES_URL="postgres://user:password@host:5432/dbname"
PRISMA_DATABASE_URL="postgres://user:password@host:5432/dbname"
```

Kod editörüne şunu da belirt: Prisma kullanılacaksa `schema.prisma` içinde `datasource db` bloğu `env("DATABASE_URL")` okumalı; Vercel'e deploy ederken bu değişkenler Vercel proje ayarlarındaki **Environment Variables** kısmına da ayrıca eklenmeli (kod deposuna değil).


