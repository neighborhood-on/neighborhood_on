"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { signIn } from "next-auth/react"; // 로그인 유틸리티 추가

// 아이콘 사용을 위한 Lucide React 아이콘 시뮬레이션 (유지)
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

// 🚀 Post 인터페이스 수정: author -> authorName, timestamp -> date
interface Post {
  _id: string; // ObjectId를 문자열로 사용
  title: string;
  content: string;
  authorName: string; // ✨ 변경됨
  neighborhoodId: string; 
  category: string;
  views: number;
  upvotes: number;
  date: string; // ✨ 변경됨
}

const GEOJSON_ENDPOINTS = {
  districts: "/data/goyang-districts.geojson",
  neighborhoods: "/data/goyang-neighborhoods.geojson",
};

const CATEGORIES: string[] = ['전체', '질문', '자유', '맛집', '정보', '모임'];



// 🚀 날짜 처리 함수 수정: dateString -> dateString
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

// GeoJSON Fetch 함수 (변경 없음)
async function getAdmNameFromGeoJSON(targetCode: string, geojsonEndpoints: typeof GEOJSON_ENDPOINTS): Promise<string> {
    
    const endpointKey = targetCode.length <= 5 ? 'districts' : 'neighborhoods'; 
    const jsonUrl = geojsonEndpoints[endpointKey as keyof typeof GEOJSON_ENDPOINTS];

    const KEY_MAP = {
        districts: { CODE_KEY: 'code', NAME_KEY: 'name' },           
        neighborhoods: { CODE_KEY: 'adm_cd2', NAME_KEY: 'adm_nm' },  
    };

    const { CODE_KEY, NAME_KEY } = KEY_MAP[endpointKey as keyof typeof KEY_MAP];
    
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            console.error(`GeoJSON 파일 로드 실패: ${jsonUrl}, Status: ${response.status}`);
            return "GeoJSON 파일을 찾을 수 없습니다.";
        }
        const geojsonData = await response.json();
        const features = geojsonData.features;
        
        const match = features.find((feature: any) => 
            String(feature.properties[CODE_KEY]) === targetCode
        );
        
        if (match) {
            return match.properties[NAME_KEY]; 
        } else {
            return "정보를 찾을 수 없습니다. (코드 불일치)";
        }

    } catch (error) {
        console.error(`GeoJSON 데이터를 가져오는 중 오류 발생 (${jsonUrl}):`, error);
        return "데이터 로드 중 오류 발생";
    }
}


// =================================================================
// 3. 🎯 BoardPage Component
// =================================================================

const BoardPage = () => {
  const router = useRouter();
  
  const [currentNeighborhoodId, setCurrentNeighborhoodId] = useState<string | null>(null);
  const [neighborhoodName, setNeighborhoodName] = useState<string>('동네 이름 로딩 중...');
  
  const { data: session, status } = useSession(); 
  
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ⚠️ MongoDB 연동을 위한 상태 추가
  const [posts, setPosts] = useState<Post[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  
  // ⭐️ 글 작성 버튼 클릭 핸들러 (로그인 확인 및 이동 로직 추가)
  const handleWriteClick = () => {
    if (status === 'unauthenticated') {
        alert('글을 작성하려면 로그인이 필요합니다.');
        signIn(); // NextAuth 로그인 페이지로 이동
    } else if (currentNeighborhoodId) {
        // 로그인 상태이고 동네 ID가 있는 경우, 글 작성 페이지로 이동
        router.push(`/board/${currentNeighborhoodId}/write`);
    } else {
        alert('동네 정보가 없어 글을 작성할 수 없습니다.');
    }
  };


  // ⚠️ 게시글 데이터를 API에서 가져오는 함수 (useCallback 사용)
  const fetchPosts = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
        // 백엔드 API 엔드포인트 호출 (/api/posts/[id])
        // 참고: 백엔드는 이 id를 컬렉션 이름으로 사용하여 데이터를 가져와야 합니다.
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
            throw new Error('게시글 API 호출 실패'); // 실제 환경에서는 이 코드를 사용해야 합니다.
        }
        const data: Post[] = await response.json();
        setPosts(data);
    } catch (error) {
        console.error("게시글 로드 오류:", error);
        setPosts([]); // 오류 발생 시 빈 배열 설정
    } finally {
        setIsLoading(false);
    }
  }, []); // 의존성 없음

  
  // 3. 컴포넌트 마운트 시 URL에서 ID 추출, 이름 Fetch, 게시글 Fetch
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const parts = pathname.split('/').filter(p => p.length > 0);
        const pathId = parts[parts.length - 1]; 
        
        if (pathId && pathId !== 'board') {
            setCurrentNeighborhoodId(pathId);

            // GeoJSON 데이터 가져오기 및 이름 설정
            getAdmNameFromGeoJSON(pathId, GEOJSON_ENDPOINTS)
                .then(name => {
                    setNeighborhoodName(name);
                })
                .catch(() => {
                    setNeighborhoodName("이름을 불러오지 못했습니다.");
                });
            
            // ⭐️ 게시글 API 호출
            fetchPosts(pathId); 

        } else {
            setCurrentNeighborhoodId(null); 
            setNeighborhoodName("동네를 선택해주세요");
            setIsLoading(false); // ID 없으면 로딩 종료
        }
    }
  }, [fetchPosts]); // fetchPosts를 의존성 배열에 추가


  // 1. 동네별 필터링
  // ⚠️ posts 상태 자체가 이미 API 호출 시 동네별 필터링된 결과입니다.
  const neighborhoodPosts = posts; 

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
      .slice() 
      // post.upvotes와 post.views를 기준으로 정렬
      .sort((a, b) => (b.upvotes * 0.7 + b.views * 0.3) - (a.upvotes * 0.7 + a.views * 0.3))
      .slice(0, 3);
  }, [neighborhoodPosts]);

  // 게시글 클릭 핸들러 (ID를 MongoDB _id 문자열로 전달)
  const handlePostClick = (postId: string) => { 
    // 실제 게시글 상세 페이지로 라우팅 (예: /board/41281/657088f1a1b2c3d4e5f60001)
    router.push(`/board/${currentNeighborhoodId}/${postId}`);
  };

  // 지도 화면으로 돌아가기
  const handleBackToMap = () => {
    router.push('/map');
  };

  // 사용자 정보 설정 (NextAuth 세션 기반)
  const isAuthenticated = status === 'authenticated';
  const userNickname = session?.user?.name || '방문자';
  const userPoints = (session?.user as any)?.point ?? 0;

  // ⚠️ 로딩 상태 렌더링
  if (isLoading || status === 'loading') {
    return (
        <div className="community-board-wrapper">
            <header className="board-header">
                <h1 className="board-title">
                    <MapPin className="icon-map-pin" />
                    {neighborhoodName} 게시판
                </h1>
                <button onClick={handleBackToMap} className="btn-back">
                    <ChevronLeft className="icon-chevron" />
                    <span>지도 화면으로</span>
                </button>
            </header>
            <div className="no-posts-message loading-message">
                <Search className="icon-loading spin" />
                <p>데이터를 불러오는 중입니다...</p>
            </div>
        </div>
    );
  }

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
            <div className="no-posts-message">URL 경로에서 동네 ID를 찾을 수 없습니다.</div>
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
                  
                  {/* 사용자 정보 카드 (NextAuth 연동 유지) */}
                  <div className="card user-card">
                    <h2 className="card-title user-title">
                      <User className="icon-user" />
                      <span>{userNickname}{isAuthenticated ? '님' : ''}</span>
                    </h2>
                    <div className="user-info-detail">
                      <span className="info-text info-points-label">
                        <TrendingUp className="icon-trending" />
                        <span>{isAuthenticated ? '현재 포인트' : '로그인 필요'}</span>
                      </span>
                      <span className="info-points-value">
                         {isAuthenticated ? `${userPoints.toLocaleString()} P` : '--- P'}
                      </span>
                    </div>
                  </div>
                  
                  {/* 글작성 버튼 */}
                  <button
                    className="btn btn-write"
                    onClick={handleWriteClick} // ✨ 글쓰기 로직
                  >
                    <PenSquare className="icon-write" />
                    <span>{isAuthenticated ? '새 글 작성' : '로그인 후 작성'}</span>
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
                            key={post._id} 
                            onClick={() => handlePostClick(post._id)}
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
                            key={post._id} 
                            onClick={() => handlePostClick(post._id)}
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
                                  {/* 🚀 post.authorName을 사용하도록 변경 */}
                                  <p className="post-author">{post.authorName}</p> 
                                  <p className="post-time">
                                    <Clock className="icon-clock" />
                                    {/* 🚀 post.date를 사용하도록 변경 */}
                                    {formatTimeAgo(post.date)}
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
                <p>현재 {neighborhoodName} 게시판이 표시되고 있습니다. 실제 동네 ID: {currentNeighborhoodId}</p>
              </footer>
            </div>
        </div>
    </div>
  );
};

export default BoardPage;