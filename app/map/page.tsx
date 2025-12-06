"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Coordinates = {
  lat: number;
  lng: number;
};

type PolygonCoordinates = number[][][];

type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};

type KakaoLatLngBounds = {
  extend: (latLng: KakaoLatLng) => void;
  isEmpty: () => boolean;
};

type KakaoMap = {
  setBounds: (bounds: KakaoLatLngBounds) => void;
  panTo: (latLng: KakaoLatLng) => void;
};

type KakaoPolygon = {
  setMap: (map: KakaoMap | null) => void;
  setOptions: (options: { fillOpacity?: number }) => void;
};

type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};

type KakaoCircle = {
  setMap: (map: KakaoMap | null) => void;
};

type KakaoCustomOverlay = {
  setContent: (content: string) => void;
  setPosition: (latLng: KakaoLatLng) => void;
  setMap: (map: KakaoMap | null) => void;
};

type KakaoMouseEvent = {
  latLng: KakaoLatLng;
};

type KakaoRegionCodeResult = {
  address_name: string;
  region_type: "B" | "H";
  code: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
};

type KakaoGeocoder = {
  coord2RegionCode: (
    lng: number,
    lat: number,
    callback: (result: KakaoRegionCodeResult[], status: string) => void,
  ) => void;
};

type KakaoServices = {
  Geocoder: new () => KakaoGeocoder;
  Status: {
    OK: string;
  };
};

type KakaoNamespace = {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    LatLngBounds: new (
      southWest?: KakaoLatLng,
      northEast?: KakaoLatLng,
    ) => KakaoLatLngBounds;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level: number },
    ) => KakaoMap;
    Polygon: new (options: {
      path: KakaoLatLng[][];
      strokeWeight: number;
      strokeColor: string;
      strokeOpacity: number;
      fillColor: string;
      fillOpacity: number;
    }) => KakaoPolygon;
    Marker: new (options: {
      position: KakaoLatLng;
      map: KakaoMap;
    }) => KakaoMarker;
    Circle: new (options: {
      center: KakaoLatLng;
      radius: number;
      strokeWeight: number;
      strokeColor: string;
      strokeOpacity: number;
      fillColor: string;
      fillOpacity: number;
    }) => KakaoCircle;
    CustomOverlay: new (options: {
      yAnchor: number;
      zIndex: number;
    }) => KakaoCustomOverlay;
    event: {
      addListener: (
        target: KakaoPolygon,
        type: "mouseover" | "mousemove" | "mouseout" | "click",
        handler: ((mouseEvent: KakaoMouseEvent) => void) | (() => void),
      ) => void;
    };
    services: KakaoServices;
  };
};

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

type DistrictShape = {
  key: string;
  id: string;
  name: string;
  summary: string;
  color: string;
  centroid: Coordinates;
  polygons: PolygonCoordinates[];
};

type NeighborhoodShape = {
  admCd: string;
  name: string;
  fullName: string;
  districtKey: string;
  centroid: Coordinates;
  polygons: PolygonCoordinates[];
};

type HoverInfo = {
  id: string;
  name: string;
  level: "district" | "neighborhood";
};

type GeoJSONGeometry =
  | {
      type: "Polygon";
      coordinates: number[][][];
    }
  | {
      type: "MultiPolygon";
      coordinates: number[][][][];
    };

type GeoJSONFeature = {
  properties: Record<string, unknown>;
  geometry: GeoJSONGeometry;
};

const DISTRICT_META: Record<
  string,
  { id: string; displayName: string; summary: string; color: string }
> = {
  고양시덕양구: {
    id: "deogyang-gu",
    displayName: "덕양구",
    summary:
      "서울과 맞닿은 생활권, 화정·행신·삼송을 품은 북부 대표 구역입니다.",
    color: "#2563eb",
  },
  고양시일산동구: {
    id: "ilsandong-gu",
    displayName: "일산동구",
    summary:
      "일산호수공원과 웨스턴돔·라페스타 상권이 펼쳐지는 문화 중심지입니다.",
    color: "#f97316",
  },
  고양시일산서구: {
    id: "ilsanseo-gu",
    displayName: "일산서구",
    summary:
      "킨텍스·대화·주엽으로 이어지는 교육 특화 주거지이자 GTX-A 수혜권입니다.",
    color: "#0ea5e9",
  },
};

const DISTRICT_ORDER = ["고양시덕양구", "고양시일산동구", "고양시일산서구"];

const MAP_CENTER = { lat: 37.6584, lng: 126.832 };
const DEFAULT_STATUS_MESSAGE = "구를 클릭하면 행정동 지도로 전환됩니다.";

const GEOJSON_ENDPOINTS = {
  districts: "/data/goyang-districts.geojson",
  neighborhoods: "/data/goyang-neighborhoods.geojson",
};

const lightenColor = (hexColor: string, amount = 0.25) => {
  const hex = hexColor.replace("#", "");
  const num = parseInt(hex, 16);
  const r = num >> 16;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const mix = (channel: number) =>
    Math.min(255, Math.round(channel + (255 - channel) * amount));
  return `#${[mix(r), mix(g), mix(b)]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
};

const normalizeGeometry = (feature: GeoJSONFeature): PolygonCoordinates[] => {
  if (feature.geometry.type === "Polygon") {
    return [feature.geometry.coordinates];
  }
  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates;
  }
  return [];
};

const calculateCentroid = (polygons: PolygonCoordinates[]): Coordinates => {
  let totalLat = 0;
  let totalLng = 0;
  let count = 0;

  polygons.forEach((polygon) => {
    const outerRing = polygon[0];
    if (!outerRing) return;
    outerRing.forEach(([lng, lat]) => {
      totalLat += lat;
      totalLng += lng;
      count += 1;
    });
  });

  if (!count) {
    return { ...MAP_CENTER };
  }

  return {
    lat: totalLat / count,
    lng: totalLng / count,
  };
};

const parseDistrictFeature = (
  feature: GeoJSONFeature,
): DistrictShape | null => {
  const key = feature.properties.name as string | undefined;
  if (!key || !DISTRICT_META[key]) return null;
  const meta = DISTRICT_META[key];
  const polygons = normalizeGeometry(feature);

  return {
    key,
    id: meta.id,
    name: meta.displayName,
    summary: meta.summary,
    color: meta.color,
    centroid: calculateCentroid(polygons),
    polygons,
  };
};

const parseNeighborhoodFeature = (
  feature: GeoJSONFeature,
): NeighborhoodShape | null => {
  const admNm = feature.properties.adm_nm as string | undefined;
  const admCd = (feature.properties.adm_cd2 ?? feature.properties.adm_cd) as
    | string
    | undefined;

  if (!admNm || !admCd) return null;
  const segments = admNm.split(" ").filter(Boolean);
  if (segments.length < 3) return null;
  const districtKey = segments[1];
  if (!DISTRICT_META[districtKey]) return null;
  const name = segments[segments.length - 1];
  const polygons = normalizeGeometry(feature);

  return {
    admCd,
    name,
    fullName: admNm,
    districtKey,
    centroid: calculateCentroid(polygons),
    polygons,
  };
};

const loadKakaoMapSdk = (appKey: string) =>
  new Promise<KakaoNamespace>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("window is undefined"));
      return;
    }

    if (window.kakao?.maps) {
      resolve(window.kakao);
      return;
    }

    const existingScript = document.getElementById("kakao-map-sdk");
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => resolve(window.kakao));
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao) {
        reject(new Error("kakao object missing"));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () =>
      reject(new Error("카카오 지도 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

const MapPage = () => {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const overlayRef = useRef<KakaoCustomOverlay | null>(null);
  const currentLocationMarkerRef = useRef<KakaoMarker | null>(null);
  const currentLocationCircleRef = useRef<KakaoCircle | null>(null);
  const polygonGroupRef = useRef<Record<string, KakaoPolygon[]>>({});
  const geocoderRef = useRef<KakaoGeocoder | null>(null);

  const [districtShapes, setDistrictShapes] = useState<DistrictShape[]>([]);
  const [neighborhoodShapes, setNeighborhoodShapes] = useState<
    NeighborhoodShape[]
  >([]);
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictShape | null>(null);
  const [hoveredArea, setHoveredArea] = useState<HoverInfo | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "고양시 행정구역 데이터를 불러오는 중입니다...",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRequestingBoard, setIsRequestingBoard] = useState(false);
  const [lastKnownLocation, setLastKnownLocation] =
    useState<Coordinates | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const [focusedNeighborhoodId, setFocusedNeighborhoodId] = useState<
    string | null
  >(null);
  const [pendingAdmCd, setPendingAdmCd] = useState<string | null>(null);

  const neighborhoodsInSelectedDistrict = useMemo(() => {
    if (!selectedDistrict) return [];
    return neighborhoodShapes.filter(
      (neighborhood) => neighborhood.districtKey === selectedDistrict.key,
    );
  }, [selectedDistrict, neighborhoodShapes]);

  const clearPolygons = useCallback(() => {
    Object.values(polygonGroupRef.current).forEach((group) => {
      group.forEach((polygon) => polygon.setMap(null));
    });
    polygonGroupRef.current = {};
    overlayRef.current?.setMap(null);
    setHoveredArea(null);
  }, []);

  const handleRestNavigation = useCallback(
    async (target: { id: string; name: string }) => {
      setIsRequestingBoard(true);
      setStatusMessage(`${target.name} 게시판으로 이동 중입니다...`);

      try {
        const response = await fetch("/api/regions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            regionId: target.id,
          }),
        });

        if (!response.ok) {
          throw new Error("게시판 이동 요청이 실패했습니다.");
        }

        const payload = await response.json();
        const redirectUrl = payload?.redirectUrl ?? `/board/${target.id}`;
        router.push(redirectUrl);
        setIsRequestingBoard(false);
      } catch (navigationError) {
        setIsRequestingBoard(false);
        setErrorMessage(
          navigationError instanceof Error
            ? navigationError.message
            : "게시판 이동에 실패했습니다.",
        );
        setStatusMessage("다시 행정동을 선택해주세요.");
      }
    },
    [router],
  );

  const drawDistrictPolygons = useCallback(() => {
    const kakao = window.kakao;
    if (!kakao?.maps || !mapRef.current || !districtShapes.length) return;

    clearPolygons();
    const bounds = new kakao.maps.LatLngBounds();

    districtShapes.forEach((district) => {
      const group: KakaoPolygon[] = [];
      district.polygons.forEach((polygonCoords) => {
        const path = polygonCoords.map((ring) =>
          ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng)),
        );
        const polygon = new kakao.maps.Polygon({
          path,
          strokeWeight: 2,
          strokeColor: district.color,
          strokeOpacity: 0.95,
          fillColor: district.color,
          fillOpacity: 0.3,
        });
        polygon.setMap(mapRef.current);
        group.push(polygon);
        path.forEach((ring) => ring.forEach((latLng) => bounds.extend(latLng)));

        const showTooltip = (latLng?: KakaoLatLng) => {
          if (!overlayRef.current) return;
          const position =
            latLng ??
            new kakao.maps.LatLng(district.centroid.lat, district.centroid.lng);
          overlayRef.current.setContent(
            `<div class="map-tooltip">
                <strong>${district.name}</strong>
                <p>${district.summary}</p>
              </div>`,
          );
          overlayRef.current.setPosition(position);
          overlayRef.current.setMap(mapRef.current);
          setHoveredArea({
            id: district.id,
            name: district.name,
            level: "district",
          });
          polygonGroupRef.current[district.key]?.forEach((poly) =>
            poly.setOptions({ fillOpacity: 0.5 }),
          );
        };

        const hideTooltip = () => {
          overlayRef.current?.setMap(null);
          setHoveredArea((prev) => (prev?.id === district.id ? null : prev));
          polygonGroupRef.current[district.key]?.forEach((poly) =>
            poly.setOptions({ fillOpacity: 0.3 }),
          );
        };

        kakao.maps.event.addListener(
          polygon,
          "mouseover",
          (mouseEvent: KakaoMouseEvent) => showTooltip(mouseEvent.latLng),
        );
        kakao.maps.event.addListener(
          polygon,
          "mousemove",
          (mouseEvent: KakaoMouseEvent) =>
            overlayRef.current?.setPosition(mouseEvent.latLng),
        );
        kakao.maps.event.addListener(polygon, "mouseout", hideTooltip);
        kakao.maps.event.addListener(polygon, "click", () => {
          setSelectedDistrict(district);
          setStatusMessage(`${district.name} 행정동 지도를 불러왔습니다.`);
        });
      });

      polygonGroupRef.current[district.key] = group;
    });

    if (!bounds.isEmpty()) {
      mapRef.current.setBounds(bounds);
    }
  }, [clearPolygons, districtShapes]);

  const drawNeighborhoodPolygons = useCallback(
    (district: DistrictShape) => {
      const kakao = window.kakao;
      if (!kakao?.maps || !mapRef.current) return;

      const neighborhoods = neighborhoodShapes.filter(
        (neighborhood) => neighborhood.districtKey === district.key,
      );
      if (!neighborhoods.length) return;

      clearPolygons();
      const bounds = new kakao.maps.LatLngBounds();

      neighborhoods.forEach((neighborhood) => {
        const group: KakaoPolygon[] = [];
        const baseFillOpacity =
          focusedNeighborhoodId === neighborhood.admCd ? 0.75 : 0.55;
        neighborhood.polygons.forEach((polygonCoords) => {
          const path = polygonCoords.map((ring) =>
            ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng)),
          );
          const polygon = new kakao.maps.Polygon({
            path,
            strokeWeight: 1.5,
            strokeColor: district.color,
            strokeOpacity: 0.95,
            fillColor: lightenColor(district.color, 0.4),
            fillOpacity: baseFillOpacity,
          });
          polygon.setMap(mapRef.current);
          group.push(polygon);
          path.forEach((ring) =>
            ring.forEach((latLng) => bounds.extend(latLng)),
          );

          const showTooltip = (latLng?: KakaoLatLng) => {
            if (!overlayRef.current) return;
            const position =
              latLng ??
              new kakao.maps.LatLng(
                neighborhood.centroid.lat,
                neighborhood.centroid.lng,
              );
            overlayRef.current.setContent(
              `<div class="map-tooltip">
                  <strong>${neighborhood.name}</strong>
                  <p>${neighborhood.fullName}</p>
                </div>`,
            );
            overlayRef.current.setPosition(position);
            overlayRef.current.setMap(mapRef.current);
            setHoveredArea({
              id: neighborhood.admCd,
              name: neighborhood.name,
              level: "neighborhood",
            });
            polygonGroupRef.current[neighborhood.admCd]?.forEach((poly) =>
              poly.setOptions({ fillOpacity: 0.75 }),
            );
          };

          const hideTooltip = () => {
            overlayRef.current?.setMap(null);
            setHoveredArea((prev) =>
              prev?.id === neighborhood.admCd ? null : prev,
            );
            polygonGroupRef.current[neighborhood.admCd]?.forEach((poly) =>
              poly.setOptions({
                fillOpacity:
                  focusedNeighborhoodId === neighborhood.admCd ? 0.75 : 0.55,
              }),
            );
          };

          kakao.maps.event.addListener(
            polygon,
            "mouseover",
            (mouseEvent: KakaoMouseEvent) => showTooltip(mouseEvent.latLng),
          );
          kakao.maps.event.addListener(
            polygon,
            "mousemove",
            (mouseEvent: KakaoMouseEvent) =>
              overlayRef.current?.setPosition(mouseEvent.latLng),
          );
          kakao.maps.event.addListener(polygon, "mouseout", hideTooltip);
          kakao.maps.event.addListener(polygon, "click", () => {
            setFocusedNeighborhoodId(neighborhood.admCd);
            handleRestNavigation({
              id: neighborhood.admCd,
              name: neighborhood.name,
            });
          });
        });

        polygonGroupRef.current[neighborhood.admCd] = group;
      });

      if (!bounds.isEmpty()) {
        mapRef.current.setBounds(bounds);
      }
    },
    [
      clearPolygons,
      focusedNeighborhoodId,
      handleRestNavigation,
      neighborhoodShapes,
    ],
  );

  const highlightNeighborhoodByAdmCd = useCallback(
    (admCd: string) => {
      const neighborhood = neighborhoodShapes.find(
        (item) => item.admCd === admCd,
      );
      if (!neighborhood) {
        return false;
      }
      const district = districtShapes.find(
        (item) => item.key === neighborhood.districtKey,
      );
      if (!district) {
        return false;
      }

      setSelectedDistrict(district);
      setFocusedNeighborhoodId(admCd);
      setStatusMessage(`${neighborhood.fullName} 기준으로 지도를 맞췄습니다.`);

      const kakao = window.kakao;
      if (kakao?.maps && mapRef.current) {
        const latLng = new kakao.maps.LatLng(
          neighborhood.centroid.lat,
          neighborhood.centroid.lng,
        );
        mapRef.current.panTo(latLng);
      }

      return true;
    },
    [districtShapes, neighborhoodShapes],
  );

  useEffect(() => {
    if (!pendingAdmCd) return;
    const resolved = highlightNeighborhoodByAdmCd(pendingAdmCd);
    if (resolved) {
      setPendingAdmCd(null);
    }
  }, [highlightNeighborhoodByAdmCd, pendingAdmCd]);

  const resolveRegionFromCoords = useCallback(
    (latitude: number, longitude: number) => {
      const kakao = window.kakao;
      if (!kakao?.maps?.services || !geocoderRef.current) {
        return;
      }
      geocoderRef.current.coord2RegionCode(
        longitude,
        latitude,
        (result: KakaoRegionCodeResult[], status: string) => {
          if (status !== kakao.maps.services.Status.OK || !result.length) {
            return;
          }
          const legalDistrict = result.find((item) => item.region_type === "B");
          const admCd = legalDistrict?.code ?? result[0]?.code;
          if (!admCd) {
            return;
          }
          if (!highlightNeighborhoodByAdmCd(admCd)) {
            setPendingAdmCd(admCd);
          }
        },
      );
    },
    [highlightNeighborhoodByAdmCd],
  );

  const locateUser = useCallback(() => {
    if (!navigator.geolocation || !window.kakao?.maps || !mapRef.current) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const kakao = window.kakao;
        const latLng = new kakao.maps.LatLng(latitude, longitude);
        setLastKnownLocation({ lat: latitude, lng: longitude });

        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setMap(null);
        }
        if (currentLocationCircleRef.current) {
          currentLocationCircleRef.current.setMap(null);
        }

        currentLocationMarkerRef.current = new kakao.maps.Marker({
          position: latLng,
          map: mapRef.current,
        });

        currentLocationCircleRef.current = new kakao.maps.Circle({
          center: latLng,
          radius: 150,
          strokeWeight: 2,
          strokeColor: "#0f172a",
          strokeOpacity: 0.4,
          fillColor: "#38bdf8",
          fillOpacity: 0.2,
        });
        currentLocationCircleRef.current.setMap(mapRef.current);
        setStatusMessage("현재 위치를 기준으로 지도를 조정했습니다.");
        resolveRegionFromCoords(latitude, longitude);
      },
      () => {
        setStatusMessage(
          "현재 위치를 가져올 수 없습니다. 브라우저 권한을 확인해주세요.",
        );
      },
    );
  }, [resolveRegionFromCoords]);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const [districtResponse, neighborhoodResponse] = await Promise.all([
          fetch(GEOJSON_ENDPOINTS.districts),
          fetch(GEOJSON_ENDPOINTS.neighborhoods),
        ]);

        if (!districtResponse.ok || !neighborhoodResponse.ok) {
          throw new Error("고양시 지오데이터를 불러오지 못했습니다.");
        }

        const districtJson = await districtResponse.json();
        const neighborhoodJson = await neighborhoodResponse.json();

        const districts = (districtJson.features as GeoJSONFeature[])
          .map(parseDistrictFeature)
          .filter(Boolean) as DistrictShape[];
        districts.sort(
          (a, b) =>
            DISTRICT_ORDER.indexOf(a.key) - DISTRICT_ORDER.indexOf(b.key),
        );

        const neighborhoods = (neighborhoodJson.features as GeoJSONFeature[])
          .map(parseNeighborhoodFeature)
          .filter(Boolean) as NeighborhoodShape[];

        setDistrictShapes(districts);
        setNeighborhoodShapes(neighborhoods);
        setStatusMessage(DEFAULT_STATUS_MESSAGE);
      } catch (geoError) {
        setErrorMessage(
          geoError instanceof Error
            ? geoError.message
            : "고양시 지오데이터를 로드하는 중 문제가 발생했습니다.",
        );
        setStatusMessage("지도를 다시 불러와 주세요.");
      } finally {
        setIsGeoLoading(false);
      }
    };

    loadGeoData();
  }, []);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainerRef.current) return;

      const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
      if (!kakaoAppKey) {
        setErrorMessage("NEXT_PUBLIC_KAKAO_MAP_KEY 환경 변수를 설정해주세요.");
        setStatusMessage("카카오 지도를 초기화할 수 없습니다.");
        return;
      }

      try {
        const kakao = await loadKakaoMapSdk(kakaoAppKey);
        mapRef.current = new kakao.maps.Map(mapContainerRef.current, {
          center: new kakao.maps.LatLng(MAP_CENTER.lat, MAP_CENTER.lng),
          level: 9,
        });
        overlayRef.current = new kakao.maps.CustomOverlay({
          yAnchor: 1,
          zIndex: 3,
        });
        geocoderRef.current = new kakao.maps.services.Geocoder();
        locateUser();
        setIsMapReady(true);
      } catch (sdkError) {
        setErrorMessage(
          sdkError instanceof Error
            ? sdkError.message
            : "카카오 지도 초기화 중 오류가 발생했습니다.",
        );
        setStatusMessage("지도 로드에 실패했습니다.");
      }
    };

    initializeMap();

    return () => {
      clearPolygons();
      overlayRef.current?.setMap(null);
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
      if (currentLocationCircleRef.current) {
        currentLocationCircleRef.current.setMap(null);
      }
    };
  }, [clearPolygons, locateUser]);

  useEffect(() => {
    if (!isMapReady) return;
    if (selectedDistrict) {
      drawNeighborhoodPolygons(selectedDistrict);
    } else {
      drawDistrictPolygons();
    }
  }, [
    drawDistrictPolygons,
    drawNeighborhoodPolygons,
    isMapReady,
    selectedDistrict,
  ]);

  const handleResetView = () => {
    setSelectedDistrict(null);
    setStatusMessage(DEFAULT_STATUS_MESSAGE);
    setIsRequestingBoard(false);
    setFocusedNeighborhoodId(null);
  };

  const renderSideList = () => {
    if (isGeoLoading) {
      return (
        <p className="text-sm text-slate-500">
          고양시 행정경계를 불러오는 중입니다...
        </p>
      );
    }

    if (!selectedDistrict) {
      return (
        <div className="space-y-3">
          {districtShapes.map((district) => (
            <button
              key={district.key}
              onClick={() => setSelectedDistrict(district)}
              className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-400"
            >
              <p className="text-sm uppercase text-slate-400">구 선택</p>
              <p className="text-xl font-bold text-slate-900">
                {district.name}
              </p>
              <p className="text-sm text-slate-500">{district.summary}</p>
            </button>
          ))}
        </div>
      );
    }

    if (!neighborhoodsInSelectedDistrict.length) {
      return (
        <p className="text-sm text-slate-500">
          행정동 데이터를 불러오는 중입니다. 잠시만 기다려주세요.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {neighborhoodsInSelectedDistrict.map((neighborhood) => (
          <div
            key={neighborhood.admCd}
            className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-400"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-slate-400">행정동</p>
                <p className="text-lg font-semibold text-slate-900">
                  {neighborhood.name}
                </p>
                <p className="text-sm text-slate-500">
                  {neighborhood.fullName}
                </p>
              </div>
              <span
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor:
                    DISTRICT_META[neighborhood.districtKey]?.color ?? "#334155",
                }}
              />
            </div>
            <p className="mt-3 text-xs font-medium text-slate-400">
              행정동 코드 {neighborhood.admCd}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setFocusedNeighborhoodId(neighborhood.admCd);
                  handleRestNavigation({
                    id: neighborhood.admCd,
                    name: neighborhood.name,
                  });
                }}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={isRequestingBoard}
              >
                게시판 이동
              </button>
              <button
                onClick={() => {
                  const kakao = window.kakao;
                  if (!kakao?.maps || !mapRef.current) return;
                  setFocusedNeighborhoodId(neighborhood.admCd);
                  const latLng = new kakao.maps.LatLng(
                    neighborhood.centroid.lat,
                    neighborhood.centroid.lng,
                  );
                  mapRef.current.panTo(latLng);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400"
              >
                지도에서 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            고양시 인터랙티브 맵
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
            현재 위치의 주변 사람들과 일상을 공유해보세요
          </h1>
          <p className="mt-3 text-base text-slate-600">
            원하는 지역을 선택하면 해당 게시판으로 이동합니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="rounded-[2rem] bg-white p-4 shadow-xl shadow-slate-200/60">
            <div
              ref={mapContainerRef}
              className="h-[620px] w-full rounded-[1.5rem]"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">
                {statusMessage}
              </p>
              <div className="flex items-center gap-2">
                {selectedDistrict && (
                  <button
                    onClick={handleResetView}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-slate-400"
                  >
                    구 선택으로 돌아가기
                  </button>
                )}
                <button
                  onClick={locateUser}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:border-slate-400"
                >
                  내 위치 새로고침
                </button>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-200/50">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                선택 정보
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {selectedDistrict
                  ? selectedDistrict.name
                  : (hoveredArea?.name ?? "")}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                {selectedDistrict
                  ? "행정동을 클릭하면 REST API가 호출되고 해당 게시판으로 이동합니다."
                  : hoveredArea
                    ? hoveredArea.level === "district"
                      ? "지도 위 구 정보를 확인하고 클릭해보세요."
                      : "행정동을 클릭하면 게시판으로 이동합니다."
                    : "각 구 경계 위로 마우스를 올리고 클릭해보세요."}
              </p>

              {lastKnownLocation && (
                <div className="mt-4 rounded-xl bg-slate-900/90 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-200">
                    현재 위치
                  </p>
                  <p className="mt-1 text-sm">
                    위도 {lastKnownLocation.lat.toFixed(4)}, 경도{" "}
                    {lastKnownLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}

              {errorMessage && (
                <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-600">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-200/50">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {selectedDistrict
                  ? `${selectedDistrict.name} 행정동`
                  : "구 선택"}
              </p>
              <div className="mt-4 max-h-[420px] overflow-y-auto pr-2">
                {renderSideList()}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .map-tooltip {
          background: rgba(15, 23, 42, 0.92);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.35);
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .map-tooltip strong {
          font-size: 0.95rem;
        }

        .map-tooltip p {
          margin: 0;
          font-weight: 500;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
};

export default MapPage;
