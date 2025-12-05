'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="container-fluid">
      <header className={`header ${isScrolled ? 'scrolled' : 'transparent'}`}>
        <div className="header-content">
          <div className="logo">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="동네 ON"
                width={120}
                height={40}
                style={{ height: 'auto' }}
              />
            </Link>
          </div>

          <div className="auth-buttons">
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold', color: isScrolled ? '#333' : '#fff' }}>
                  {session.user?.name}님 환영합니다!
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary"
                  style={{ cursor: 'pointer' }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  로그인
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>이웃과 연결되는 새로운 일상</h1>
            <p>
              동네 소식, 진짜 이웃과의 소통, 그리고<br />
              우리 동네의 가치를 높이는 활동까지.
              <br />
              지금 바로 <strong>동네 ON</strong>에서 시작해보세요!
            </p>

            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px',
              }}
            >
              <Link
                href="/map"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '600px',
                  height: '60px',
                  backgroundColor: 'white',
                  color: '#333',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                }}
              >
                지역 이동하기
              </Link>
            </div>
          </div>
        </section>

        <div className="radical-section">
          <div className="radical-container">
            <div className="bento-grid">
              <div className="bento-item bento-span-2">
                <div className="bento-content">
                  <div className="bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '60px', height: '60px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.875 1.875 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0z" />
                    </svg>
                  </div>
                  <div className="bento-title">지도 기반 동네 선택</div>
                  <div className="bento-desc">
                    내 위치를 기반으로 동네를 선택하고, <br />
                    실제 이웃들과 진솔한 이야기를 나눠보세요.
                  </div>
                </div>
              </div>

              <div className="bento-item">
                <div className="bento-content">
                  <div className="bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '60px', height: '60px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <div className="bento-title">동네별/전체 게시판</div>
                  <div className="bento-desc">
                    카테고리별로 자유롭게 소통하고<br />
                    전체 게시판에서 더 넓은 이야기를.
                  </div>
                </div>
              </div>

              <div className="bento-item">
                <div className="bento-content">
                  <div className="bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '60px', height: '60px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div className="bento-title">포인트 적립 & 교환</div>
                  <div className="bento-desc">
                    질문과 답변 활동으로 포인트를 모아<br />
                    쿠폰으로 교환하세요!
                  </div>
                </div>
              </div>

              {/* Feature 4: Neighborhood Battle (Large) */}
              <div className="bento-item bento-span-2">
                <div className="bento-content">
                  <div className="bento-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '60px', height: '60px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a1.125 1.125 0 00-1.125-1.125h-2.25a1.125 1.125 0 00-1.125 1.125V14.25m5.007 0h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  <div className="bento-title">이달의 우수 동네</div>
                  <div className="bento-desc">
                    매달 펼쳐지는 동네별 포인트 대결!<br />
                    우승한 동네 주민들에게는 특별한 화폐와 쿠폰이 지급됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="radical-section" style={{ backgroundColor: '#ffffff' }}>
          <div className="radical-container">

            <div className="team-radical-grid">
              {/* Team Member 1: Leader */}
              <div className="team-radical-card">
                <div className="team-radical-bg"></div>
                <div className="team-radical-content">
                  <div className="team-avatar-radical">정</div>
                  <div className="team-name-radical">정재성</div>
                  <div className="team-role-radical">Team Leader</div>
                </div>
                <div className="team-socials">
                  <a href="#" className="social-btn" title="GitHub">
                    <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                  <a href="#" className="social-btn" title="Portfolio">
                    <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                  </a>
                </div>
              </div>

              {/* Team Member 2: Backend */}
              <div className="team-radical-card">
                <div className="team-radical-bg" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}></div>
                <div className="team-radical-content">
                  <div className="team-avatar-radical" style={{ color: '#10b981' }}>심</div>
                  <div className="team-name-radical">심재훈</div>
                  <div className="team-role-radical">Backend</div>
                </div>
                <div className="team-socials">
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg></a>
                </div>
              </div>

              {/* Team Member 3: Kwak */}
              <div className="team-radical-card">
                <div className="team-radical-bg" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}></div>
                <div className="team-radical-content">
                  <div className="team-avatar-radical" style={{ color: '#f59e0b' }}>곽</div>
                  <div className="team-name-radical">곽민경</div>
                  <div className="team-role-radical">Team Member</div>
                </div>
                <div className="team-socials">
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg></a>
                </div>
              </div>

              {/* Team Member 4: Park */}
              <div className="team-radical-card">
                <div className="team-radical-bg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}></div>
                <div className="team-radical-content">
                  <div className="team-avatar-radical" style={{ color: '#8b5cf6' }}>박</div>
                  <div className="team-name-radical">박혜수</div>
                  <div className="team-role-radical">Team Member</div>
                </div>
                <div className="team-socials">
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg></a>
                </div>
              </div>

              {/* Team Member 5: Jung */}
              <div className="team-radical-card">
                <div className="team-radical-bg" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}></div>
                <div className="team-radical-content">
                  <div className="team-avatar-radical" style={{ color: '#06b6d4' }}>정</div>
                  <div className="team-name-radical">정윤서</div>
                  <div className="team-role-radical">Team Member</div>
                </div>
                <div className="team-socials">
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
                  <a href="#" className="social-btn"><svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg></a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="section-content">
          <div className="footer-legal">
            <p>&copy; 2025 동네 ON. All rights reserved.</p>
            <div>
              <a href="#">서비스 이용약관</a>
              <a href="#">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
