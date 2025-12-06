import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type RegionRecord = {
  id: string;
  label: string;
};

let cachedRegions: RegionRecord[] | null = null;

const getRegionRecords = async (): Promise<RegionRecord[]> => {
  if (cachedRegions) return cachedRegions;
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "goyang-neighborhoods.geojson",
  );

  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as {
    features: Array<{
      properties?: {
        adm_nm?: string;
        adm_cd?: string;
        adm_cd2?: string;
      };
    }>;
  };

  cachedRegions =
    data.features
      ?.map((feature) => {
        const admNm = feature.properties?.adm_nm;
        const admCd = feature.properties?.adm_cd2 ?? feature.properties?.adm_cd;
        if (!admNm || !admCd) return null;
        return {
          id: admCd,
          label: admNm,
        };
      })
      .filter((record): record is RegionRecord => Boolean(record)) ?? [];

  return cachedRegions;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const regionId = body?.regionId;

    if (!regionId || typeof regionId !== "string") {
      return NextResponse.json(
        { message: "regionId 값이 필요합니다." },
        { status: 400 },
      );
    }

    const regions = await getRegionRecords();
    const match = regions.find((region) => region.id === regionId);
    if (!match) {
      return NextResponse.json(
        { message: "존재하지 않는 행정동입니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      redirectUrl: `/board/${regionId}`,
      label: match.label,
    });
  } catch {
    return NextResponse.json(
      { message: "요청을 처리할 수 없습니다." },
      { status: 500 },
    );
  }
}
