'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!name.trim()) {
      setError('Lütfen adınızı girin.');
      return;
    }

    if (!password.trim()) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    if (mode === 'register') {
      if (!selectedRole) {
        setError('Kayıt olmak için lütfen bir rol seçin.');
        return;
      }

      let id = undefined;
      if (selectedRole === 'student' && studentId.trim()) {
        id = studentId.trim();
      }

      const result = register(selectedRole, name, password, id);
      
      if (!result.success) {
        setError(result.error || 'Kayıt başarısız oldu.');
        return;
      }
      
      router.push(selectedRole === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } else {
      // Login mode
      const result = login(name, password);
      
      if (!result.success) {
        setError(result.error || 'Giriş başarısız oldu.');
        return;
      }
      
      // We need the user role from context to navigate appropriately, but `useAuth` user is updated asynchronously.
      // So let's grab it from local storage directly for an immediate read, or rely on a slight timeout.
      // Actually, since login just succeeded, we can read the session from localStorage right away.
      try {
        const session = JSON.parse(localStorage.getItem('quiz-app-session') || '{}');
        if (session && session.role) {
           router.push(session.role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
        } else {
           setError('Bağlantı sorunu oluştu, lütfen sayfayı yenileyip tekrar deneyin.');
        }
      } catch {
         setError('Oturum okunamadı.');
      }
    }
  };

  const toggleMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    // Keep name and password populated for convenience, but reset role if switching to register
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#4f46e5]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#0ea5e9]/10 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-[#8b5cf6]/8 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] shadow-lg shadow-[#4f46e5]/25 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bilgi Yarışması</h1>
          <p className="text-[#94a3b8] text-sm">Sınıf içi interaktif quiz platformu</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          
          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-white/[0.05] p-1 mb-8">
            <button
              onClick={() => toggleMode('login')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'login' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => toggleMode('register')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                mode === 'register' ? 'bg-[#4f46e5] text-white shadow-md' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Role Selection (Only for Registration) */}
          {mode === 'register' && (
            <div className="mb-6 animate-fade-in">
              <label className="block text-sm font-medium text-[#94a3b8] mb-3">Rolünüz Nedir?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="role-teacher"
                  onClick={() => { setSelectedRole('teacher'); setError(''); }}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    ${selectedRole === 'teacher'
                      ? 'border-[#4f46e5] bg-[#4f46e5]/10 shadow-lg shadow-[#4f46e5]/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
                    ${selectedRole === 'teacher' ? 'bg-[#4f46e5]' : 'bg-white/10'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-white">Öğretmen</span>
                </button>

                <button
                  id="role-student"
                  onClick={() => { setSelectedRole('student'); setError(''); }}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    ${selectedRole === 'student'
                      ? 'border-[#10b981] bg-[#10b981]/10 shadow-lg shadow-[#10b981]/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
                    ${selectedRole === 'student' ? 'bg-[#10b981]' : 'bg-white/10'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-white">Öğrenci</span>
                </button>
              </div>
            </div>
          )}

          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-[#94a3b8] mb-2">
              Ad Soyad
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Adınızı girin..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/50 transition-all duration-200"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[#94a3b8] mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Şifrenizi girin..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]/50 transition-all duration-200"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Student ID (only for students in registration mode) */}
          {mode === 'register' && selectedRole === 'student' && (
            <div className="mb-4 animate-fade-in">
              <label htmlFor="studentId" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Öğrenci Numarası <span className="text-[#64748b]">(opsiyonel)</span>
              </label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Ör: s1, s2..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/50 transition-all duration-200"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <p className="text-xs text-[#64748b] mt-1.5">Mock öğrenci kullanmak için s1-s8 arası bir ID girin</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#fca5a5] text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="submit-button"
            onClick={handleSubmit}
            className={`w-full py-3.5 mt-2 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:shadow-lg hover:shadow-[#4f46e5]/25 hover:translate-y-[-1px] active:translate-y-[0px] disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={!name.trim() || !password.trim() || (mode === 'register' && !selectedRole)}
          >
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[#475569] text-xs mt-6">
          Sınıf İçi Bilgi Yarışması Sistemi — v1.1 (Şifreli Auth)
        </p>
      </div>
    </div>
  );
}
