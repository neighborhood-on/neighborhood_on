'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const features = [
    {
        label: "Smart Mapping",
        headline: <>내 위치를 기반으로 <span className="text-blue-600 font-extrabold">동네를 선택</span>하고 시작하세요</>,
        desc: "실제 이웃들과 진솔한 이야기를 나누는 가장 확실한 방법",
        image: "/images/smart-mapping.png",
        link: "/map",
        buttonText: "지도 보러가기"
    },
    {
        label: "Community Board",
        headline: <>궁금한 내용은 바로바로 <span className="text-green-600 font-extrabold">동네 질문 & 답변</span></>,
        desc: "맛집 정보부터 소소한 일상까지, 이웃과 함께 만들어가는 커뮤니티",
        image: "/images/community-board.png",
        link: "/board/4128159000",
        buttonText: "게시판 구경하기"
    },
    {
        label: "Point System",
        headline: <>활동할수록 쌓이는 <span className="text-yellow-600 font-extrabold">알찬 포인트 혜택</span></>,
        desc: "당신의 지식과 경험이 이웃에게 도움이 되고, 기분 좋은 보상으로 돌아옵니다",
        image: "/images/point-exchange.png",
        link: "/exchange",
        buttonText: "포인트 교환 체험하기"
    },
    {
        label: "Monthly Event",
        headline: <>매달 펼쳐지는 <span className="text-purple-600 font-extrabold">우리 동네 랭킹 대결</span></>,
        desc: "우승한 동네 주민들에게만 주어지는 특별한 보상을 놓치지 마세요",
        image: "/images/monthly-event.png",
        link: "/rankings",
        buttonText: "실시간 랭킹 보기"
    }
]

export default function FeatureShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)
    }, [])

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(timer)
    }, [nextSlide, currentIndex]) // Add currentIndex to reset timer on manual interaction

    // Manual controls just change state, relying on useEffect dep change to reset timer
    const handleManualChange = (index: number) => {
        setCurrentIndex(index);
    };

    const handlePrev = () => {
        prevSlide();
    };

    const handleNext = () => {
        nextSlide();
    };

    return (
        <section className="py-24 bg-gray-50 overflow-hidden text-center min-h-[900px] flex flex-col justify-center relative">

            {/* Main Content Container with Fixed Height */}
            <div className="relative w-full max-w-[1200px] mx-auto px-6 h-[750px] flex flex-col items-center">

                {features.map((feature, idx) => {
                    // Determine position relative to current index for sliding effect
                    let position = 'translate-x-full opacity-0';
                    if (idx === currentIndex) {
                        position = 'translate-x-0 opacity-100 z-10';
                    } else if (idx === (currentIndex - 1 + features.length) % features.length) {
                        position = '-translate-x-full opacity-0 z-0'; // Slide out to left
                    }

                    return (
                        <div
                            key={idx}
                            className={`transition-all duration-700 ease-in-out absolute inset-0 flex flex-col items-center
                                ${position}
                            `}
                        >
                            {/* 1. Typography Section (Fixed Height & Spacing) */}
                            <div className="h-[260px] flex flex-col justify-end mb-6 w-full max-w-6xl mx-auto px-4">
                                {/* Small Label */}
                                <span className="block text-gray-500 font-bold tracking-widest text-sm mb-3 uppercase">
                                    {feature.label}
                                </span>

                                {/* Main Headline */}
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                    {feature.headline}
                                </h2>

                                {/* Sub Description */}
                                <p className="text-gray-500 text-lg md:text-xl font-medium tracking-wide h-[30px] flex items-center justify-center mb-6">
                                    {feature.desc}
                                </p>

                                {/* Action Button */}
                                <div className="h-[50px] flex justify-center items-center">
                                    {feature.link && (
                                        <Link
                                            href={feature.link}
                                            className="px-8 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2 z-20 pointer-events-auto"
                                        // z-20 and pointer-events-auto to ensure clickability
                                        >
                                            {feature.buttonText || "자세히 보기"}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* 2. Laptop Mockup (Fixed Height & Wrapper) */}
                            <div className="flex-1 w-full flex justify-center items-start">
                                <div className="laptop-wrapper transform scale-100 origin-top">
                                    <div className="laptop-screen-frame">
                                        <div className="laptop-screen-content overflow-hidden relative bg-gray-900">
                                            <img
                                                src={feature.image}
                                                alt="Feature Screenshot"
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>
                                    </div>
                                    <div className="laptop-base"></div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Navigation Arrows (Absolute Positioned, Vertically Centered relative to the container) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-10 top-2/3 -translate-y-1/2 z-20 p-3 rounded-full text-gray-800 transition-all hover:scale-110 focus:outline-none"
                    aria-label="Previous Slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-10 top-2/3 -translate-y-1/2 z-20 p-3 rounded-full text-gray-800 transition-all hover:scale-110 focus:outline-none"
                    aria-label="Next Slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Pagination Dots (Below Container) */}
            <div className="slider-indicators relative z-20 mt-8">
                {features.map((_, idx) => (
                    <div
                        key={idx}
                        className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => handleManualChange(idx)}
                    />
                ))}
            </div>
        </section>
    )
}
