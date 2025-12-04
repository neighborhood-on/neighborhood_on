'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`로그인 시도: ${email}`)
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

        <div className="auth-footer">
          아직 계정이 없으신가요?
          <Link href="/signup">회원가입 하러가기</Link>
        </div>
      </div>
    </div>
  )
}
