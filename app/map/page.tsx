"use client";

import React from 'react';

// 아이콘 사용을 위한 Lucide React 아이콘 시뮬레이션
const Locate = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><circle cx="12" cy="12" r="7"/></svg>;
const Home = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const Users = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ChevronRight = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

// =================================================================
// 1. DATA (동네 데이터)
// =================================================================

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  feature: string;
  density: string;
  iconColor: string;
}

const NEIGHBORHOODS: Neighborhood[] = [
  { 
    id: 'gangnam-gu', 
    name: '강남구', 
    description: '트렌드를 이끄는 비즈니스와 문화의 중심지.', 
    feature: '스타트업 및 쇼핑',
    density: '매우 높음', 
    iconColor: 'text-indigo-600', 
  },
  { 
    id: 'songpa-gu', 
    name: '송파구', 
    description: '공원과 주거 시설이 조화로운 가족 친화적 지역.', 
    feature: '대형 공원 및 아파트 단지',
    density: '높음', 
    iconColor: 'text-emerald-600', 
  },
  { 
    id: 'mapo-gu', 
    name: '마포구', 
    description: '젊음과 예술, 활기찬 대학 문화가 공존하는 곳.', 
    feature: '홍대/신촌 문화 거리',
    density: '중간', 
    iconColor: 'text-rose-600', 
  },
  { 
    id: 'jongno-gu', 
    name: '종로구', 
    description: '역사적인 고궁과 전통적인 아름다움이 깊은 곳.', 
    feature: '고궁 및 한옥 마을',
    density: '낮음', 
    iconColor: 'text-sky-600', 
  },
];


// =================================================================
// 2. STYLES (JSX Style Block) - Tailwind CSS 기반
// =================================================================
const GlobalStyles = () => (
    <style jsx global>{`
      /* -------------------------------------------------------------------
         Global Layout & Wrapper Styles
         ------------------------------------------------------------------- */
      .app-container {
          padding: 1.5rem; /* p-6 */
          background-color: #f8fafc; /* bg-slate-50 */
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 3rem;
      }

      .map-content-wrapper {
          width: 100%;
          max-width: 1000px; /* 더 넓게 설정 */
          padding: 3rem; /* p-12 */
          background-color: #ffffff;
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-3xl */
      }
      
      @media (max-width: 640px) {
          .map-content-wrapper {
              padding: 1.5rem;
              border-radius: 1rem;
          }
          .map-title {
              font-size: 1.875rem; /* sm:text-3xl */
          }
      }
      
      /* -------------------------------------------------------------------
         Header Styles
         ------------------------------------------------------------------- */
      .map-header {
          text-align: center;
          margin-bottom: 3rem; /* mb-12 */
      }
      
      .map-title {
          font-size: 2.5rem; /* text-4xl */
          font-weight: 800; /* font-extrabold */
          color: #1e3a8a; /* text-blue-900 */
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
      }

      .map-subtitle {
          font-size: 1.125rem; /* text-lg */
          color: #475569; /* text-slate-600 */
      }

      /* -------------------------------------------------------------------
         Neighborhood List Styles
         ------------------------------------------------------------------- */
      .neighborhood-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem; /* gap-8 */
      }

      .neighborhood-card {
          padding: 1.5rem;
          border-radius: 1rem;
          background-color: #f0f4ff; /* bg-blue-50 */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06); /* shadow-md */
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          position: relative;
          overflow: hidden;
      }

      .neighborhood-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.2), 0 4px 6px -4px rgba(30, 58, 138, 0.1);
          border-color: #3b82f6; /* border-blue-500 */
      }

      .card-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e3a8a; /* text-blue-900 */
          margin-bottom: 0.25rem;
      }

      .card-description {
          font-size: 0.95rem;
          color: #475569; /* text-slate-600 */
          margin-bottom: 1rem;
          height: 3.2rem; /* 2줄 높이 고정 */
      }

      .info-chip {
          display: inline-flex;
          align-items: center;
          font-size: 0.875rem;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px; /* full rounded */
          margin-right: 0.5rem;
          margin-top: 0.5rem;
          font-weight: 500;
          background-color: #e0f2f1; /* bg-teal-50 */
          color: #0d9488; /* text-teal-700 */
      }

      .action-area {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #dbeafe; /* border-blue-200 */
      }

      .action-button {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          font-weight: 600;
          border-radius: 0.75rem;
          background-color: #3b82f6; /* bg-blue-500 */
          color: #ffffff;
          transition: background-color 0.2s, transform 0.1s;
      }

      .action-button:hover {
          background-color: #2563eb; /* hover:bg-blue-600 */
      }
      
      .action-button:active {
          transform: scale(0.99);
      }
      
      .icon-large {
          width: 2.25rem;
          height: 2.25rem;
          margin-right: 0.5rem;
      }
    `}</style>
);


// =================================================================
// 3. CORE LOGIC (맵 페이지 컴포넌트)
// =================================================================

const MapPage = () => {
  
  // 동네 카드 클릭 핸들러
  const handleSelectNeighborhood = (id: string) => {
    // '/board' 페이지로 이동하면서 동네 ID를 쿼리 파라미터 'id'로 전달
    window.location.href = `/board?id=${id}`;
  };

  return (
    <div className="app-container">
      <GlobalStyles />
      <div className="map-content-wrapper">
        
        {/* 헤더 섹션 */}
        <header className="map-header">
          <h1 className="map-title">
            <Locate className="icon-large text-blue-500" />
            <span>나만의 동네를 선택해주세요</span>
          </h1>
          <p className="map-subtitle">
            선택된 동네를 기준으로 지역 게시판에 접속하며, 해당 동네의 이웃과 소통할 수 있습니다.
          </p>
        </header>

        {/* 동네 카드 그리드 */}
        <main className="neighborhood-grid">
          {NEIGHBORHOODS.map((neighborhood) => (
            <div 
              key={neighborhood.id} 
              className="neighborhood-card"
              onClick={() => handleSelectNeighborhood(neighborhood.id)}
              role="button"
              tabIndex={0} // 접근성을 위해 추가
            >
              <div className="flex items-center mb-3">
                <Home className={`w-6 h-6 ${neighborhood.iconColor} mr-2`} />
                <h2 className="card-name">{neighborhood.name}</h2>
              </div>
              
              <p className="card-description">
                {neighborhood.description}
              </p>

              {/* 동네 특징 칩 */}
              <div className="flex flex-wrap">
                <span className="info-chip bg-indigo-100 text-indigo-700">
                    <Users className="w-4 h-4 mr-1"/> 인구 밀도: {neighborhood.density}
                </span>
                <span className="info-chip bg-teal-100 text-teal-700">
                    # {neighborhood.feature}
                </span>
              </div>

              {/* 액션 영역 */}
              <div className="action-area">
                <button
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 전체 클릭 이벤트와의 중복 방지
                    handleSelectNeighborhood(neighborhood.id);
                  }}
                >
                  <span>{neighborhood.name} 게시판 바로가기</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </main>
        
        <footer className="mt-12 pt-6 border-t border-gray-100 text-center text-sm text-slate-400">
            <p>※ 현재는 테스트를 위해 서울 일부 지역만 제공됩니다.</p>
        </footer>

      </div>
    </div>
  );
};

export default MapPage;