import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Comment } from '@/types/database';

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
        const { authorName, authorEmail, content } = body;

        if (!authorName || !content) {
            return NextResponse.json(
                { message: "작성자와 댓글 내용이 필요합니다." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const collection = db.collection(neighborhoodId);

        const newComment: Comment = {
            _id: new ObjectId(),
            authorName,
            content,
            date: new Date()
        };

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

        if (authorEmail) {
            try {
                const usersCollection = db.collection('users');
                console.log('포인트 지급 시도 - Email:', authorEmail);
                const pointResult = await usersCollection.updateOne(
                    { email: authorEmail },
                    { $inc: { point: 5 } }
                );
                console.log('포인트 업데이트 결과:', pointResult.matchedCount, '매칭,', pointResult.modifiedCount, '수정');
                
                if (pointResult.matchedCount === 0) {
                    console.error('사용자를 찾을 수 없음! Email:', authorEmail);
                }
            } catch (pointError) {
                console.error('포인트 지급 실패:', pointError);
            }
        } else {
            console.error('authorEmail이 없습니다!');
        }

        return NextResponse.json({
            message: "댓글이 추가되었습니다. (+5 포인트)",
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

