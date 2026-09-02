'use client';

import { useMemo } from 'react';
import { questionRepository } from '@/lib/data/question-repository';
import { quizRepository } from '@/lib/data/quiz-repository';
import { resultRepository } from '@/lib/data/result-repository';
import { studentRepository } from '@/lib/data/student-repository';

export default function TeacherDashboard() {
  const questions = questionRepository.getAll();
  const quizzes = quizRepository.getAll();
  const students = studentRepository.getAll();
  const results = resultRepository.getAll();

  const stats = useMemo(() => {
    const activeQuizzes = quizzes.filter((q) => q.status === 'active').length;
    const avgScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length)
      : 0;
    return {
      totalQuestions: questions.length,
      totalQuizzes: quizzes.length,
      activeQuizzes,
      totalStudents: students.length,
      avgScore,
    };
  }, [questions, quizzes, students, results]);

  const recentQuizzes = quizzes.slice().sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const topicPerformance = resultRepository.getClassTopicPerformance();
  const weakTopics = topicPerformance
    .sort((a, b) => a.correctRate - b.correctRate)
    .slice(0, 3);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Öğretmen Paneli</h1>
        <p className="text-[#64748b] mt-1">Sınıfınızın genel durumuna göz atın</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Toplam Soru"
          value={stats.totalQuestions}
          icon="📝"
          color="from-[#4f46e5] to-[#6366f1]"
          shadowColor="shadow-[#4f46e5]/15"
        />
        <StatCard
          title="Toplam Quiz"
          value={stats.totalQuizzes}
          icon="🎯"
          color="from-[#0ea5e9] to-[#38bdf8]"
          shadowColor="shadow-[#0ea5e9]/15"
          subtitle={`${stats.activeQuizzes} aktif`}
        />
        <StatCard
          title="Öğrenci Sayısı"
          value={stats.totalStudents}
          icon="👥"
          color="from-[#10b981] to-[#34d399]"
          shadowColor="shadow-[#10b981]/15"
        />
        <StatCard
          title="Ortalama Başarı"
          value={`%${stats.avgScore}`}
          icon="📊"
          color="from-[#f59e0b] to-[#fbbf24]"
          shadowColor="shadow-[#f59e0b]/15"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quizzes */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Son Quizler</h2>
          <div className="space-y-3">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    quiz.status === 'active' ? 'bg-[#10b981]' :
                    quiz.status === 'draft' ? 'bg-[#f59e0b]' : 'bg-[#94a3b8]'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">{quiz.title}</p>
                    <p className="text-xs text-[#64748b]">{quiz.questionIds.length} soru</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  quiz.status === 'active'
                    ? 'bg-[#10b981]/10 text-[#059669]'
                    : quiz.status === 'draft'
                      ? 'bg-[#f59e0b]/10 text-[#d97706]'
                      : 'bg-[#94a3b8]/10 text-[#64748b]'
                }`}>
                  {quiz.status === 'active' ? 'Aktif' : quiz.status === 'draft' ? 'Taslak' : 'Tamamlandı'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Zayıf Konular</h2>
          <p className="text-xs text-[#64748b] mb-4">Sınıfın en çok zorlandığı konular</p>
          <div className="space-y-4">
            {weakTopics.map((topic, i) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#ef4444]">#{i + 1}</span>
                    <span className="text-sm text-[#0f172a]">{topic.topic}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0f172a]">%{topic.correctRate}</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${topic.correctRate}%`,
                      background: topic.correctRate < 40
                        ? '#ef4444'
                        : topic.correctRate < 60
                          ? '#f59e0b'
                          : '#10b981',
                    }}
                  />
                </div>
                <p className="text-xs text-[#94a3b8] mt-1">{topic.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  shadowColor,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  shadowColor: string;
  subtitle?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-5 hover:shadow-md ${shadowColor} transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#64748b] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
          {subtitle && <p className="text-xs text-[#10b981] mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-lg shadow-lg ${shadowColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
