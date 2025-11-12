import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('neighborhood_on'); // Use your database name
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: '회원가입 성공' }, { status: 201 });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json({ message: '회원가입에 실패했습니다.' }, { status: 500 });
  }
}
