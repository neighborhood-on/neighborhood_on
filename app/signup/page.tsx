'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`회원가입 시도: ${formData.name}`)
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

        <div className="auth-footer">
          이미 계정이 있으신가요?
          <Link href="/login">로그인하기</Link>
        </div>
      </div>
    </div>
  )
}
