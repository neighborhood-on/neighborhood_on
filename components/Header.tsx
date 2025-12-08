'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
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

    return (
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
                                {session.user?.name}님 ({realTimePoint !== null ? realTimePoint : (session.user?.point ?? 0)} P) 환영합니다!
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
