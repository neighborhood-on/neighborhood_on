import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import clientPromise from '@/lib/mongodb';
import type { User } from '@/types/database';

export async function POST(request: Request) {
  try {
    const { name, email, password, location } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (선배님 구조에 맞춤)
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
      location: location || '', // 선택 사항
      point: 0, // 기본값 0
    };

    const result = await db.collection<User>('users').insertOne(newUser);

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
