import { ObjectId } from 'mongodb';

/**
 * Users 컬렉션 타입 정의
 */
export interface User {
    _id?: ObjectId;           // MongoDB 자동 생성 (생성 시 옵셔널)
    name: string;             // 이름[닉네임]
    email: string;            // 사실상 ID 역할
    password: string | null;  // 비밀번호 (해시 암호화, 소셜 계정은 null일 수 있음)
    location?: string;        // 관심 지역 (선택 사항)
    point: number;            // 포인트 (기본값 0)
}

/**
 * 댓글 타입 정의
 */
export interface Comment {
    _id?: ObjectId;           // 댓글 ID
    authorName: string;       // 댓글 작성자
    content: string;          // 댓글 내용
    date: Date;               // 댓글 작성일
}

/**
 * 게시글 타입 정의 (지역별 컬렉션)
 * Collection: 각 동네의 adm_cd2 값
 */
export interface Post {
    _id?: ObjectId;           // MongoDB 자동 생성 (생성 시 옵셔널)
    title: string;            // 제목
    content: string;          // 본문
    authorName: string;       // 작성자
    category: string;         // 카테고리
    views: number;            // 조회수
    upvotes: number;          // 추천수
    upvotedBy?: string[];     // 추천한 사용자 email 목록
    date: Date;               // 작성일
    comments: Comment[];      // 댓글 배열
}

/**
 * 카테고리 목록
 */
export const POST_CATEGORIES = ['질문', '자유', '맛집', '정보', '모임'] as const;
export type PostCategory = typeof POST_CATEGORIES[number];

