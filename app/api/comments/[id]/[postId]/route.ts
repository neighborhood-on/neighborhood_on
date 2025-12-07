import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Comment } from '@/types/database';

// 댓글 추가
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string; postId: string }> }
) {
    const { id: neighborhoodId, postId } = await params;

    if (!neighborhoodId || !postId) {
        return NextResponse.json(
            { message: "유효한 동네 ID와 게시글 ID가 필요합니다." },
            { status: 400 }
        );
    }

    if (!ObjectId.isValid(postId)) {
        return NextResponse.json(
            { message: "유효하지 않은 게시글 ID 형식입니다." },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { authorName, content } = body;

        if (!authorName || !content) {
            return NextResponse.json(
                { message: "작성자와 댓글 내용이 필요합니다." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const collection = db.collection(neighborhoodId);

        // 새 댓글 객체
        const newComment: Comment = {
            _id: new ObjectId(),
            authorName,
            content,
            date: new Date()
        };

        // 게시글의 comments 배열에 추가
        const result = await collection.updateOne(
            { _id: new ObjectId(postId) },
            { $push: { comments: newComment } } as any
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "게시글을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "댓글이 추가되었습니다.",
            comment: {
                ...newComment,
                _id: newComment._id?.toString(),
                date: newComment.date.toISOString()
            }
        }, { status: 201 });

    } catch (error) {
        console.error(`댓글 추가 실패 (컬렉션: ${neighborhoodId}, 게시글: ${postId}):`, error);
        return NextResponse.json(
            { message: "댓글 추가 중 서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

// 댓글 삭제
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; postId: string }> }
) {
    const { id: neighborhoodId, postId } = await params;

    if (!neighborhoodId || !postId) {
        return NextResponse.json(
            { message: "유효한 동네 ID와 게시글 ID가 필요합니다." },
            { status: 400 }
        );
    }

    if (!ObjectId.isValid(postId)) {
        return NextResponse.json(
            { message: "유효하지 않은 게시글 ID 형식입니다." },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { commentId } = body;

        if (!commentId || !ObjectId.isValid(commentId)) {
            return NextResponse.json(
                { message: "유효한 댓글 ID가 필요합니다." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const collection = db.collection(neighborhoodId);

        // comments 배열에서 특정 댓글 제거
        const result = await collection.updateOne(
            { _id: new ObjectId(postId) },
            { $pull: { comments: { _id: new ObjectId(commentId) } } } as any
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "게시글을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { message: "댓글을 찾을 수 없거나 이미 삭제되었습니다." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "댓글이 삭제되었습니다."
        });

    } catch (error) {
        console.error(`댓글 삭제 실패 (컬렉션: ${neighborhoodId}, 게시글: ${postId}):`, error);
        return NextResponse.json(
            { message: "댓글 삭제 중 서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

