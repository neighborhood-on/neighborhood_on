'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchTerm.trim() === '') {
        alert('검색어를 입력해주세요!')
        return
      }
      alert(`"${searchTerm}"(으)로 검색합니다!`)
    }
  }

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
            <Link href="/login" className="btn btn-secondary">
              로그인
            </Link>
            <Link href="/signup" className="btn btn-primary">
              회원가입
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>이웃과 연결되는 새로운 일상</h1>
            <p>
              동네 소식, 중고 거래, 그리고 새로운 이웃과의 만남까지.
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

        <div className="container">
          <div className="main-content">
            <section id="about" className="section">
              <div className="section-content">
                <div className="about-section-container">
                  <div className="about-left">
                    <div className="about-text-block">
                      <h2>
                        동네ON만의 감성으로
                        <br />
                        사람을 잇는 공간을 만듭니다.
                      </h2>
                      <hr />
                      <p>
                        디자인은 단순히 아름답게만 만드는 작업이 아니라,
                        사용자의 편의성을 고려해 아름다움을 불어넣어야 합니다.
                        동네ON에게는 의미 있는 일이며, 소중한 가치입니다.
                      </p>
                    </div>
                    <Image
                      src="/about-1.jpg"
                      alt="동네 생활"
                      width={500}
                      height={300}
                      className="about-image"
                    />
                  </div>

                  <div className="about-right">
                    <Image
                      src="/about-2.jpg"
                      alt="커뮤니티"
                      width={600}
                      height={800}
                      className="about-image"
                    />
                    <div
                      className="about-text-block"
                      style={{ marginTop: '40px' }}
                    >
                      <h2>
                        당신을 위한
                        <br />
                        우리의 연결은 계속됩니다.
                      </h2>
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
