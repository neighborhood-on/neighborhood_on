import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 
import { ObjectId } from 'mongodb';

interface Post {
    _id: ObjectId;
    title: string;
    content: string; 
    author: string; 
    neighborhoodId: string; 
    views: number; 
    upvotes: number; 
    timestamp: Date; 
}

export async function GET(
  request: Request,
) {
  
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const neighborhoodId = pathSegments[pathSegments.length - 1]; 
  
  if (!neighborhoodId || neighborhoodId === 'posts') {
    return NextResponse.json(
      { message: "유효한 동네 ID가 제공되지 않았습니다." },
      { status: 400 }
    );
  }
  
  try {
    const client = await clientPromise; 
    const db = client.db(process.env.MONGODB_DB);

    const collection = db.collection<Post>("posts"); 

    const posts = await collection
      .find({ neighborhoodId: neighborhoodId }) 
      .sort({ timestamp: -1 }) 
      .toArray();
      
    const sanitizedPosts = posts.map(post => ({
        ...post,
        _id: post._id.toString(), 
        timestamp: post.timestamp.toISOString(), 
    }));

    return NextResponse.json(sanitizedPosts);
    
  } catch (error) {
    console.error(`게시글 로드 실패 (ID: ${neighborhoodId}):`, error);
    return NextResponse.json(
      { message: "데이터베이스에서 게시글을 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const neighborhoodId = pathSegments[pathSegments.length - 1]; 
    
    if (!neighborhoodId || neighborhoodId === 'posts') {
        return NextResponse.json({ message: "유효한 동네 ID가 필요합니다." }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { title, content, category, authorName } = body;
        
        if (!title || !content || !category || !authorName) {
            return NextResponse.json({ message: "필수 항목이 누락되었습니다." }, { status: 400 });
        }

        const client = await clientPromise; 
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(neighborhoodId);

        const newPost = {
            title: title,
            content: content,
            authorName: authorName,
            category: category,
            views: 0,
            upvotes: 0,
            date: new Date(),
        };

        const result = await collection.insertOne(newPost);

        return NextResponse.json(
            { 
                message: "게시글이 성공적으로 작성되었습니다.",
                postId: result.insertedId.toString()
            }, 
            { status: 201 } 
        );

    } catch (error) {
        console.error(`게시글 작성 실패 (컬렉션: ${neighborhoodId}):`, error);
        return NextResponse.json(
            { message: "게시글 작성 중 서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}