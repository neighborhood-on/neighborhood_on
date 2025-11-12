"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('모든 필드를 채워주세요.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-container">
      <div 
        className="auth-promo-section"
        style={{ backgroundImage: `url(/커뮤니티.jpg)` }}
      >
        <h1>함께하는 동네,<br />따뜻한 순간들.</h1>
        <p>동네ON에 오신 것을 환영합니다. 이웃과 함께하는 새로운 일상을 경험해보세요.</p>
      </div>
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <h2>회원가입</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
