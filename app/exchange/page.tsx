"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'; // 공통 헤더 import

// Icons
const Coins = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" /></svg>;
const ArrowRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
const CheckCircle = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const RefreshCw = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>;
const Home = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const Wallet = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>;

const ExchangePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [currentPoint, setCurrentPoint] = useState<number | null>(null);
    const [exchangeAmount, setExchangeAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTestMode, setIsTestMode] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchPoints();
        } else if (status === 'unauthenticated' && !isTestMode) {
            // 비로그인 상태 대기
        } else if (isTestMode && currentPoint === null) {
            setCurrentPoint(50000);
        }
    }, [status, isTestMode, currentPoint]);

    const fetchPoints = async () => {
        try {
            const res = await fetch('/api/users/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentPoint(data.point);
            }
        } catch (e) {
            console.error('포인트 조회 실패', e);
        }
    };

    const handleExchange = async () => {
        const amount = Number(exchangeAmount.replaceAll(',', ''));

        if (!amount || amount < 100) {
            alert('최소 전환 가능 포인트는 100 P 입니다.');
            return;
        }
        if (currentPoint !== null && amount > currentPoint) {
            alert('보유 포인트보다 많은 금액은 전환할 수 없습니다.');
            return;
        }

        if (!confirm(`${amount.toLocaleString()} P를 고양페이로 전환하시겠습니까?`)) {
            return;
        }

        setIsLoading(true);

        if (isTestMode) {
            setTimeout(() => {
                setCurrentPoint(prev => (prev || 0) - amount);
                setExchangeAmount('');
                setIsSuccess(true);
                setIsLoading(false);
            }, 800);
            return;
        }

        try {
            const res = await fetch('/api/exchange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || '전환 실패');
            }

            const data = await res.json();
            setCurrentPoint(data.remainingPoint);
            setExchangeAmount('');
            setIsSuccess(true);
            sessionStorage.setItem('needRefreshPoint', 'true');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMaxInput = () => {
        if (currentPoint !== null) {
            setExchangeAmount(currentPoint.toString());
        }
    };

    const formattedExchangeAmount = exchangeAmount ? Number(exchangeAmount.replaceAll(',', '')).toLocaleString() : '';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setExchangeAmount(val);
    };

    // 로딩 화면
    if (status === 'loading' || (status === 'authenticated' && currentPoint === null) || (isTestMode && currentPoint === null)) {
        return <div className="loading-container"><RefreshCw className="icon-spin" /> 데이터 불러오는 중...</div>;
    }

    // 비로그인 (테스트 모드 진입) 화면
    if (status === 'unauthenticated' && !isTestMode) {
        return (
            <div className="exchange-wrapper">
                <main className="unauth-container glass-panel">
                    <div className="unauth-content">
                        <div className="icon-circle-large">
                            <Wallet />
                        </div>
                        <h1 className="unauth-title">포인트 교환소</h1>
                        <p className="unauth-desc">
                            적립한 활동 포인트를 <strong>고양페이</strong>로 즉시 전환하세요.<br />
                            로그인 후 이용하거나, 테스트 모드로 미리 체험할 수 있습니다.
                        </p>

                        <div className="unauth-buttons">
                            <button
                                onClick={() => setIsTestMode(true)}
                                className="btn-primary-large"
                            >
                                테스트 모드로 체험하기
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className="btn-secondary-large"
                            >
                                로그인하기
                            </button>
                        </div>
                    </div>
                </main>
                <style jsx>{`
                    .exchange-wrapper {
                        min-height: 100vh;
                        background: radial-gradient(circle at top left, #f1f8ff, #ffffff, #e0f2fe);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-family: 'Pretendard', sans-serif;
                    }
                    .glass-panel {
                        background: rgba(255, 255, 255, 0.7);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
                        border-radius: 32px;
                        padding: 60px;
                        max-width: 500px;
                        width: 90%;
                        text-align: center;
                    }
                    .icon-circle-large {
                        width: 80px; height: 80px;
                        background: #3b82f6;
                        color: white;
                        border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                        margin: 0 auto 30px;
                        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
                    }
                    .icon-circle-large svg { width: 40px; height: 40px; }
                    .unauth-title { font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 16px; }
                    .unauth-desc { font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 40px; }
                    .unauth-buttons { display: flex; flex-direction: column; gap: 12px; }
                    .btn-primary-large {
                        background: #2563eb; color: white; border: none; padding: 16px; 
                        border-radius: 16px; font-size: 16px; font-weight: 700; cursor: pointer;
                        transition: all 0.2s;
                    }
                    .btn-primary-large:hover { background: #1d4ed8; transform: translateY(-2px); }
                    .btn-secondary-large {
                        background: #f1f5f9; color: #475569; border: none; padding: 16px; 
                        border-radius: 16px; font-size: 16px; font-weight: 700; cursor: pointer;
                        transition: all 0.2s;
                    }
                    .btn-secondary-large:hover { background: #e2e8f0; }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <Header /> {/* 공통 헤더 사용 */}
            <div className="exchange-layout">
                {/* 기존 헤더 제거됨 */}

                <main className="exchange-main">
                    <div className="content-container">
                        <div className="page-header">
                            <h1 className="main-title">포인트 교환소</h1>
                            <p className="main-subtitle">쌓인 활동 포인트를 <strong>고양페이</strong>로 즉시 전환하세요.</p>
                        </div>

                        <div className="dashboard-grid">
                            {/* Left: Point Dashboard */}
                            <section className="card point-dashboard-card">
                                <div className="card-header">
                                    <h2>내 포인트 지갑</h2>
                                    <span className="badge">LIVE</span>
                                </div>
                                <div className="point-display-large">
                                    <div className="point-row">
                                        <span className="point-label">보유 포인트</span>
                                        <span className="point-value">{(currentPoint ?? 0).toLocaleString()}</span>
                                        <span className="point-unit">P</span>
                                    </div>
                                    <div className="point-visual-bar">
                                        <div className="bar-fill" style={{ width: `${Math.min(((currentPoint ?? 0) / 100000) * 100, 100)}%` }}></div>
                                    </div>
                                    <p className="point-desc">
                                        현재 서울시 평균보다 <strong>상위 15%</strong> 많이 모으셨어요!
                                    </p>
                                </div>

                                <div className="info-box">
                                    <Coins className="info-icon" />
                                    <div className="info-text">
                                        <strong>1P = 1원</strong><br />
                                        수수료 없이 100% 전액 전환됩니다.
                                    </div>
                                </div>
                            </section>

                            {/* Right: Exchange Form */}
                            <section className="card exchange-form-card">
                                <div className="card-header">
                                    <h2>교환 신청</h2>
                                </div>

                                <div className="exchange-input-container">
                                    <div className="input-field">
                                        <label>전환할 포인트</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                value={formattedExchangeAmount}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className="amount-input"
                                            />
                                            <button onClick={handleMaxInput} className="text-btn">전액사용</button>
                                        </div>
                                    </div>

                                    <div className="exchange-arrow-row">
                                        <div className="line"></div>
                                        <div className="arrow-box"><ArrowRight /></div>
                                        <div className="line"></div>
                                    </div>

                                    <div className="preview-field">
                                        <label>받으실 고양페이</label>
                                        <div className="preview-box">
                                            <div className="pay-brand">
                                                <CreditCard size={20} /> 고양Pay
                                            </div>
                                            <div className="preview-amount">
                                                {formattedExchangeAmount || '0'} <span className="unit">원</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleExchange}
                                    className="submit-btn"
                                    disabled={isLoading || !exchangeAmount || Number(exchangeAmount) < 100}
                                >
                                    {isLoading ? <RefreshCw className="spin" /> : '교환하기'}
                                </button>
                                <p className="helper-text">최소 100P 부터 신청 가능합니다.</p>
                            </section>
                        </div>
                    </div>
                </main>

                {/* Success Modal */}
                {isSuccess && (
                    <div className="modal-overlay">
                        <div className="modal-content bounce-in">
                            <div className="success-icon">
                                <CheckCircle />
                            </div>
                            <h2>전환이 완료되었습니다!</h2>
                            <div className="receipt">
                                <div className="receipt-row">
                                    <span>사용 포인트</span>
                                    <span>-{Number(exchangeAmount || 0).toLocaleString()} P</span>
                                </div>
                                <div className="receipt-row total">
                                    <span>충전 금액</span>
                                    <span className="highlight">+{Number(exchangeAmount || 0).toLocaleString()} 원</span>
                                </div>
                            </div>
                            <button onClick={() => setIsSuccess(false)} className="modal-close-btn">확인</button>
                        </div>
                    </div>
                )}

                <style jsx>{`
                /* Layout */
                .exchange-layout {
                    min-height: 100vh;
                    background-color: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Pretendard', sans-serif;
                    padding-top: 60px; /* 헤더 높이만큼 여백 확보 */
                }
                /* exchange-nav 스타일 제거됨 */

                .exchange-main {
                    flex: 1;
                    padding: 40px 20px;
                }
                .content-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .page-header { margin-bottom: 40px; text-align: center; }
                .main-title { font-size: 36px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
                .main-subtitle { font-size: 18px; color: #64748b; }
                .main-subtitle strong { color: #3b82f6; }

                /* Dashboard Grid */
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }
                @media (max-width: 768px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                }

                /* Cards */
                .card {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid #f1f5f9;
                    display: flex; flex-direction: column;
                }
                .point-dashboard-card { background: linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%); }
                .card-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 30px;
                }
                .card-header h2 { font-size: 20px; font-weight: 700; color: #334155; margin: 0; }
                .badge {
                    background: #dbeafe; color: #2563eb;
                    padding: 4px 10px; border-radius: 20px;
                    font-size: 11px; font-weight: 800; letter-spacing: 0.5px;
                }

                .point-display-large { margin-bottom: 40px; }
                .point-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
                .point-label { font-size: 16px; color: #64748b; font-weight: 600; margin-right: auto; }
                .point-value { font-size: 48px; font-weight: 800; color: #0f172a; letter-spacing: -2px; }
                .point-unit { font-size: 24px; font-weight: 600; color: #94a3b8; }
                
                .point-visual-bar {
                    height: 8px; background: #e2e8f0; border-radius: 4px;
                    margin-bottom: 16px; overflow: hidden;
                }
                .bar-fill {
                    height: 100%; background: #3b82f6; border-radius: 4px;
                    transition: width 1s ease-out;
                }
                .point-desc { font-size: 14px; color: #64748b; }

                .info-box {
                    background: rgba(255,255,255,0.6);
                    border: 1px solid #e2e8f0;
                    padding: 16px; border-radius: 16px;
                    display: flex; align-items: center; gap: 16px;
                    margin-top: auto;
                }
                .info-icon { color: #f59e0b; flex-shrink: 0; }
                .info-text { font-size: 14px; color: #475569; line-height: 1.4; }

                /* Form */
                .exchange-form-card {  }
                .input-field { margin-bottom: 20px; }
                .input-field label, .preview-field label {
                    display: block; font-size: 14px; font-weight: 600; color: #64748b; margin-bottom: 8px;
                }
                .input-wrapper {
                    background: #f8fafc; border: 2px solid #e2e8f0;
                    border-radius: 16px; padding: 4px 16px;
                    display: flex; align-items: center;
                    transition: border-color 0.2s;
                }
                .input-wrapper:focus-within { border-color: #3b82f6; background: white; }
                .amount-input {
                    flex: 1; border: none; background: transparent;
                    padding: 12px 0; font-size: 20px; font-weight: 700; color: #1e293b;
                    outline: none;
                }
                .text-btn {
                    color: #3b82f6; font-weight: 600; font-size: 14px;
                    background: none; border: none; cursor: pointer; padding: 8px;
                }
                .text-btn:hover { text-decoration: underline; }

                .exchange-arrow-row {
                    display: flex; align-items: center; gap: 10px; margin: 20px 0;
                }
                .line { flex: 1; height: 1px; background: #e2e8f0; }
                .arrow-box {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: #f1f5f9; color: #64748b;
                    display: flex; align-items: center; justify-content: center;
                }

                .preview-box {
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .pay-brand {
                    display: flex; align-items: center; gap: 8px;
                    font-weight: 700; color: #1e40af;
                }
                .preview-amount {
                    font-size: 20px; font-weight: 800; color: #1e40af;
                }
                .unit { font-size: 14px; font-weight: 600; }

                .submit-btn {
                    width: 100%; margin-top: 30px;
                    background: #1e293b; color: white;
                    padding: 18px; border: none; border-radius: 16px;
                    font-size: 18px; font-weight: 700; cursor: pointer;
                    transition: all 0.2s;
                    display: flex; justify-content: center; align-items: center;
                }
                .submit-btn:hover:not(:disabled) {
                    background: #0f172a; transform: translateY(-2px);
                    box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
                }
                .submit-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
                .helper-text { text-align: center; color: #94a3b8; font-size: 13px; margin-top: 12px; }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                /* Loading */
                .loading-container {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    height: 100vh; color: #64748b; font-weight: 600;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-content {
                    background: white; width: 360px; border-radius: 24px; padding: 32px;
                    text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                }
                .success-icon {
                    width: 64px; height: 64px; background: #dcfce7; color: #16a34a;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 20px;
                }
                .modal-content h2 { font-size: 22px; margin-bottom: 24px; color: #1e293b; }
                .receipt {
                    background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px;
                }
                .receipt-row {
                    display: flex; justify-content: space-between; margin-bottom: 8px;
                    font-size: 14px; color: #64748b;
                }
                .total {
                    margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;
                    font-weight: 700; color: #1e293b; font-size: 16px;
                }
                .highlight { color: #2563eb; }
                .modal-close-btn {
                    width: 100%; padding: 14px; background: #3b82f6; color: white;
                    border: none; border-radius: 12px; font-weight: 700; cursor: pointer;
                }
                .bounce-in { animation: bounce 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
                @keyframes bounce {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
            </div>
        </>
    );
};

export default ExchangePage;
