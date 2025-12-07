"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { signIn } from "next-auth/react";

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


interface Comment {
    _id: string;
    authorName: string;
    content: string;
    date: string;
}

interface Post {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    category: string;
    views: number;
    upvotes: number;
    date: string;
    comments?: Comment[];
}

const GEOJSON_ENDPOINTS = {
  districts: "/data/goyang-districts.geojson",
  neighborhoods: "/data/goyang-neighborhoods.geojson",
};

const CATEGORIES: string[] = ['전체', '질문', '자유', '맛집', '정보', '모임'];

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

const BoardPage = () => {
  const router = useRouter();
  
  const [currentNeighborhoodId, setCurrentNeighborhoodId] = useState<string | null>(null);
  const [neighborhoodName, setNeighborhoodName] = useState<string>('동네 이름 로딩 중...');
  
  const { data: session, status } = useSession(); 
  
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [posts, setPosts] = useState<Post[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  
  const handleWriteClick = () => {
    if (status === 'unauthenticated') {
        alert('글을 작성하려면 로그인이 필요합니다.');
        signIn();
    } else if (currentNeighborhoodId) {
        router.push(`/board/${currentNeighborhoodId}/write`);
    } else {
        alert('동네 정보가 없어 글을 작성할 수 없습니다.');
    }
  };


  const fetchPosts = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
            throw new Error('게시글 API 호출 실패');
        }
        const data: Post[] = await response.json();
        setPosts(data);
    } catch (error) {
        console.error("게시글 로드 오류:", error);
        setPosts([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const parts = pathname.split('/').filter(p => p.length > 0);
        const pathId = parts[parts.length - 1]; 
        
        if (pathId && pathId !== 'board') {
            setCurrentNeighborhoodId(pathId);

            getAdmNameFromGeoJSON(pathId, GEOJSON_ENDPOINTS)
                .then(name => {
                    setNeighborhoodName(name);
                })
                .catch(() => {
                    setNeighborhoodName("이름을 불러오지 못했습니다.");
                });
            
            fetchPosts(pathId); 

        } else {
            setCurrentNeighborhoodId(null); 
            setNeighborhoodName("동네를 선택해주세요");
            setIsLoading(false);
        }
    }
  }, [fetchPosts]);

  const neighborhoodPosts = posts; 

  const filteredPosts = useMemo<Post[]>(() => {
    return neighborhoodPosts.filter(post => {
      const categoryMatch: boolean = selectedCategory === '전체' || post.category === selectedCategory;
      const searchMatch: boolean = searchQuery.toLowerCase() === '' || 
                          post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [neighborhoodPosts, selectedCategory, searchQuery]);

  const hotPosts = useMemo<Post[]>(() => {
    return neighborhoodPosts
      .slice() 
      .sort((a, b) => (b.upvotes * 0.7 + b.views * 0.3) - (a.upvotes * 0.7 + a.views * 0.3))
      .slice(0, 3);
  }, [neighborhoodPosts]);

  const handlePostClick = (postId: string) => { 
    router.push(`/board/${currentNeighborhoodId}/${postId}`);
  };

  const handleBackToMap = () => {
    router.push('/map');
  };

  const isAuthenticated = status === 'authenticated';
  const userNickname = session?.user?.name || '방문자';
  const userPoints = (session?.user as any)?.point ?? 0;

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
                <aside className="sidebar">
                  
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
                  
                  <button
                    className="btn btn-write"
                    onClick={handleWriteClick}
                  >
                    <PenSquare className="icon-write" />
                    <span>{isAuthenticated ? '새 글 작성' : '로그인 후 작성'}</span>
                  </button>
                  
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

                <main className="main-content">
                  
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
                              <div className="post-title-group">
                                <span className={`post-category-tag category-${post.category === '질문' ? '질문' : post.category === '맛집' ? '맛집' : 'default'}`}>
                                  {post.category}
                                </span>
                                <p className="post-title-regular">{post.title}</p>
                              </div>
                              
                              <div className="post-meta-info">
                                  <p className="post-author">{post.authorName}</p> 
                                  <p className="post-time">
                                    <Clock className="icon-clock" />
                                    {formatTimeAgo(post.date)}
                                  </p>
                              </div>
                            </div>

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
                    
                    <div className="pagination-area">
                        <button className="btn-more">
                            더 보기
                        </button>
                    </div>
                  </div>
                </main>
              </div>
              
              <footer className="board-footer">
                <p>{neighborhoodName} Board</p>
              </footer>
            </div>
        </div>
    </div>
  );
};

export default BoardPage;