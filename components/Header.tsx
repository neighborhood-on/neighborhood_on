'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
    const pathname = usePathname()
    const isHome = pathname === '/'
    const [isScrolled, setIsScrolled] = useState(false)
    const { data: session, status } = useSession()
    const [realTimePoint, setRealTimePoint] = useState<number | null>(null)

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

    useEffect(() => {
        const fetchUserPoint = async () => {
            if (status === 'authenticated') {
                try {
                    const response = await fetch('/api/users/me')
                    if (response.ok) {
                        const userData = await response.json()
                        setRealTimePoint(userData.point)
                    }
                } catch (error) {
                    console.error('포인트 조회 실패:', error)
                }
            }
        }

        fetchUserPoint()

        const interval = setInterval(fetchUserPoint, 10000)

        return () => clearInterval(interval)
    }, [status])

    // 홈이 아니면 항상 scroleld(흰배경, 검은글씨) 스타일 적용, 홈이면 스크롤 상태에 따라 변경
    const headerClass = !isHome || isScrolled ? 'scrolled' : 'transparent'
    const textColor = !isHome || isScrolled ? '#333' : '#fff'

    return (
        <header className={`header ${headerClass}`}>
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

                {/* Navigation removed as requested */}

                <div className="auth-buttons">
                    {session ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontWeight: 'bold', color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{session.user?.name}님</span>
                                <Link
                                    href="/exchange"
                                    style={{
                                        backgroundColor: '#eab308',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '0.9em',
                                        textDecoration: 'none',
                                        transition: 'transform 0.2s',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="포인트 교환소 바로가기"
                                >
                                    💰 {realTimePoint !== null ? realTimePoint.toLocaleString() : (session.user?.point ?? 0).toLocaleString()} P
                                </Link>
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
    )
}
