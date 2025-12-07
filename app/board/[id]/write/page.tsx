"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CATEGORIES: string[] = ['질문', '자유', '맛집', '정보', '모임'];


const WritePostPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();

  const neighborhoodId = params.id as string;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      alert('글 작성을 위해 로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!neighborhoodId) {
      alert('유효하지 않은 동네 정보입니다.');
      router.push('/map');
    }
  }, [status, neighborhoodId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    if (status !== 'authenticated' || !session?.user?.name) {
      setError('작성자 정보(세션)를 찾을 수 없습니다. 다시 로그인해 주세요.');
      return;
    }

    setIsSubmitting(true);

    const postData = {
      title: title,
      content: content,
      category: category,
      authorName: session.user.name, 
    };
    
    try {
      const response = await fetch(`/api/posts/${neighborhoodId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 작성에 실패했습니다.');
      }

      alert('게시글이 성공적으로 작성되었습니다!');
      router.push(`/board/${neighborhoodId}`);

    } catch (err: any) {
      console.error('API Error:', err);
      setError(`작성 중 오류 발생: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || status === 'unauthenticated' || !neighborhoodId) {
    return (
      <div className="write-container">
        <p className="loading-message">
          {status === 'loading' ? '세션 및 권한 확인 중...' : '로그인 페이지로 이동 중...'}
        </p>
      </div>
    );
  }

  return (
    <div className="write-container">
      <h1 className="write-title">새 게시글 작성</h1>
      
      <div className="author-info">
        <p>작성자: <strong>{session?.user?.name || '알 수 없음'}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className="write-form">
        
        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="제목을 입력하세요 (최대 100자)"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요."
            disabled={isSubmitting}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="btn-cancel"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit"
          >
            {isSubmitting ? '작성 중...' : '게시글 등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePostPage;