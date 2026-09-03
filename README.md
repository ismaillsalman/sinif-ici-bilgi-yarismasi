# 🎯 Sınıf İçi Bilgi Yarışması ve Soru Bankası Sistemi

Kahoot benzeri dinamik yarışma deneyimi sunan, öğretmenin kendi müfredatına özel soru bankası ve quizler oluşturabildiği, öğrencilerin yarışıp performanslarını takip edebildiği ve entegre **Google Gemini AI Fen Öğretmeni** içeren modern bir web uygulaması.

---

## ✨ Özellikler

### 🧑‍🏫 Öğretmen Paneli
- **Soru Bankası Yönetimi:** Ünite, konu ve zorluk derecesine göre soru ekleme, düzenleme, silme ve filtreleme.
- **Quiz Yönetimi:** Soru havuzundan soru seçerek dinamik sürelerle quiz oluşturma.
- **Lobi ve Katılım Kodu:** Öğrencilerin katılması için 6 haneli katılım kodu üretimi ve lobi ekranı.
- **İstatistik ve Analiz:** Recharts ile konu bazlı başarı grafikleri, sınıf gelişim eğrisi, zayıf konular ve öğrenci sıralaması.

### 🧑‍🎓 Öğrenci Paneli
- **Quiz Katılımı:** Katılım koduyla veya açık quizlere anında giriş.
- **İnteraktif Yarışma Arayüzü:** Süre sayacı, renkli seçenekler, anlık doğru/yanlış animasyonları.
- **Gelişim ve Rozetler:** Tamamlanan quizler, puanlar, başarı rozetleri ve konu bazlı eksik analizi.
- **🤖 AI Fen Bilimleri Öğretmeni:** Google Gemini 3.6 Flash destekli, fen bilimleri müfredatına özel soru-cevap asistanı.
- **Canlı Quiz Sunumu:** Öğretmen panelinden tek tıkla yarışma başlatma, canlı soru geçişi ve liderlik tablosu.
- **Sunucu Taraflı AI Proxy:** API anahtarları asla istemciye sızdırılmaz; `app/api/chat/route.ts` üzerinden `process.env.GEMINI_API_KEY` ile güvenli iletişim.

---

## 🛠️ Teknoloji Yığını

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Stil:** React 19, Tailwind CSS 4, Lucide Icons, Glassmorphism
- **Grafikler:** Recharts
- **Yapay Zeka:** Google Gemini API (gemini-3.6-flash)

---

## 🛠️ Teknolojiler

- **Framework:** Next.js 15+ (App Router)
- **Dil:** TypeScript
- **Stil & Tasarım:** Tailwind CSS v4, Glassmorphism, Özel Animasyonlar
- **Grafikler:** Recharts
- **Yapay Zeka:** Google Gemini API (gemini-2.5-flash)

---

## 🚀 Başlarken

### 1. Depoyu Klonlayın ve Bağımlılıkları Yükleyin

```bash
git clone https://github.com/ismaillsalman/sinif-ici-bilgi-yarismasi.git
cd sinif-ici-bilgi-yarismasi
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local.example` dosyasını `.env.local` olarak kopyalayın ve Gemini API anahtarınızı girin:

```bash
cp .env.local.example .env.local
```

`.env.local`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı kullanmaya başlayabilirsiniz!
