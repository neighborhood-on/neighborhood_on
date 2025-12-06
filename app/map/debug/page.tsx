"use client";

import { useEffect, useRef, useState } from "react";

type KakaoDebugLatLng = {
  getLat: () => number;
  getLng: () => number;
};

type KakaoDebugMap = {
  setCenter: (latLng: KakaoDebugLatLng) => void;
};

type KakaoDebugMarker = {
  setMap: (map: KakaoDebugMap | null) => void;
};

type KakaoDebugNamespace = {
  maps: {
    load: (callback: () => void) => void;
    LatLng: new (lat: number, lng: number) => KakaoDebugLatLng;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoDebugLatLng; level: number },
    ) => KakaoDebugMap;
    Marker: new (options: {
      position: KakaoDebugLatLng;
      map: KakaoDebugMap;
    }) => KakaoDebugMarker;
  };
};

declare global {
  interface Window {
    kakao: KakaoDebugNamespace;
  }
}

const loadSdk = (appKey: string) =>
  new Promise<KakaoDebugNamespace>((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve(window.kakao);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-debug-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao) {
        reject(new Error("kakao object missing"));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => reject(new Error("SDK load failed"));
    document.head.appendChild(script);
  });

const DebugMapPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? "";
  const [status, setStatus] = useState(
    kakaoKey ? "SDK 로드를 시도하는 중..." : "지도를 불러올 수 없습니다.",
  );
  const [error, setError] = useState<string | null>(
    kakaoKey ? null : "NEXT_PUBLIC_KAKAO_MAP_KEY가 설정되지 않았습니다.",
  );

  useEffect(() => {
    if (!kakaoKey) return;
    let cancelled = false;

    loadSdk(kakaoKey)
      .then((kakao) => {
        if (!containerRef.current || cancelled) return;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(37.6584, 126.832),
          level: 7,
        });
        new kakao.maps.Marker({
          position: new kakao.maps.LatLng(37.6584, 126.832),
          map,
        });
        setStatus("지도 초기화 완료 (덕양구 중심)");
      })
      .catch((sdkError) => {
        if (cancelled) return;
        setError(sdkError instanceof Error ? sdkError.message : "SDK 로드 실패");
        setStatus("지도를 불러오지 못했습니다.");
      });

    return () => {
      cancelled = true;
    };
  }, [kakaoKey]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-8">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold">Kakao Map Debug</h1>
        <p className="mt-1 text-sm text-slate-600">
          SDK 키와 도메인 설정 문제를 빠르게 확인하기 위한 단순 테스트 페이지입니다.
        </p>
        <p className="mt-4 text-sm font-medium text-slate-800">{status}</p>
        {error && (
          <p className="mt-2 rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-600">
            {error}
          </p>
        )}
        <div
          ref={containerRef}
          className="mt-6 h-[420px] w-full rounded-xl border border-slate-200"
        />
      </div>
    </div>
  );
};

export default DebugMapPage;
