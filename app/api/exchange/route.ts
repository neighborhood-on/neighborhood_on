import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ message: "유효하지 않은 전환 금액입니다." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const usersCollection = db.collection('users');

        // 최신 사용자 정보 가져오기 (포인트 확인)
        const user = await usersCollection.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
        }

        const currentPoint = user.point || 0;

        if (currentPoint < amount) {
            return NextResponse.json({ message: "보유 포인트가 부족합니다." }, { status: 400 });
        }

        // 포인트 차감 업데이트
        const updateResult = await usersCollection.updateOne(
            { email: session.user.email },
            {
                $inc: { point: -amount },
                $push: {
                    pointHistory: {
                        type: 'exchange',
                        amount: -amount,
                        description: '고양페이 전환',
                        date: new Date()
                    }
                } as any // TypeScript 오류 방지용 (스키마가 유동적일 경우)
            }
        );

        if (updateResult.modifiedCount === 0) {
            throw new Error("포인트 업데이트 실패");
        }

        return NextResponse.json({
            message: "전환이 완료되었습니다.",
            remainingPoint: currentPoint - amount
        });

    } catch (error) {
        console.error("포인트 전환 오류:", error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
