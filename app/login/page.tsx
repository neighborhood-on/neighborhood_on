"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <div 
        className="auth-promo-section"
        style={{ backgroundImage: `url(/동네 생활.jpg)` }}
      >
        <h1>다시 오신 것을<br />환영합니다.</h1>
        <p>오늘 우리 동네에는 어떤 새로운 소식이 기다리고 있을까요?</p>
      </div>
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <h2>로그인</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary btn-submit"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
