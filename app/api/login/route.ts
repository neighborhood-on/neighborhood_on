import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';
import type { User } from '@/types/database';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    return NextResponse.json({ message: '로그인 성공' }, { status: 200 });
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 500 });
  }
}
