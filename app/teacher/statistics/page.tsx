'use client';

import { useMemo } from 'react';
import { resultRepository } from '@/lib/data/result-repository';
import { studentRepository } from '@/lib/data/student-repository';
import { quizRepository } from '@/lib/data/quiz-repository';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

export default function StatisticsPage() {
  const topicPerformance = resultRepository.getClassTopicPerformance();
  const students = studentRepository.getAll();
  const results = resultRepository.getAll();
  const quizzes = quizRepository.getAll();

  // Bar chart data: topic-based success rate
  const barData = useMemo(() => {
    return topicPerformance
      .sort((a, b) => b.correctRate - a.correctRate)
      .map((tp) => ({
        name: tp.topic.length > 15 ? tp.topic.substring(0, 15) + '...' : tp.topic,
        fullName: tp.topic,
        başarı: tp.correctRate,
        unit: tp.unit,
      }));
  }, [topicPerformance]);

  // Weak topics
  const weakTopics = useMemo(() => {
    return topicPerformance
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, 5);
  }, [topicPerformance]);

  // Student performance table
  const studentPerformance = useMemo(() => {
    return students.map((student) => {
      const stats = resultRepository.getStudentStats(student.id);
      return {
        ...student,
        ...stats,
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [students]);

  // Time-based progress (line chart) - simulated quiz averages over time
  const lineData = useMemo(() => {
    return quizzes
      .filter((q) => q.status === 'closed' || q.status === 'active')
      .map((quiz) => {
        const quizResults = resultRepository.getByQuiz(quiz.id);
        const avg = quizResults.length > 0
          ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
          : 0;
        return {
          name: quiz.title.length > 20 ? quiz.title.substring(0, 20) + '...' : quiz.title,
          ortalama: avg,
        };
      });
  }, [quizzes]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">İstatistikler</h1>
        <p className="text-[#64748b] mt-1">Sınıfın performans analizleri</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart — Topic Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Konu Bazlı Başarı</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Ünite/konu bazında ortalama başarı yüzdesi</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                    const item = barData.find((d) => d.name === label);
                    return item ? `${item.fullName} (${item.unit})` : String(label);
                  }) as any}
                />
                <Bar
                  dataKey="başarı"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart — Progress Over Time */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Zaman İçindeki Gelişim</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Quiz bazında sınıf ortalaması</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
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
                  formatter={((value: any) => [`%${value}`, 'Ortalama']) as any}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ortalama"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Sınıfın En Zayıf Konuları</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Düşükten yükseğe sıralı</p>
          <div className="space-y-3">
            {weakTopics.map((tp, i) => (
              <div key={tp.topic} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  i === 0 ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                  i === 1 ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                  'bg-[#94a3b8]/10 text-[#94a3b8]'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[#0f172a] truncate">{tp.topic}</p>
                    <span className="text-sm font-semibold text-[#0f172a] shrink-0 ml-2">%{tp.correctRate}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${tp.correctRate}%`,
                        background: tp.correctRate < 40 ? '#ef4444' : tp.correctRate < 60 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#94a3b8] mt-0.5">{tp.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Performance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Öğrenci Performansları</h2>
          <p className="text-xs text-[#94a3b8] mb-4">İsim, katıldığı quiz sayısı, ortalama puan</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="text-left py-2 px-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">#</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Öğrenci</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Quiz</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Ort. Başarı</th>
                </tr>
              </thead>
              <tbody>
                {studentPerformance.map((sp, i) => (
                  <tr key={sp.id} className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-3 text-[#94a3b8] text-xs">{i + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: sp.avatarColor }}
                        >
                          {sp.name.charAt(0)}
                        </div>
                        <span className="text-[#0f172a] font-medium">{sp.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#64748b]">{sp.totalQuizzes}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        sp.avgScore >= 70
                          ? 'bg-[#10b981]/10 text-[#059669]'
                          : sp.avgScore >= 50
                            ? 'bg-[#f59e0b]/10 text-[#d97706]'
                            : 'bg-[#ef4444]/10 text-[#dc2626]'
                      }`}>
                        %{sp.avgScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
