import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string; postId: string }> } 
) {
    try {
        const resolvedParams = await context.params; 
        const { id: neighborhoodId, postId } = resolvedParams;
        
        const { content, authorName } = await request.json(); 

        if (!neighborhoodId || !postId || !content || !authorName) {
            return NextResponse.json({ message: "필수 데이터(동네/게시글 ID, 내용, 작성자)가 누락되었습니다." }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(neighborhoodId);

        const objectId = new ObjectId(postId);
        
        const newComment = {
            _id: new ObjectId(), 
            authorName: authorName,
            content: content,
            date: new Date(),
        };

        const result = await collection.updateOne(
            { _id: objectId },
            { $push: { comments: newComment } } as any 
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "댓글을 추가할 게시글을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json(
            { 
                message: "댓글이 성공적으로 추가되었습니다.", 
                commentId: newComment._id.toString(),
                newComment: { 
                    ...newComment, 
                    _id: newComment._id.toString(), 
                    date: newComment.date.toISOString()
                }
            }, 
            { status: 201 }
        );

    } catch (error: any) {
        console.error("댓글 작성 중 서버 오류:", error);
        return NextResponse.json(
            { message: "댓글 작성 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}