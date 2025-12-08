import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "로그인이 필요합니다." },
                { status: 401 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { message: "사용자를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            point: user.point || 0,
            location: user.location || ''
        });

    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return NextResponse.json(
            { message: "사용자 정보를 가져오는 데 실패했습니다." },
            { status: 500 }
        );
    }
}

