"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
// 아이콘 사용을 위한 Lucide React 아이콘 시뮬레이션
// (실제 Next.js 환경에서는 'lucide-react' 패키지를 설치해야 합니다.)
const Search = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PenSquare = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const Tag = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48 2.34 4.54 0l6.3-6.3a2 2 0 0 0 0-2.83L13.83 2.5a2 2 0 0 0-2.83 0z"/><path d="M7 7h.01"/></svg>;
const ThumbsUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12h4v-12h-4zm7-4h6c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4l-3 3v-7h-4V4h4zm-3-4v4H7V0h4z"/></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.5s-7-7-7-10.5a7 7 0 1 1 14 0c0 3.5-7 10.5-7 10.5z"/><circle cx="12" cy="10" r="3"/></svg>;
const ChevronLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const TrendingUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;


// =================================================================
// 1. UTILS & DATA (유틸리티 및 데이터)
// =================================================================

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  neighborhoodId: string;
  category: string;
  views: number;
  upvotes: number;
  timestamp: string;
}

// Next.js page.tsx에서는 URL 쿼리 파라미터를 사용해야 하지만, 여기서는 임시로 하드코딩합니다.
const MOCK_NEIGHBORHOOD_ID: string = 'gangnam-gu'; // 기본 동네 ID

const CATEGORIES: string[] = ['전체', '질문', '자유', '맛집', '정보', '모임'];
const mockPosts: Post[] = [
  // 강남구 데이터
  { id: 1, title: '강남역 근처 핫플 추천 좀 해주세요!', content: '...', author: '김강남', neighborhoodId: 'gangnam-gu', category: '질문', views: 820, upvotes: 125, timestamp: '2025-12-04T10:00:00Z' },
  { id: 2, title: '[HOT] 강남구청역 숨겨진 베이커리 맛집', content: '...', author: '이서초', neighborhoodId: 'gangnam-gu', category: '맛집', views: 1540, upvotes: 210, timestamp: '2025-12-03T15:30:00Z' },
  { id: 3, title: '이번 달 강남구 포인트 대결 열심히 해봅시다!', content: '...', author: '박테헤란', neighborhoodId: 'gangnam-gu', category: '자유', views: 50, upvotes: 5, timestamp: '2025-12-04T18:10:00Z' },
  { id: 7, title: '새로운 강남구 자유 게시글입니다.', content: '...', author: '테스트1', neighborhoodId: 'gangnam-gu', category: '자유', views: 120, upvotes: 15, timestamp: '2025-12-05T10:00:00Z' },
  // 송파구 데이터 (현재 페이지에서는 필터링됨)
  { id: 4, title: '석촌호수 근처 좋은 카페 아시나요?', content: '...', author: '최송파', neighborhoodId: 'songpa-gu', category: '질문', views: 500, upvotes: 80, timestamp: '2025-12-04T09:00:00Z' },
  { id: 5, title: '[HOT] 송파구 축제 캘린더 업데이트 정보!', content: '...', author: '정잠실', neighborhoodId: 'songpa-gu', category: '정보', views: 1200, upvotes: 180, timestamp: '2025-12-02T12:00:00Z' },
  { id: 6, title: '송파구민 모임 가볍게 하실 분?', content: '...', author: '윤위례', neighborhoodId: 'songpa-gu', category: '모임', views: 300, upvotes: 35, timestamp: '2025-12-04T14:20:00Z' },
];

const formatTimeAgo = (dateString: string): string => { 
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

// MOCK USER DATA
const mockUser = {
    id: 'user_1234',
    nickname: '동네주민123',
    points: 4500,
};

// =================================================================
// 2. STYLES (JSX Style Block) - Tailwind CSS를 위한 최소한의 커스텀 스타일
// =================================================================


// =================================================================
// 3. 🎯 BoardPage Component (app/board/page.tsx의 핵심 컴포넌트)
// =================================================================

const BoardPage = () => {
  // 실제로는 useSearchParams()를 통해 쿼리 파라미터를 가져와야 합니다.
  const neighborhoodId: string = MOCK_NEIGHBORHOOD_ID;
  const router = useRouter();
  const [currentNeighborhoodId, setCurrentNeighborhoodId] = useState<string>(neighborhoodId);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 현재 동네 이름
  const neighborhoodName: string = currentNeighborhoodId.includes('gangnam') ? '강남구' : currentNeighborhoodId.includes('songpa') ? '송파구' : '동네를 선택해주세요';

  // 1. 동네별 필터링
  const neighborhoodPosts = useMemo<Post[]>(() => {
    return mockPosts.filter(post => post.neighborhoodId === currentNeighborhoodId);
  }, [currentNeighborhoodId]);

  // 2. 카테고리 및 검색어 필터링
  const filteredPosts = useMemo<Post[]>(() => {
    return neighborhoodPosts.filter(post => {
      const categoryMatch: boolean = selectedCategory === '전체' || post.category === selectedCategory;
      const searchMatch: boolean = searchQuery.toLowerCase() === '' || 
                          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [neighborhoodPosts, selectedCategory, searchQuery]);

  // 인기글
  const hotPosts = useMemo<Post[]>(() => {
    return neighborhoodPosts
      .sort((a, b) => (b.upvotes * 0.7 + b.views * 0.3) - (a.upvotes * 0.7 + a.views * 0.3)) // 가중치 적용
      .slice(0, 3); // 상위 3개만 표시
  }, [neighborhoodPosts]);

  // 게시글 클릭 핸들러 (실제로는 router.push('/board/[id]'))
  const handlePostClick = (postId: number) => {
    console.log(`${currentNeighborhoodId}의 ${postId}번 게시글 상세 페이지로 이동합니다.`);
  };

  // 지도 화면으로 돌아가기 (실제로는 router.push('/map'))
  const handleBackToMap = () => {
    console.log("지도 화면(/map)으로 돌아갑니다. (Next.js 라우팅 시뮬레이션)");
    router.push('/map');
    // 실제 환경에서는 router.push('/map')을 사용합니다.
  };

  if (!currentNeighborhoodId) {
    return (
        <div className="community-board-wrapper">
            <header className="board-header">
                <h1 className="board-title">
                    <MapPin className="icon-map-pin" />
                    게시판을 불러올 수 없습니다
                </h1>
                <button onClick={handleBackToMap} className="btn-back">
                    <ChevronLeft className="icon-chevron" />
                    <span>지도 화면으로</span>
                </button>
            </header>
            <div className="no-posts-message">URL 쿼리 파라미터로 동네를 지정해주세요.</div>
        </div>
    );
  }

  return (
    <div className="app-container">
        <div className="app-content-wrapper">
            <div className="community-board-wrapper">
              <header className="board-header">
                <h1 className="board-title">
                  <MapPin className="icon-map-pin" />
                  {neighborhoodName} 동네 게시판
                </h1>
                <button
                  onClick={handleBackToMap}
                  className="btn-back"
                >
                  <ChevronLeft className="icon-chevron" />
                  <span>지도 화면</span>
                </button>
              </header>

              <div className="board-layout">
                {/* ======================= 3. LEFT SIDEBAR (왼쪽 사이드바) ======================= */}
                <aside className="sidebar">
                  
                  {/* 사용자 정보 카드 */}
                  <div className="card user-card">
                    <h2 className="card-title user-title">
                        <User className="icon-user"/>
                        <span>{mockUser.nickname}님</span>
                    </h2>
                    <div className="user-info-detail">
                        <span className="info-text info-points-label">
                            <TrendingUp className="icon-trending"/>
                            <span>현재 포인트</span>
                        </span>
                        <span className="info-points-value">
                            {mockUser.points.toLocaleString()} P
                        </span>
                    </div>
                  </div>
                  
                  {/* 글작성 버튼 */}
                  <button
                    className="btn btn-write"
                    onClick={() => console.log('글 작성 페이지로 이동')}
                  >
                    <PenSquare className="icon-write" />
                    <span>새 글 작성</span>
                  </button>
                  
                  {/* 검색창 */}
                  <div className="card search-card">
                    <h2 className="card-title">게시글 검색</h2>
                    <div className="search-input-group">
                      <input
                        type="text"
                        placeholder="제목 또는 내용 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                      />
                      <Search className="icon-search" />
                    </div>
                  </div>
                  
                  {/* 카테고리 */}
                  <div className="card category-card">
                    <h2 className="card-title">카테고리</h2>
                    <nav className="category-nav">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`category-button ${selectedCategory === cat ? 'selected' : ''}`}
                        >
                          <Tag className="icon-tag" />
                          <span>{cat}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>

                {/* ======================= 4. RIGHT MAIN CONTENT (오른쪽 메인 콘텐츠) ======================= */}
                <main className="main-content">
                  
                  {/* Hot 글 섹션 */}
                  <div className="card hot-posts-section">
                    <h2 className="card-title hot-title">
                      <ThumbsUp className="icon-thumbs-up" />
                      <span>Hot 인기 글</span>
                    </h2>
                    <div className="post-list hot-list">
                      {hotPosts.length > 0 ? (
                        hotPosts.map(post => (
                          <div 
                            key={post.id} 
                            onClick={() => handlePostClick(post.id)}
                            className="post-item hot-post-item"
                          >
                            <div className="post-info-left">
                                <span className="post-category-hot">{post.category}</span>
                                <span className="post-title-hot">{post.title}</span> 
                            </div>
                            <div className="post-meta-stats">
                                <span className="post-stat post-upvotes-hot"><ThumbsUp className="icon-stat-hot" />{post.upvotes}</span>
                                <span className="post-stat post-views-hot"><Eye className="icon-stat" />{post.views}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-posts-message">아직 이 동네에 인기글이 없습니다.</p>
                      )}
                    </div>
                  </div>

                  {/* 전체 글 섹션 */}
                  <div className="card all-posts-section">
                    <h2 className="card-title all-posts-title">
                      <Tag className="icon-tag-blue" />
                      <span>전체 글 ({selectedCategory})</span>
                      <span className="post-count">({filteredPosts.length}개)</span>
                    </h2>
                    
                    <div className="post-list all-list">
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                          <div 
                            key={post.id} 
                            onClick={() => handlePostClick(post.id)}
                            className="post-item regular-post-item"
                          >
                            <div className="post-main-content">
                              {/* 제목 및 카테고리 */}
                              <div className="post-title-group">
                                <span className={`post-category-tag category-${post.category === '질문' ? '질문' : post.category === '맛집' ? '맛집' : 'default'}`}>
                                  {post.category}
                                </span>
                                <p className="post-title-regular">{post.title}</p>
                              </div>
                              
                              {/* 메타 정보 */}
                              <div className="post-meta-info">
                                  <p className="post-author">{post.author}</p>
                                  <p className="post-time">
                                    <Clock className="icon-clock" />
                                    {formatTimeAgo(post.timestamp)}
                                  </p>
                              </div>
                            </div>

                            {/* 하단 통계 */}
                            <div className="post-stats-bottom">
                                <span className="post-stat post-upvotes">
                                    <ThumbsUp className="icon-stat" />
                                    <span>{post.upvotes}</span>
                                </span>
                                <span className="post-stat post-views">
                                    <Eye className="icon-stat" />
                                    <span>{post.views}</span>
                                </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-posts-message">
                          선택한 카테고리/검색어로 해당 동네에 작성된 글이 없습니다.
                        </p>
                      )}
                    </div>
                    
                    {/* 페이지네이션 (추후 구현) */}
                    <div className="pagination-area">
                        <button className="btn-more">
                            더 보기
                        </button>
                    </div>
                  </div>
                </main>
              </div>
              
              <footer className="board-footer">
                <p>현재 {neighborhoodName} 게시판이 표시되고 있습니다. 실제 동네 ID는 URL 쿼리에서 가져와야 합니다.</p>
              </footer>
            </div>
        </div>
    </div>
  );
};

export default BoardPage;