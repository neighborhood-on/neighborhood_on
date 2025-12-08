import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ email: string }> }
) {
    const { email } = await params;

    if (!email) {
        return NextResponse.json(
            { message: "이메일이 필요합니다." },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { amount } = body;

        if (typeof amount !== 'number' || amount === 0) {
            return NextResponse.json(
                { message: "유효한 포인트 금액이 필요합니다." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const usersCollection = db.collection('users');

        const result = await usersCollection.findOneAndUpdate(
            { email: decodeURIComponent(email) },
            { $inc: { point: amount } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { message: "사용자를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "포인트가 업데이트되었습니다.",
            point: result.point || 0
        });

    } catch (error) {
        console.error(`포인트 업데이트 실패 (email: ${email}):`, error);
        return NextResponse.json(
            { message: "포인트 업데이트 중 서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

