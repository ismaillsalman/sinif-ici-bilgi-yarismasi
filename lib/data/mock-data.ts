// ==========================================
// Mock Veri — Sınıf İçi Bilgi Yarışması
// ==========================================

import { Question, Quiz, Student, QuizResult, AnsweredQuestion } from '@/lib/types';

// ---- SORULAR ----
export const mockQuestions: Question[] = [
  // Ünite 1: Madde ve Değişim
  {
    id: 'q1',
    text: 'Maddenin katı, sıvı ve gaz hallerine ne denir?',
    options: ['Maddenin halleri', 'Maddenin özellikleri', 'Maddenin değişimi', 'Maddenin yapısı'],
    correctAnswerIndex: 0,
    unit: 'Madde ve Değişim',
    topic: 'Maddenin Halleri',
    difficulty: 'kolay',
    createdAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 'q2',
    text: 'Aşağıdakilerden hangisi fiziksel değişimdir?',
    options: ['Kağıdın yanması', 'Suyun buharlaşması', 'Demirin paslanması', 'Ekmeğin küflenmesi'],
    correctAnswerIndex: 1,
    unit: 'Madde ve Değişim',
    topic: 'Fiziksel ve Kimyasal Değişim',
    difficulty: 'kolay',
    createdAt: '2024-09-01T10:05:00Z',
  },
  {
    id: 'q3',
    text: 'Maddenin en küçük yapı taşına ne denir?',
    options: ['Molekül', 'Atom', 'Elektron', 'Proton'],
    correctAnswerIndex: 1,
    unit: 'Madde ve Değişim',
    topic: 'Atom ve Molekül',
    difficulty: 'orta',
    createdAt: '2024-09-01T10:10:00Z',
  },
  {
    id: 'q4',
    text: 'Hangi madde karışım örneğidir?',
    options: ['Saf su', 'Tuzlu su', 'Oksijen', 'Altın'],
    correctAnswerIndex: 1,
    unit: 'Madde ve Değişim',
    topic: 'Saf Madde ve Karışım',
    difficulty: 'orta',
    createdAt: '2024-09-01T10:15:00Z',
  },
  {
    id: 'q5',
    text: 'Bir maddenin yoğunluğu hesaplanırken hangi formül kullanılır?',
    options: ['d = m × V', 'd = m / V', 'd = V / m', 'd = m + V'],
    correctAnswerIndex: 1,
    unit: 'Madde ve Değişim',
    topic: 'Yoğunluk',
    difficulty: 'zor',
    createdAt: '2024-09-01T10:20:00Z',
  },
  // Ünite 2: Kuvvet ve Hareket
  {
    id: 'q6',
    text: 'Bir cisme uygulanan net kuvvet sıfırsa cisim ne yapar?',
    options: ['Hızlanır', 'Yavaşlar', 'Durur veya sabit hızla hareket eder', 'Yön değiştirir'],
    correctAnswerIndex: 2,
    unit: 'Kuvvet ve Hareket',
    topic: 'Kuvvet ve Denge',
    difficulty: 'orta',
    createdAt: '2024-09-02T10:00:00Z',
  },
  {
    id: 'q7',
    text: 'Yerçekimi kuvveti ile ilgili hangisi doğrudur?',
    options: ['Sadece Dünya\'da vardır', 'Kütlesi olan tüm cisimler arasında vardır', 'Sadece büyük cisimleri etkiler', 'Uzayda yoktur'],
    correctAnswerIndex: 1,
    unit: 'Kuvvet ve Hareket',
    topic: 'Yerçekimi',
    difficulty: 'kolay',
    createdAt: '2024-09-02T10:05:00Z',
  },
  {
    id: 'q8',
    text: 'Sürtünme kuvveti hakkında hangisi yanlıştır?',
    options: ['Hareketi zorlaştırır', 'Hareket yönünün tersinedir', 'Yüzey pürüzsüzse artar', 'Isı açığa çıkmasına neden olur'],
    correctAnswerIndex: 2,
    unit: 'Kuvvet ve Hareket',
    topic: 'Sürtünme Kuvveti',
    difficulty: 'orta',
    createdAt: '2024-09-02T10:10:00Z',
  },
  {
    id: 'q9',
    text: 'Bir cismin ağırlığı hangi birimle ölçülür?',
    options: ['Kilogram (kg)', 'Newton (N)', 'Metre (m)', 'Joule (J)'],
    correctAnswerIndex: 1,
    unit: 'Kuvvet ve Hareket',
    topic: 'Kütle ve Ağırlık',
    difficulty: 'kolay',
    createdAt: '2024-09-02T10:15:00Z',
  },
  {
    id: 'q10',
    text: 'F = m × a formülünde "a" neyi temsil eder?',
    options: ['Ağırlık', 'Alan', 'İvme', 'Açı'],
    correctAnswerIndex: 2,
    unit: 'Kuvvet ve Hareket',
    topic: 'Newton Yasaları',
    difficulty: 'zor',
    createdAt: '2024-09-02T10:20:00Z',
  },
  // Ünite 3: Elektrik
  {
    id: 'q11',
    text: 'Elektrik akımının birimi nedir?',
    options: ['Volt', 'Amper', 'Ohm', 'Watt'],
    correctAnswerIndex: 1,
    unit: 'Elektrik',
    topic: 'Elektrik Akımı',
    difficulty: 'kolay',
    createdAt: '2024-09-03T10:00:00Z',
  },
  {
    id: 'q12',
    text: 'Bir elektrik devresinde ampermetre nasıl bağlanır?',
    options: ['Paralel', 'Seri', 'Karışık', 'Bağlanmaz'],
    correctAnswerIndex: 1,
    unit: 'Elektrik',
    topic: 'Ölçü Aletleri',
    difficulty: 'orta',
    createdAt: '2024-09-03T10:05:00Z',
  },
  {
    id: 'q13',
    text: 'Ohm yasasına göre V = I × R formülünde R neyi ifade eder?',
    options: ['Akım', 'Gerilim', 'Direnç', 'Güç'],
    correctAnswerIndex: 2,
    unit: 'Elektrik',
    topic: 'Ohm Yasası',
    difficulty: 'orta',
    createdAt: '2024-09-03T10:10:00Z',
  },
  {
    id: 'q14',
    text: 'İletken maddelere hangisi örnek verilebilir?',
    options: ['Plastik', 'Cam', 'Bakır', 'Kauçuk'],
    correctAnswerIndex: 2,
    unit: 'Elektrik',
    topic: 'İletken ve Yalıtkan',
    difficulty: 'kolay',
    createdAt: '2024-09-03T10:15:00Z',
  },
  {
    id: 'q15',
    text: 'Seri bağlı devrede toplam direnç nasıl hesaplanır?',
    options: ['R_toplam = R1 × R2', '1/R_toplam = 1/R1 + 1/R2', 'R_toplam = R1 + R2', 'R_toplam = R1 - R2'],
    correctAnswerIndex: 2,
    unit: 'Elektrik',
    topic: 'Seri ve Paralel Devre',
    difficulty: 'zor',
    createdAt: '2024-09-03T10:20:00Z',
  },
  // Ünite 4: Işık ve Ses
  {
    id: 'q16',
    text: 'Işık hangi ortamda yayılmaz?',
    options: ['Hava', 'Su', 'Saydam olmayan cisim', 'Cam'],
    correctAnswerIndex: 2,
    unit: 'Işık ve Ses',
    topic: 'Işığın Yayılması',
    difficulty: 'kolay',
    createdAt: '2024-09-04T10:00:00Z',
  },
  {
    id: 'q17',
    text: 'Sesin yayılması için ne gereklidir?',
    options: ['Işık', 'Maddesel ortam', 'Boşluk', 'Elektrik'],
    correctAnswerIndex: 1,
    unit: 'Işık ve Ses',
    topic: 'Sesin Yayılması',
    difficulty: 'kolay',
    createdAt: '2024-09-04T10:05:00Z',
  },
  {
    id: 'q18',
    text: 'Gökkuşağı oluşumu hangi olayla açıklanır?',
    options: ['Yansıma', 'Kırılma ve ayrışma', 'Soğurma', 'Saçılma'],
    correctAnswerIndex: 1,
    unit: 'Işık ve Ses',
    topic: 'Işığın Kırılması',
    difficulty: 'orta',
    createdAt: '2024-09-04T10:10:00Z',
  },
  {
    id: 'q19',
    text: 'Ses hangi ortamda en hızlı yayılır?',
    options: ['Hava', 'Su', 'Katı', 'Boşluk'],
    correctAnswerIndex: 2,
    unit: 'Işık ve Ses',
    topic: 'Ses Hızı',
    difficulty: 'orta',
    createdAt: '2024-09-04T10:15:00Z',
  },
  {
    id: 'q20',
    text: 'Düz aynada oluşan görüntü hakkında hangisi doğrudur?',
    options: ['Ters ve büyük', 'Düz, aynı boyut, sanal', 'Ters ve küçük', 'Düz ve büyük'],
    correctAnswerIndex: 1,
    unit: 'Işık ve Ses',
    topic: 'Aynalar',
    difficulty: 'zor',
    createdAt: '2024-09-04T10:20:00Z',
  },
];

// ---- ÖĞRENCİLER ----
export const mockStudents: Student[] = [
  { id: 's1', name: 'Ahmet Yılmaz', class: '7-A', avatarColor: '#6366f1' },
  { id: 's2', name: 'Elif Demir', class: '7-A', avatarColor: '#ec4899' },
  { id: 's3', name: 'Mehmet Kaya', class: '7-A', avatarColor: '#f59e0b' },
  { id: 's4', name: 'Zeynep Çelik', class: '7-A', avatarColor: '#10b981' },
  { id: 's5', name: 'Can Öztürk', class: '7-A', avatarColor: '#3b82f6' },
  { id: 's6', name: 'Ayşe Şahin', class: '7-A', avatarColor: '#8b5cf6' },
  { id: 's7', name: 'Burak Arslan', class: '7-A', avatarColor: '#ef4444' },
  { id: 's8', name: 'Selin Yıldız', class: '7-A', avatarColor: '#14b8a6' },
];

// ---- QUIZLER ----
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'Madde ve Değişim - Genel Tekrar',
    description: 'Maddenin halleri, fiziksel ve kimyasal değişimler',
    questionIds: ['q1', 'q2', 'q3', 'q4', 'q5'],
    createdAt: '2024-09-10T08:00:00Z',
    status: 'closed',
    timePerQuestion: 30,
    code: 'MAD001',
  },
  {
    id: 'quiz2',
    title: 'Kuvvet ve Hareket Testi',
    description: 'Kuvvet, sürtünme, Newton yasaları',
    questionIds: ['q6', 'q7', 'q8', 'q9', 'q10'],
    createdAt: '2024-09-15T08:00:00Z',
    status: 'active',
    timePerQuestion: 30,
    code: 'KUV002',
  },
  {
    id: 'quiz3',
    title: 'Elektrik Konuları Quiz',
    description: 'Akım, gerilim, direnç ve devreler',
    questionIds: ['q11', 'q12', 'q13', 'q14', 'q15'],
    createdAt: '2024-09-20T08:00:00Z',
    status: 'draft',
    timePerQuestion: 45,
    code: 'ELK003',
  },
];

// ---- QUIZ SONUÇLARI ----
function generateMockResults(): QuizResult[] {
  const results: QuizResult[] = [];
  let resultId = 1;

  // Quiz 1 sonuçları (herkes katıldı)
  const quiz1Questions = mockQuizzes[0].questionIds;
  mockStudents.forEach((student) => {
    const answered: AnsweredQuestion[] = quiz1Questions.map((qId) => {
      const correct = Math.random() > 0.35;
      return {
        questionId: qId,
        selectedAnswerIndex: correct
          ? mockQuestions.find((q) => q.id === qId)!.correctAnswerIndex
          : (mockQuestions.find((q) => q.id === qId)!.correctAnswerIndex + 1) % 4,
        isCorrect: correct,
        timeSpent: Math.floor(Math.random() * 25) + 5,
      };
    });
    const score = answered.filter((a) => a.isCorrect).length;
    results.push({
      id: `r${resultId++}`,
      studentId: student.id,
      quizId: 'quiz1',
      score,
      totalQuestions: quiz1Questions.length,
      answeredQuestions: answered,
      completedAt: '2024-09-10T09:00:00Z',
    });
  });

  // Quiz 2 sonuçları (bazı öğrenciler katıldı)
  const quiz2Questions = mockQuizzes[1].questionIds;
  mockStudents.slice(0, 5).forEach((student) => {
    const answered: AnsweredQuestion[] = quiz2Questions.map((qId) => {
      const correct = Math.random() > 0.4;
      return {
        questionId: qId,
        selectedAnswerIndex: correct
          ? mockQuestions.find((q) => q.id === qId)!.correctAnswerIndex
          : (mockQuestions.find((q) => q.id === qId)!.correctAnswerIndex + 2) % 4,
        isCorrect: correct,
        timeSpent: Math.floor(Math.random() * 25) + 5,
      };
    });
    const score = answered.filter((a) => a.isCorrect).length;
    results.push({
      id: `r${resultId++}`,
      studentId: student.id,
      quizId: 'quiz2',
      score,
      totalQuestions: quiz2Questions.length,
      answeredQuestions: answered,
      completedAt: '2024-09-15T09:00:00Z',
    });
  });

  return results;
}

export const mockResults: QuizResult[] = generateMockResults();
