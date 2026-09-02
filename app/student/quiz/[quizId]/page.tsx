'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { quizRepository } from '@/lib/data/quiz-repository';
import { questionRepository } from '@/lib/data/question-repository';
import { resultRepository } from '@/lib/data/result-repository';
import { Question, AnsweredQuestion } from '@/lib/types';

type QuizPhase = 'waiting' | 'question' | 'feedback' | 'result';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const quizId = params.quizId as string;

  const quiz = quizRepository.getById(quizId);
  const questions = useMemo(() => {
    if (!quiz) return [];
    return quiz.questionIds
      .map((id) => questionRepository.getById(id))
      .filter(Boolean) as Question[];
  }, [quiz]);

  const [phase, setPhase] = useState<QuizPhase>('waiting');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [showCorrect, setShowCorrect] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Timer
  useEffect(() => {
    if (phase !== 'question' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const startQuiz = () => {
    setPhase('question');
    setTimeLeft(quiz?.timePerQuestion || 30);
    setCurrentIndex(0);
    setAnswers([]);
  };

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return;
    const answer: AnsweredQuestion = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: -1,
      isCorrect: false,
      timeSpent: quiz?.timePerQuestion || 30,
    };
    setAnswers((prev) => [...prev, answer]);
    setSelectedAnswer(-1);
    setShowCorrect(true);
    setPhase('feedback');
  }, [currentQuestion, quiz]);

  const handleAnswer = (index: number) => {
    if (phase !== 'question' || selectedAnswer !== null) return;
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    const timeSpent = (quiz?.timePerQuestion || 30) - timeLeft;

    const answer: AnsweredQuestion = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: index,
      isCorrect,
      timeSpent,
    };

    setSelectedAnswer(index);
    setShowCorrect(true);
    setAnswers((prev) => [...prev, answer]);
    setPhase('feedback');
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz complete
      const finalAnswers = answers;
      const score = finalAnswers.filter((a) => a.isCorrect).length;
      resultRepository.create({
        studentId: user?.id || 's1',
        quizId,
        score,
        totalQuestions: questions.length,
        answeredQuestions: finalAnswers,
        completedAt: new Date().toISOString(),
      });
      setPhase('result');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowCorrect(false);
      setTimeLeft(quiz?.timePerQuestion || 30);
      setPhase('question');
    }
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <span className="text-5xl block mb-4">🔍</span>
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">Quiz Bulunamadı</h2>
          <p className="text-[#64748b] mb-4">Bu quiz mevcut değil veya kaldırılmış olabilir.</p>
          <button onClick={() => router.push('/student/dashboard')} className="px-4 py-2 bg-[#10b981] text-white rounded-lg cursor-pointer">
            Panele Dön
          </button>
        </div>
      </div>
    );
  }

  // WAITING PHASE
  if (phase === 'waiting') {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-2xl shadow-[#10b981]/30 animate-pulse-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] mb-2">{quiz.title}</h1>
          <p className="text-[#64748b] mb-6">{quiz.description}</p>
          <div className="flex justify-center gap-6 mb-8 text-sm text-[#64748b]">
            <div className="text-center">
              <p className="text-xl font-bold text-[#0f172a]">{questions.length}</p>
              <p>Soru</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#0f172a]">{quiz.timePerQuestion}s</p>
              <p>Süre / Soru</p>
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="px-8 py-3.5 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold rounded-xl shadow-lg shadow-[#10b981]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer text-lg"
          >
            Quize Başla!
          </button>
        </div>
      </div>
    );
  }

  // RESULT PHASE
  if (phase === 'result') {
    const score = answers.filter((a) => a.isCorrect).length;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg w-full animate-scale-in">
          <div className="mb-6">
            {pct >= 80 ? (
              <span className="text-6xl">🎉</span>
            ) : pct >= 50 ? (
              <span className="text-6xl">👍</span>
            ) : (
              <span className="text-6xl">💪</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Quiz Tamamlandı!</h1>
          <p className="text-[#64748b] mb-8">{quiz.title}</p>

          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-8 mb-6">
            <div className="text-5xl font-bold mb-2" style={{
              color: pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
            }}>
              %{pct}
            </div>
            <p className="text-[#64748b] mb-6">{score} / {questions.length} doğru cevap</p>

            {/* Answer Summary */}
            <div className="grid grid-cols-5 gap-2 justify-center max-w-xs mx-auto">
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                    a.isCorrect ? 'bg-[#10b981]' : 'bg-[#ef4444]'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push('/student/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold rounded-xl shadow-lg shadow-[#10b981]/25 hover:shadow-xl transition-all cursor-pointer"
          >
            Panele Dön
          </button>
        </div>
      </div>
    );
  }

  // QUESTION / FEEDBACK PHASE
  const timerPct = (timeLeft / (quiz.timePerQuestion || 30)) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-[#64748b]">
          Soru {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            timeLeft <= 5
              ? 'border-[#ef4444] text-[#ef4444] animate-timer-pulse'
              : timeLeft <= 10
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-[#10b981] text-[#10b981]'
          }`}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${timerPct}%`,
            background: timerPct <= 20 ? '#ef4444' : timerPct <= 40 ? '#f59e0b' : '#10b981',
          }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 mb-6">
        <p className="text-lg font-semibold text-[#0f172a] leading-relaxed">{currentQuestion?.text}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {currentQuestion?.options.map((option, i) => {
          const optionColors = [
            'from-[#ef4444] to-[#dc2626]',
            'from-[#3b82f6] to-[#2563eb]',
            'from-[#f59e0b] to-[#d97706]',
            'from-[#10b981] to-[#059669]',
          ];
          const isSelected = selectedAnswer === i;
          const isCorrect = i === currentQuestion.correctAnswerIndex;

          let stateClass = '';
          if (showCorrect) {
            if (isCorrect) {
              stateClass = 'ring-4 ring-[#10b981] ring-offset-2 animate-correct';
            } else if (isSelected && !isCorrect) {
              stateClass = 'opacity-60 animate-wrong';
            } else {
              stateClass = 'opacity-40';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={phase !== 'question'}
              className={`relative p-5 rounded-xl text-white font-medium text-left bg-gradient-to-r ${optionColors[i]} shadow-md
                hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:cursor-default
                ${stateClass}`}
            >
              <span className="text-xs font-bold opacity-70 mr-2">{String.fromCharCode(65 + i)}</span>
              {option}
              {showCorrect && isCorrect && (
                <span className="absolute top-2 right-3 text-lg">✓</span>
              )}
              {showCorrect && isSelected && !isCorrect && (
                <span className="absolute top-2 right-3 text-lg">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next */}
      {phase === 'feedback' && (
        <div className="text-center animate-fade-in">
          {selectedAnswer !== null && selectedAnswer >= 0 && selectedAnswer === currentQuestion?.correctAnswerIndex ? (
            <p className="text-[#10b981] font-semibold mb-4 text-lg">🎉 Doğru Cevap!</p>
          ) : (
            <p className="text-[#ef4444] font-semibold mb-4 text-lg">
              {selectedAnswer === -1 ? '⏰ Süre Doldu!' : '❌ Yanlış Cevap!'}
            </p>
          )}
          <button
            onClick={nextQuestion}
            className="px-6 py-3 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            {currentIndex + 1 >= questions.length ? 'Sonuçları Gör' : 'Sonraki Soru →'}
          </button>
        </div>
      )}
    </div>
  );
}
