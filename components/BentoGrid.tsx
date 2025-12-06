export default function BentoGrid() {
    return (
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
    )
}
