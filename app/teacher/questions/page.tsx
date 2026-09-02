'use client';

import { useState, useMemo } from 'react';
import { questionRepository } from '@/lib/data/question-repository';
import { Difficulty, Question } from '@/lib/types';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(questionRepository.getAll());
  const [filterUnit, setFilterUnit] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | ''>('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const units = questionRepository.getUnits();

  const filteredQuestions = useMemo(() => {
    return questionRepository.filter({
      unit: filterUnit || undefined,
      difficulty: (filterDifficulty as Difficulty) || undefined,
      search: search || undefined,
    });
  }, [filterUnit, filterDifficulty, search, questions]);

  const handleDelete = (id: string) => {
    if (confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      questionRepository.delete(id);
      setQuestions(questionRepository.getAll());
    }
  };

  const handleEdit = (q: Question) => {
    setEditingQuestion(q);
    setShowModal(true);
  };

  const refreshQuestions = () => {
    setQuestions(questionRepository.getAll());
  };

  const difficultyColor = (d: Difficulty) => {
    switch (d) {
      case 'kolay': return 'bg-[#10b981]/10 text-[#059669]';
      case 'orta': return 'bg-[#f59e0b]/10 text-[#d97706]';
      case 'zor': return 'bg-[#ef4444]/10 text-[#dc2626]';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Soru Bankası</h1>
          <p className="text-[#64748b] mt-1">{questions.length} soru mevcut</p>
        </div>
        <button
          id="add-question-btn"
          onClick={() => { setEditingQuestion(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white rounded-xl font-medium text-sm shadow-lg shadow-[#4f46e5]/20 hover:shadow-xl hover:shadow-[#4f46e5]/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Yeni Soru Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">Ara</label>
            <input
              id="search-questions"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Soru veya konu ara..."
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">Ünite</label>
            <select
              id="filter-unit"
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all bg-white"
            >
              <option value="">Tümü</option>
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748b] mb-1.5">Zorluk</label>
            <select
              id="filter-difficulty"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | '')}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all bg-white"
            >
              <option value="">Tümü</option>
              <option value="kolay">Kolay</option>
              <option value="orta">Orta</option>
              <option value="zor">Zor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-5 hover:shadow-md transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor(q.difficulty)}`}>
                    {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/10 text-[#4f46e5]">
                    {q.unit}
                  </span>
                  <span className="text-xs text-[#94a3b8]">{q.topic}</span>
                </div>
                <p className="text-sm font-medium text-[#0f172a] mb-3">{q.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-xs ${
                        i === q.correctAnswerIndex
                          ? 'bg-[#10b981]/10 text-[#059669] font-medium border border-[#10b981]/20'
                          : 'bg-[#f8fafc] text-[#64748b]'
                      }`}
                    >
                      <span className="font-medium mr-1.5">{String.fromCharCode(65 + i)})</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(q)}
                  className="p-2 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#4f46e5] transition-colors cursor-pointer"
                  title="Düzenle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded-lg hover:bg-[#fef2f2] text-[#64748b] hover:text-[#ef4444] transition-colors cursor-pointer"
                  title="Sil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-[#94a3b8]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-3 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p>Arama kriterlerinize uygun soru bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => { setShowModal(false); setEditingQuestion(null); }}
          onSave={() => { refreshQuestions(); setShowModal(false); setEditingQuestion(null); }}
        />
      )}
    </div>
  );
}

function QuestionModal({
  question,
  onClose,
  onSave,
}: {
  question: Question | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(question?.correctAnswerIndex ?? 0);
  const [unit, setUnit] = useState(question?.unit || '');
  const [topic, setTopic] = useState(question?.topic || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(question?.difficulty || 'orta');

  const handleSave = () => {
    if (!text.trim() || options.some((o) => !o.trim()) || !unit.trim() || !topic.trim()) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    if (question) {
      questionRepository.update(question.id, {
        text, options, correctAnswerIndex: correctIndex, unit, topic, difficulty,
      });
    } else {
      questionRepository.create({
        text, options, correctAnswerIndex: correctIndex, unit, topic, difficulty,
      });
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#0f172a]">
            {question ? 'Soru Düzenle' : 'Yeni Soru Ekle'}
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {/* Question text */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Soru Metni</label>
            <textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all resize-none"
              placeholder="Soru metnini girin..."
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Şıklar</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(i)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      i === correctIndex
                        ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/20'
                        : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                    }`}
                    title={i === correctIndex ? 'Doğru cevap' : 'Doğru cevap olarak işaretle'}
                  >
                    {String.fromCharCode(65 + i)}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
                    placeholder={`${String.fromCharCode(65 + i)} şıkkı...`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-[#94a3b8] mt-1.5">Doğru cevap olarak işaretlemek için harfe tıklayın</p>
          </div>

          {/* Unit & Topic */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Ünite</label>
              <input
                id="question-unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
                placeholder="Ör: Elektrik"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Konu</label>
              <input
                id="question-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/30 transition-all"
                placeholder="Ör: Ohm Yasası"
              />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Zorluk Seviyesi</label>
            <div className="grid grid-cols-3 gap-2">
              {(['kolay', 'orta', 'zor'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    difficulty === d
                      ? d === 'kolay'
                        ? 'bg-[#10b981] text-white shadow-md'
                        : d === 'orta'
                          ? 'bg-[#f59e0b] text-white shadow-md'
                          : 'bg-[#ef4444] text-white shadow-md'
                      : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            id="save-question-btn"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:shadow-lg hover:shadow-[#4f46e5]/25 transition-all cursor-pointer"
          >
            {question ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
