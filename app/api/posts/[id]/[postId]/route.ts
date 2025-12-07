import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; postId: string }> } 
) {

    const resolvedParams = await context.params; 
    
    const { id: neighborhoodId, postId } = resolvedParams;

    if (!neighborhoodId || !postId) {
        return NextResponse.json({ message: "동네 ID 또는 게시글 ID가 누락되었습니다." }, { status: 400 });
    }
    
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(neighborhoodId);

        const objectId = new ObjectId(postId);

        await collection.updateOne(
            { _id: objectId },
            { $inc: { views: 1 } }
        );

        const post = await collection.findOne({ _id: objectId });

        if (!post) {
            return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
        }
        
        const sanitizedPost = {
            ...post,
            _id: post._id.toString(),
            date: post.date.toISOString(), 
        };

        return NextResponse.json(sanitizedPost);

    } catch (error: any) {
        if (error.message.includes('Invalid BSON ObjectId')) {
             return NextResponse.json({ message: "유효하지 않은 게시글 ID입니다." }, { status: 400 });
        }
        console.error(`게시글 상세 조회 실패 (ID: ${postId}):`, error);
        return NextResponse.json(
            { message: "게시글을 가져오는 데 실패했습니다." },
            { status: 500 }
        );
    }
}