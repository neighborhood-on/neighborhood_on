'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      alert(result.error)
    } else {
      router.push('/')
      // Optional: Force reload to update header session state immediately if needed, 
      // but router.push should be enough with SessionProvider
      router.refresh()
    }
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <div className="auth-container">
      <div className="background-layer">
        <Image
          src="/map-bg.jpg"
          alt="배경 지도"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div
          className="overlay"
          style={{ background: 'rgba(0, 0, 0, 0.4)' }}
        ></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="동네 ON"
              width={100}
              height={35}
              style={{
                margin: '0 auto 20px',
                display: 'block',
                width: 'auto',
                height: 'auto',
              }}
            />
          </Link>
          <h1>다시 만나서 반가워요! 👋</h1>
          <p>우리 동네 이웃들이 기다리고 있어요.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            로그인하기
          </button>
        </form>

        <div className="social-login-section">
          <div className="divider">
            <span>또는 소셜 계정으로 로그인</span>
          </div>
          <div className="social-buttons">
            <button
              className="btn-social btn-google"
              onClick={() => handleSocialLogin('google')}
            >
              <span className="social-icon">G</span>
              구글로 시작하기
            </button>
            <button
              className="btn-social btn-kakao"
              onClick={() => handleSocialLogin('kakao')}
            >
              <span className="social-icon">K</span>
              카카오로 시작하기
            </button>
          </div>
        </div>

        <div className="auth-footer">
          아직 계정이 없으신가요?
          <Link href="/signup">회원가입 하러가기</Link>
        </div>
      </div>
      <style jsx>{`
        .social-login-section {
          margin-top: 30px;
        }
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #888;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #ddd;
        }
        .divider span {
          padding: 0 10px;
        }
        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-social {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.2s;
        }
        .btn-social:hover {
          transform: translateY(-2px);
        }
        .btn-google {
          background-color: #fff;
          color: #333;
          border: 1px solid #ddd;
        }
        .btn-kakao {
          background-color: #fee500;
          color: #3c1e1e;
        }
      `}</style>
    </div>
  )
}
