'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.')
        router.push('/login')
      } else {
        const errorData = await res.json()
        alert(`회원가입 실패: ${errorData.message}`)
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.')
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
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        ></div>
      </div>

      <div className="auth-card" style={{ maxWidth: '500px' }}>
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
          <h1>환영합니다! 🎉</h1>
          <p>동네 이웃들과 따뜻한 소통을 시작해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="이름 (닉네임)"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="거주 동네 (예: 강남구 역삼동)"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일 주소"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호 (6자리 이상)"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn-submit">
            동네 ON 시작하기
          </button>
        </form>

        <div className="social-login-section">
          <div className="divider">
            <span>또는 소셜 계정으로 시작하기</span>
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
          이미 계정이 있으신가요?
          <Link href="/login">로그인하기</Link>
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
