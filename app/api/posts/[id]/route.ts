import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 
import { ObjectId } from 'mongodb';
import type { Post } from '@/types/database';

// 게시글 목록 조회
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
    const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');

    // 지역 ID를 컬렉션 이름으로 사용
    const collection = db.collection<Post>(neighborhoodId); 

    const posts = await collection
      .find({}) 
      .sort({ date: -1 }) 
      .toArray();
      
    const sanitizedPosts = posts.map((post) => ({
        ...post,
        _id: post._id?.toString() || '', 
        date: post.date.toISOString(), 
    }));

    return NextResponse.json(sanitizedPosts);
    
  } catch (error) {
    console.error(`게시글 로드 실패 (컬렉션: ${neighborhoodId}):`, error);
    return NextResponse.json(
      { message: "데이터베이스에서 게시글을 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}

// 게시글 작성
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
        const { title, content, category, authorName, authorEmail } = body;
        
        if (!title || !content || !category || !authorName) {
            return NextResponse.json({ message: "필수 항목이 누락되었습니다." }, { status: 400 });
        }

        const client = await clientPromise; 
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const collection = db.collection(neighborhoodId);

        const newPost = {
            title: title,
            content: content,
            authorName: authorName,
            category: category,
            views: 0,
            upvotes: 0,
            upvotedBy: [],
            date: new Date(),
            comments: [],
        };

        const result = await collection.insertOne(newPost);

        if (authorEmail) {
            try {
                const usersCollection = db.collection('users');
                console.log('글쓰기 포인트 지급 시도 - Email:', authorEmail);
                const pointResult = await usersCollection.updateOne(
                    { email: authorEmail },
                    { $inc: { point: 10 } }
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

        return NextResponse.json(
            { 
                message: "게시글이 성공적으로 작성되었습니다. (+10 포인트)",
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

