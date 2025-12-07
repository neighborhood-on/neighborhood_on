import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// 개발용: 모든 컬렉션 목록과 문서 개수 확인
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');

        // 모든 컬렉션 목록 가져오기
        const collections = await db.listCollections().toArray();
        
        // 각 컬렉션의 문서 개수 확인
        const collectionStats = await Promise.all(
            collections.map(async (col) => {
                const count = await db.collection(col.name).countDocuments();
                return {
                    name: col.name,
                    count: count,
                    type: col.name === 'users' ? 'users' : 
                          col.name.match(/^\d+$/) ? 'board' : 'other'
                };
            })
        );

        // 정렬: users 먼저, 그 다음 게시판 컬렉션들
        collectionStats.sort((a, b) => {
            if (a.type === 'users') return -1;
            if (b.type === 'users') return 1;
            if (a.type === 'board' && b.type === 'board') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        const totalBoards = collectionStats.filter(c => c.type === 'board').length;
        const totalPosts = collectionStats
            .filter(c => c.type === 'board')
            .reduce((sum, c) => sum + c.count, 0);
        const totalUsers = collectionStats.find(c => c.name === 'users')?.count || 0;

        return NextResponse.json({
            success: true,
            summary: {
                totalCollections: collections.length,
                totalBoards: totalBoards,
                totalPosts: totalPosts,
                totalUsers: totalUsers
            },
            collections: collectionStats
        });

    } catch (error) {
        console.error('컬렉션 조회 오류:', error);
        return NextResponse.json(
            { success: false, message: '컬렉션 정보를 가져오는 데 실패했습니다.' },
            { status: 500 }
        );
    }
}

