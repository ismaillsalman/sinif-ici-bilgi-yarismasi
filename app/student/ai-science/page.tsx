'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';

export default function AiSciencePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError('AI öğretmen şu anda çok yoğun. Lütfen 10-15 saniye bekleyip tekrar sorunuzu gönderin.');
        } else if (response.status === 503) {
          setError(data.error || 'AI asistan şu anda yapılandırılmadı.');
        } else {
          setError(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
        setIsLoading(false);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f172a]">Fen Bilimleri AI Öğretmeni</h1>
            <p className="text-xs text-[#94a3b8]">Fen bilimleri hakkında her şeyi sorabilirsin!</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !error && (
            <div className="text-center py-12 text-[#94a3b8]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#0f172a] mb-2">Merhaba! Ben AI Fen Öğretmeniniz 🔬</h3>
              <p className="text-sm max-w-md mx-auto">
                Fen bilimleri hakkında aklına takılan soruları bana sorabilirsin.
                Fizik, kimya, biyoloji... Her konuda yardımcı olurum!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Atomun yapısı nedir?', 'Fotosentez nasıl olur?', 'Yerçekimi neden var?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="px-3 py-1.5 rounded-full bg-[#f1f5f9] text-xs text-[#64748b] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl rounded-br-md'
                  : 'bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0] rounded-2xl rounded-bl-md'
              } px-4 py-3`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs">🤖</span>
                    <span className="text-xs font-medium text-[#8b5cf6]">AI Öğretmen</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs">🤖</span>
                  <span className="text-xs font-medium text-[#8b5cf6]">AI Öğretmen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#94a3b8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center animate-fade-in">
              <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-sm text-[#dc2626] max-w-md text-center">
                <p className="font-medium mb-1">⚠️ AI Asistan Kullanılamıyor</p>
                <p className="text-xs text-[#ef4444]">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#e2e8f0] bg-white">
          <div className="flex gap-2">
            <input
              id="ai-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Fen bilimleri sorun sor..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
              disabled={isLoading}
            />
            <button
              id="ai-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
