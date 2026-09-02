'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { resultRepository } from '@/lib/data/result-repository';
import { quizRepository } from '@/lib/data/quiz-repository';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function HistoryPage() {
  const { user } = useAuth();
  const studentId = user?.id || 's1';

  const results = useMemo(() => resultRepository.getByStudent(studentId), [studentId]);
  const topicPerformance = useMemo(() => resultRepository.getStudentTopicPerformance(studentId), [studentId]);

  const chartData = useMemo(() => {
    return topicPerformance.map((tp) => ({
      name: tp.topic.length > 12 ? tp.topic.substring(0, 12) + '...' : tp.topic,
      fullName: tp.topic,
      başarı: tp.correctRate,
    }));
  }, [topicPerformance]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Geçmiş Performans</h1>
        <p className="text-[#64748b] mt-1">Tüm quiz sonuçların ve konu bazlı başarın</p>
      </div>

      {/* Topic Performance Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Konu Bazlı Başarı</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Her konudaki doğru cevap oranın</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [`%${value}`, 'Başarı']) as any}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={((label: any) => {
                    const item = chartData.find((d) => d.name === label);
                    return item?.fullName || String(label);
                  }) as any}
                />
                <Bar dataKey="başarı" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quiz Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Quiz Sonuçları</h2>

        {results.length === 0 ? (
          <div className="text-center py-8 text-[#94a3b8]">
            <span className="text-4xl block mb-2">📝</span>
            <p>Henüz bir quize katılmadın.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result) => {
              const quiz = quizRepository.getById(result.quizId);
              const pct = Math.round((result.score / result.totalQuestions) * 100);
              const correct = result.answeredQuestions.filter((a) => a.isCorrect).length;
              const wrong = result.answeredQuestions.filter((a) => !a.isCorrect).length;

              return (
                <div
                  key={result.id}
                  className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#0f172a]">{quiz?.title || 'Quiz'}</h3>
                    <span className={`text-xl font-bold ${
                      pct >= 70 ? 'text-[#10b981]' : pct >= 50 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                    }`}>
                      %{pct}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                      {correct} doğru
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                      {wrong} yanlış
                    </span>
                    <span>
                      {new Date(result.completedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  {/* Mini answer grid */}
                  <div className="flex gap-1 mt-3">
                    {result.answeredQuestions.map((a, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium text-white ${
                          a.isCorrect ? 'bg-[#10b981]' : 'bg-[#ef4444]'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
