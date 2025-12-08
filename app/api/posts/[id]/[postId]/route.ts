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

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string; postId: string }> }
) {
    const resolvedParams = await context.params;
    const { id: neighborhoodId, postId } = resolvedParams;

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
        const { action, userEmail } = body;

        if (action !== 'upvote') {
            return NextResponse.json(
                { message: "지원하지 않는 액션입니다. 'upvote'만 가능합니다." },
                { status: 400 }
            );
        }

        if (!userEmail) {
            return NextResponse.json(
                { message: "사용자 인증 정보가 필요합니다." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const collection = db.collection(neighborhoodId);

        const post = await collection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return NextResponse.json(
                { message: "게시글을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        const upvotedBy = post.upvotedBy || [];
        
        if (upvotedBy.includes(userEmail)) {
            return NextResponse.json(
                { message: "이미 추천한 게시글입니다.", alreadyUpvoted: true },
                { status: 400 }
            );
        }

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { 
                $inc: { upvotes: 1 },
                $push: { upvotedBy: userEmail } as any
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { message: "게시글을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "추천이 완료되었습니다.",
            upvotes: result.upvotes
        });

    } catch (error) {
        console.error(`추천 처리 실패 (컬렉션: ${neighborhoodId}, ID: ${postId}):`, error);
        return NextResponse.json(
            { message: "추천 처리에 실패했습니다." },
            { status: 500 }
        );
    }
}