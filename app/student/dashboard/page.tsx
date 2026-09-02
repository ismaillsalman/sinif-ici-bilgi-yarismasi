'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { quizRepository } from '@/lib/data/quiz-repository';
import { resultRepository } from '@/lib/data/result-repository';

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const studentId = user?.id || 's1';

  const activeQuizzes = quizRepository.getByStatus('active');
  const stats = useMemo(() => resultRepository.getStudentStats(studentId), [studentId]);
  const recentResults = useMemo(() => {
    return resultRepository.getByStudent(studentId).slice(-3).reverse();
  }, [studentId]);

  // Badges
  const badges = useMemo(() => {
    const b = [];
    if (stats.totalQuizzes >= 1) b.push({ emoji: '🎯', label: 'İlk Quiz', desc: 'İlk quizi tamamladın!' });
    if (stats.totalQuizzes >= 3) b.push({ emoji: '🔥', label: 'Ateş Topu', desc: '3 quiz tamamladın!' });
    if (stats.avgScore >= 80) b.push({ emoji: '⭐', label: 'Yıldız', desc: '%80+ ortalama!' });
    if (stats.avgScore >= 90) b.push({ emoji: '🏆', label: 'Şampiyon', desc: '%90+ ortalama!' });
    if (stats.totalQuizzes === 0) b.push({ emoji: '🌱', label: 'Yeni Başlayan', desc: 'İlk quizine katıl!' });
    return b;
  }, [stats]);

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl p-6 mb-8 text-white shadow-lg shadow-[#10b981]/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Merhaba, {user?.name || 'Öğrenci'}! 👋</h1>
            <p className="text-white/80 text-sm">Bugün ne öğrenmek istiyorsun?</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-3xl font-bold">{stats.avgScore}</span>
            <div className="text-xs text-white/80">
              <p>Ortalama</p>
              <p>Başarı %</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <MiniStat label="Toplam Quiz" value={stats.totalQuizzes} icon="📋" />
        <MiniStat label="Toplam Puan" value={stats.totalScore} icon="💎" />
        <MiniStat label="Toplam Soru" value={stats.totalQuestions} icon="❓" />
        <MiniStat label="Ort. Başarı" value={`%${stats.avgScore}`} icon="📊" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Quizzes */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Aktif Quizler</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Katılabileceğin açık quizler</p>

          {activeQuizzes.length === 0 ? (
            <div className="text-center py-8 text-[#94a3b8]">
              <span className="text-4xl block mb-2">😴</span>
              <p className="text-sm">Şu anda aktif quiz yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeQuizzes.map((quiz) => {
                const alreadyDone = resultRepository.getByStudent(studentId).some((r) => r.quizId === quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#0f172a]">{quiz.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#94a3b8]">
                        <span>{quiz.questionIds.length} soru</span>
                        <span>·</span>
                        <span>{quiz.timePerQuestion}s / soru</span>
                        {quiz.code && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-[#4f46e5]">{quiz.code}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {alreadyDone ? (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#10b981]/10 text-[#059669]">
                        ✓ Tamamlandı
                      </span>
                    ) : (
                      <button
                        onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-[#10b981] text-white hover:bg-[#059669] transition-colors shadow-md shadow-[#10b981]/20 cursor-pointer"
                      >
                        Katıl
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Rozetlerin</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Başarıların ve ödüllerin</p>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]"
              >
                <span className="text-2xl">{badge.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">{badge.label}</p>
                  <p className="text-xs text-[#94a3b8]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Son Sonuçlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentResults.map((result) => {
              const quiz = quizRepository.getById(result.quizId);
              const pct = Math.round((result.score / result.totalQuestions) * 100);
              return (
                <div key={result.id} className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <p className="text-sm font-medium text-[#0f172a] mb-2">{quiz?.title || 'Quiz'}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#0f172a]">{result.score}/{result.totalQuestions}</p>
                      <p className="text-xs text-[#94a3b8]">doğru cevap</p>
                    </div>
                    <span className={`text-lg font-bold ${
                      pct >= 70 ? 'text-[#10b981]' : pct >= 50 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                    }`}>
                      %{pct}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4 text-center">
      <span className="text-xl block mb-1">{icon}</span>
      <p className="text-lg font-bold text-[#0f172a]">{value}</p>
      <p className="text-xs text-[#94a3b8]">{label}</p>
    </div>
  );
}
