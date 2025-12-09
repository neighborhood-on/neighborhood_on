'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Ranker {
    rank: number;
    neighborhood: string;
    score: number;
    change: string; // 'up', 'down', 'same'
    participants: number;
}

interface RankingBoardProps {
    data: Ranker[];
}

export default function RankingBoard({ data }: RankingBoardProps) {
    const [activeTab, setActiveTab] = useState('monthly'); // 'monthly' | 'weekly'

    // Split data into Top 3 and Others
    const topRankers = data.slice(0, 3);
    const otherRankers = data.slice(3);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-36 pb-8 px-4">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        우리 동네 <span className="text-blue-600">랭킹 대결</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        이웃들과 함께 활동하며 포인트를 쌓고, 우리 동네의 명예를 드높이세요!<br className="hidden md:block" />
                        매달 우승한 동네 주민들에게는 특별한 혜택이 주어집니다.
                    </p>
                </div>

                {/* Tab Selection */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex space-x-1">
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'monthly'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            월간 랭킹
                        </button>
                        <button
                            onClick={() => setActiveTab('weekly')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'weekly'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            주간 랭킹
                        </button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Top 3 Podium or Empty State */}
                    {data.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="text-6xl mb-4">🏆</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">아직 랭킹 데이터가 없어요!</h3>
                            <p className="text-gray-500">가장 먼저 활동을 시작하고 우리 동네를 1등으로 만들어보세요.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end">

                            {/* 2nd Place */}
                            <div className="order-2 md:order-1 flex flex-col items-center">
                                <div className="relative w-full bg-white rounded-2xl shadow-lg border-t-4 border-gray-300 p-6 flex flex-col items-center transform transition hover:-translate-y-2 duration-300 min-h-[220px] justify-center">
                                    <div className="absolute -top-6 bg-gray-100 border-4 border-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md">
                                        🥈
                                    </div>
                                    {topRankers[1] ? (
                                        <div className="mt-6 text-center">
                                            <h3 className="text-xl font-bold text-gray-900">{topRankers[1].neighborhood}</h3>
                                            <div className="text-gray-500 text-sm mb-4 font-medium">{topRankers[1].participants.toLocaleString()}명 참여 중</div>
                                            <div className="text-3xl font-extrabold text-blue-600 mb-1">
                                                {topRankers[1].score.toLocaleString()} P
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6 text-center text-gray-400">
                                            <p>아직 2위가 없습니다</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 1st Place (Center/Largest) */}
                            <div className="order-1 md:order-2 flex flex-col items-center z-10">
                                <div className="relative w-full bg-white rounded-2xl shadow-xl border-t-4 border-yellow-400 p-8 flex flex-col items-center transform scale-105 transition hover:-translate-y-2 duration-300 ring-4 ring-yellow-50 my-4 md:my-0 min-h-[280px] justify-center">
                                    <div className="absolute -top-10">
                                        <svg className="w-20 h-20 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                                        </svg>
                                    </div>
                                    {topRankers[0] ? (
                                        <div className="mt-8 text-center">
                                            <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">1위 Leader</div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{topRankers[0].neighborhood}</h3>
                                            <div className="text-gray-500 text-sm mb-6 font-medium">{topRankers[0].participants.toLocaleString()}명 참여 중</div>
                                            <div className="text-4xl font-black text-blue-600 mb-2">
                                                {topRankers[0].score.toLocaleString()} P
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium">
                                                전월 대비 <span className="text-red-500 font-bold">▲ 12.5%</span> 상승
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-8 text-center text-gray-400">
                                            <p>주인공이 되어보세요!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="order-3 md:order-3 flex flex-col items-center">
                                <div className="relative w-full bg-white rounded-2xl shadow-lg border-t-4 border-orange-400 p-6 flex flex-col items-center transform transition hover:-translate-y-2 duration-300 min-h-[220px] justify-center">
                                    <div className="absolute -top-6 bg-orange-50 border-4 border-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md">
                                        🥉
                                    </div>
                                    {topRankers[2] ? (
                                        <div className="mt-6 text-center">
                                            <h3 className="text-xl font-bold text-gray-900">{topRankers[2].neighborhood}</h3>
                                            <div className="text-gray-500 text-sm mb-4 font-medium">{topRankers[2].participants.toLocaleString()}명 참여 중</div>
                                            <div className="text-3xl font-extrabold text-blue-600 mb-1">
                                                {topRankers[2].score.toLocaleString()} P
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6 text-center text-gray-400">
                                            <p>아직 3위가 없습니다</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* List for 4th ~ 10th */}
                    {otherRankers.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-20">
                            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-700">전체 랭킹 순위</h3>
                                <span className="text-xs text-gray-500 font-medium">매일 자정 업데이트</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {otherRankers.map((item) => (
                                    <div key={item.rank} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                                        <div className="w-12 text-center font-bold text-gray-400 text-lg">{item.rank}</div>
                                        <div className="flex-1 flex items-center ml-4">
                                            <div className="ml-0">
                                                <div className="font-bold text-gray-800">{item.neighborhood}</div>
                                                <div className="text-xs text-gray-500">{item.participants.toLocaleString()}명 참여</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600">{item.score.toLocaleString()} P</div>
                                            <div className="text-xs text-gray-400 flex items-center justify-end mt-1">
                                                {/* Change indicator is always same for now as we lack history */}
                                                <span className="text-gray-400 text-[10px] mr-1">-</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 text-center">
                                <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center w-full">
                                    더 많은 순위 보기
                                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* How to Earn Points Section */}
                    <div className="mb-10 pt-[50px]">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            🎁 포인트는 어떻게 모으나요?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { icon: "📝", title: "게시글 작성", point: "10 P", desc: "이웃에게 유용한 정보를 공유해보세요" },
                                { icon: "💬", title: "댓글 작성", point: "5 P", desc: "이웃의 이야기에 공감과 답변을 남겨주세요" },
                                { icon: "💡", title: "답변 채택", point: "100 P", desc: "질문에 답변하고 채택되면 큰 보너스!" },
                                { icon: "📍", title: "동네 인증", point: "200 P", desc: "내 동네를 인증하고 이웃임을 증명하세요" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <div className="text-indigo-600 font-extrabold text-xl mb-2">{item.point}</div>
                                    <p className="text-xs text-gray-500 break-keep">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
