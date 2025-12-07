import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// 개발용: 특정 컬렉션의 모든 데이터 삭제
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ collectionName: string }> }
) {
    const { collectionName } = await params;

    // 안전장치: users 컬렉션은 삭제 불가
    if (collectionName === 'users') {
        return NextResponse.json(
            { success: false, message: 'users 컬렉션은 이 API로 삭제할 수 없습니다.' },
            { status: 403 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');

        // 컬렉션이 존재하는지 확인
        const collections = await db.listCollections({ name: collectionName }).toArray();
        
        if (collections.length === 0) {
            return NextResponse.json(
                { success: false, message: `컬렉션 '${collectionName}'이(가) 존재하지 않습니다.` },
                { status: 404 }
            );
        }

        // 삭제 전 문서 개수 확인
        const countBefore = await db.collection(collectionName).countDocuments();

        // 모든 문서 삭제
        const result = await db.collection(collectionName).deleteMany({});

        return NextResponse.json({
            success: true,
            message: `컬렉션 '${collectionName}'의 모든 데이터가 삭제되었습니다.`,
            deletedCount: result.deletedCount,
            collectionName: collectionName
        });

    } catch (error) {
        console.error(`컬렉션 삭제 오류 (${collectionName}):`, error);
        return NextResponse.json(
            { success: false, message: '데이터 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

