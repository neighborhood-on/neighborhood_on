"use client"; // <--- 이 지시어를 추가하여 클라이언트 훅 사용 문제를 해결합니다.

import React from 'react';

// 아이콘 사용을 위한 Lucide React 아이콘 시뮬레이션
const Map = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;

const BoardRootPage = () => {
  // 이 페이지는 사용자가 /board로 바로 접속했을 때 보여집니다.
  
  const handleGoToMap = () => {
    // 동네 선택 페이지로 이동
    window.location.href = '/map';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center">
        <Map className="w-16 h-16 text-blue-500 mx-auto mb-4"/>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          지역 게시판을 이용하려면 동네를 먼저 선택해주세요.
        </h1>
        <p className="text-gray-600 mb-6">
          선택 없이 `/board`로 접속하셨습니다. '동네 선택 맵' 페이지로 이동하여 활동할 지역을 지정해주세요.
        </p>
        <button
          onClick={handleGoToMap}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.01]"
        >
          동네 선택 맵으로 이동하기
        </button>
      </div>
    </div>
  );
};

export default BoardRootPage;