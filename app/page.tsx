'use client'

import Image from 'next/image'
import { FaInstagram, FaBlogger, FaRegNewspaper, FaExchangeAlt, FaUsers } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

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
          <div className="logo">동네 ON</div>
          <nav className="nav">
            <a href="#">홈</a>
            <a href="#about">소개</a>
          </nav>
          <div className="auth-buttons">
            <a href="/login" className="btn btn-secondary">로그인</a>
            <a href="/signup" className="btn btn-primary">회원가입</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>우리 동네의 모든 것을 한눈에</h1>
            <p>
              동네 소식, 중고 거래, 그리고 새로운 이웃과의 만남까지. 지금 바로
              시작해보세요!
            </p>
            <a href="/board" className="btn-ghost">
              게시판으로 바로가기
            </a>
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
                        사람을 잇는 새로운 공간을 만듭니다.
                      </h2>
                      <hr />
                      <p>
                        디자인은 단순히 아름답게만 만드는 작업이 아니라,
                        사용자의 편의성을 고려해 아름다움을 불어넣어야 합니다.
                        두 가지를 고려하며 만드는 과정은 어렵고 힘들지 몰라도
                        동네ON에게는 의미 있는 일이며, 소중한 가치입니다.
                      </p>
                    </div>
                    <Image
                      src="/동네 생활.jpg"
                      alt="동네 생활"
                      width={500}
                      height={300}
                      className="about-image"
                    />
                  </div>
                  <div className="about-right">
                    <span className="background-text">Community</span>
                    <Image
                      src="/커뮤니티.jpg"
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
          <div className="footer-main">
            <div className="footer-about">
              <h4>동네 ON</h4>
              <p>가장 가까운 이웃과 연결되는 곳</p>
            </div>
            <div className="footer-newsletter">
              <h4>새로운 소식을 받아보세요</h4>
              <form className="newsletter-form">
                <input type="email" placeholder="이메일 주소" />
                <button type="submit">구독</button>
              </form>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Blog"><FaBlogger /></a>
            </div>
          </div>
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
  );
}