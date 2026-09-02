'use client';

import { useState, useMemo } from 'react';
import { questionRepository } from '@/lib/data/question-repository';
import { quizRepository } from '@/lib/data/quiz-repository';
import { Quiz } from '@/lib/types';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(quizRepository.getAll());
  const [showCreate, setShowCreate] = useState(false);
  const [showLobby, setShowLobby] = useState<string | null>(null);

  const refreshQuizzes = () => setQuizzes(quizRepository.getAll());

  const handleActivate = (id: string) => {
    quizRepository.activate(id);
    refreshQuizzes();
  };

  const handleClose = (id: string) => {
    quizRepository.close(id);
    refreshQuizzes();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu quizi silmek istediğinizden emin misiniz?')) {
      quizRepository.delete(id);
      refreshQuizzes();
    }
  };

  const statusConfig = {
    draft: { label: 'Taslak', color: 'bg-[#f59e0b]/10 text-[#d97706]', dot: 'bg-[#f59e0b]' },
    active: { label: 'Aktif', color: 'bg-[#10b981]/10 text-[#059669]', dot: 'bg-[#10b981]' },
    closed: { label: 'Tamamlandı', color: 'bg-[#94a3b8]/10 text-[#64748b]', dot: 'bg-[#94a3b8]' },
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Quiz Yönetimi</h1>
          <p className="text-[#64748b] mt-1">Quizler oluşturun, yönetin ve başlatın</p>
        </div>
        <button
          id="create-quiz-btn"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white rounded-xl font-medium text-sm shadow-lg shadow-[#4f46e5]/20 hover:shadow-xl hover:shadow-[#4f46e5]/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yeni Quiz Oluştur
        </button>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz, idx) => {
          const config = statusConfig[quiz.status];
          return (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Header stripe */}
              <div className={`h-1.5 ${
                quiz.status === 'active' ? 'bg-gradient-to-r from-[#10b981] to-[#34d399]' :
                quiz.status === 'draft' ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]' :
                'bg-gradient-to-r from-[#94a3b8] to-[#cbd5e1]'
              }`} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0f172a] mb-1">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-xs text-[#64748b] line-clamp-2">{quiz.description}</p>
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${config.color}`}>
                    {config.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#94a3b8] mb-4">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    {quiz.questionIds.length} soru
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.timePerQuestion}s / soru
                  </span>
                </div>

                {/* Quiz Code */}
                {quiz.code && (
                  <div className="bg-[#f8fafc] rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
                    <span className="text-xs text-[#64748b]">Katılım Kodu:</span>
                    <span className="font-mono font-bold text-sm text-[#4f46e5] tracking-wider">{quiz.code}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {quiz.status === 'draft' && (
                    <button
                      onClick={() => handleActivate(quiz.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#10b981] text-white hover:bg-[#059669] transition-colors cursor-pointer"
                    >
                      Başlat
                    </button>
                  )}
                  {quiz.status === 'active' && (
                    <>
                      <button
                        onClick={() => setShowLobby(quiz.id)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#4f46e5] text-white hover:bg-[#4338ca] transition-colors cursor-pointer"
                      >
                        Lobi
                      </button>
                      <button
                        onClick={() => handleClose(quiz.id)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#f59e0b] text-white hover:bg-[#d97706] transition-colors cursor-pointer"
                      >
                        Kapat
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="py-2 px-3 rounded-lg text-xs text-[#64748b] hover:bg-[#fef2f2] hover:text-[#ef4444] transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Quiz Modal */}
      {showCreate && (
        <CreateQuizModal
          onClose={() => setShowCreate(false)}
          onSave={() => { refreshQuizzes(); setShowCreate(false); }}
        />
      )}

      {/* Lobby Modal */}
      {showLobby && (
        <LobbyModal
          quiz={quizzes.find((q) => q.id === showLobby)!}
          onClose={() => setShowLobby(null)}
        />
      )}
    </div>
  );
}

function CreateQuizModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [filterUnit, setFilterUnit] = useState('');

  const allQuestions = questionRepository.getAll();
  const units = questionRepository.getUnits();

  const filteredQuestions = useMemo(() => {
    if (!filterUnit) return allQuestions;
    return allQuestions.filter((q) => q.unit === filterUnit);
  }, [filterUnit, allQuestions]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!title.trim()) { alert('Quiz başlığı gerekli.'); return; }
    if (selectedQuestions.length === 0) { alert('En az bir soru seçmelisiniz.'); return; }

    quizRepository.create({
      title: title.trim(),
      description: description.trim(),
      questionIds: selectedQuestions,
      status: 'draft',
      timePerQuestion,
    });
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#0f172a]">Yeni Quiz Oluştur</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Quiz Başlığı</label>
              <input
                id="quiz-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
                placeholder="Ör: Ünite 1 Tekrar Testi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Soru Başına Süre (sn)</label>
              <input
                type="number"
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                min={10}
                max={120}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Açıklama</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
              placeholder="Kısa açıklama..."
            />
          </div>

          {/* Question Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#374151]">
                Soruları Seçin <span className="text-[#4f46e5]">({selectedQuestions.length} seçili)</span>
              </label>
              <select
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                className="px-2 py-1 rounded-md border border-[#e2e8f0] text-xs text-[#0f172a] bg-white"
              >
                <option value="">Tüm Üniteler</option>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="border border-[#e2e8f0] rounded-xl max-h-64 overflow-y-auto">
              {filteredQuestions.map((q) => (
                <label
                  key={q.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-[#f1f5f9] last:border-b-0 cursor-pointer hover:bg-[#f8fafc] transition-colors ${
                    selectedQuestions.includes(q.id) ? 'bg-[#4f46e5]/[0.03]' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                    className="mt-0.5 w-4 h-4 rounded border-[#d1d5db] text-[#4f46e5] focus:ring-[#4f46e5]/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0f172a] line-clamp-1">{q.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#94a3b8]">{q.unit}</span>
                      <span className="text-xs text-[#94a3b8]">·</span>
                      <span className="text-xs text-[#94a3b8]">{q.difficulty}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer">
            İptal
          </button>
          <button
            id="save-quiz-btn"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:shadow-lg hover:shadow-[#4f46e5]/25 transition-all cursor-pointer"
          >
            Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

function LobbyModal({ quiz, onClose }: { quiz: Quiz; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-3xl shadow-2xl w-full max-w-md mx-4 p-10 text-center text-white animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <p className="text-white/70 text-sm mb-8">Öğrenciler aşağıdaki kodu girerek katılabilir</p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Katılım Kodu</p>
          <p className="text-5xl font-mono font-bold tracking-[0.3em] animate-pulse-glow">{quiz.code}</p>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-white/60 mb-8">
          <span>{quiz.questionIds.length} soru</span>
          <span>•</span>
          <span>{quiz.timePerQuestion}s / soru</span>
        </div>

        <button
          onClick={onClose}
          className="px-8 py-3 rounded-xl bg-white text-[#4f46e5] font-semibold hover:bg-white/90 transition-colors cursor-pointer"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
