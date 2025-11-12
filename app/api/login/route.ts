import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('neighborhood_on'); // Use your database name
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    // In a real application, you would create a session here (e.g., JWT, cookie)
    // For this example, we'll just return a success message.
    return NextResponse.json({ message: '로그인 성공' }, { status: 200 });
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 500 });
  }
}
