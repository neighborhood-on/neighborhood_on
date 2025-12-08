"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ChevronLeft = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const ThumbsUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12h4v-12h-4zm7-4h6c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4l-3 3v-7h-4V4h4zm-3-4v4H7V0h4z" /></svg>;
const Eye = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
const Tag = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48 2.34 4.54 0l6.3-6.3a2 2 0 0 0 0-2.83L13.83 2.5a2 2 0 0 0-2.83 0z" /><path d="M7 7h.01" /></svg>;

interface Comment {
    _id: string;
    authorName: string;
    content: string;
    date: string;
}

interface PostDetail {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    category: string;
    views: number;
    upvotes: number;
    date: string;
    comments?: Comment[];
}

const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
};

const PostDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();

    const neighborhoodId = params.id as string;
    const postId = params.postId as string;

    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [commentContent, setCommentContent] = useState('');
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

    const fetchPost = useCallback(async () => {
        if (!neighborhoodId || !postId) {
            setError("동네 또는 게시글 정보가 유효하지 않습니다.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/posts/${neighborhoodId}/${postId}`);

            if (response.status === 404) {
                setError("요청하신 게시글을 찾을 수 없습니다.");
                setPost(null);
                return;
            }

            if (!response.ok) {
                throw new Error('게시글 상세 API 호출 실패');
            }

            const data: PostDetail = await response.json();
            setPost(data);

        } catch (err: any) {
            console.error("게시글 상세 로드 오류:", err);
            setError(`데이터 로드 실패: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [neighborhoodId, postId]);

    const handleUpvote = async () => {
        if (status !== 'authenticated' || !session?.user?.email) {
            alert('추천하려면 로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch(`/api/posts/${neighborhoodId}/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'upvote',
                    userEmail: session.user.email
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.alreadyUpvoted) {
                    alert('이미 추천한 게시글입니다!');
                } else {
                    alert(result.message || '추천 처리 실패');
                }
                return;
            }

            setPost(prevPost => {
                if (!prevPost) return null;
                return {
                    ...prevPost,
                    upvotes: result.upvotes,
                };
            });

            alert('추천했습니다!');
        } catch (err: any) {
            alert(`추천 실패: ${err.message}`);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status !== 'authenticated' || !session?.user?.name) {
            alert('댓글 작성을 위해 로그인이 필요합니다.');
            return;
        }
        if (!commentContent.trim()) {
            alert('댓글 내용을 입력해 주세요.');
            return;
        }

        setIsCommentSubmitting(true);
        try {
            const response = await fetch(`/api/comments/${neighborhoodId}/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: commentContent,
                    authorName: session.user.name,
                    authorEmail: session.user.email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '댓글 작성 실패');
            }

            const result = await response.json();

            setPost(prevPost => {
                if (!prevPost) return null;
                const newComment: Comment = result.comment;

                return {
                    ...prevPost,
                    comments: [...(prevPost.comments || []), newComment],
                };
            });

            setCommentContent('');
            alert('댓글이 작성되었습니다! (+5 포인트)');

            sessionStorage.setItem('needRefreshPoint', 'true');

        } catch (err: any) {
            alert(`댓글 작성 실패: ${err.message}`);
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    if (isLoading) {
        return <div className="detail-container loading"><p>게시글을 불러오는 중입니다...</p></div>;
    }

    if (error) {
        return (
            <div className="detail-container error">
                <p>⚠️ {error}</p>
                <button onClick={() => router.back()} className="btn-back-list">
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (!post) {
        return <div className="detail-container error"><p>게시글 데이터가 존재하지 않습니다.</p></div>;
    }

    return (
        <div className="detail-container">
            <header className="detail-header">
                <button onClick={() => router.back()} className="btn-back-list">
                    <ChevronLeft className="icon-chevron" />
                    목록으로
                </button>
                <h1 className="detail-title">{post.title}</h1>
            </header>

            <div className="post-meta-line">
                <span className="meta-category"><Tag className="icon-tag-small" />{post.category}</span>
                <span className="meta-author"><User className="icon-user-small" />{post.authorName}</span>
                <span className="meta-time"><Clock className="icon-clock-small" />{formatTimeAgo(post.date)}</span>
            </div>

            <div className="post-meta-stats-line">
                <span className="meta-stat"><Eye className="icon-eye-small" />조회 {post.views.toLocaleString()}</span>
                <span className="meta-stat"><ThumbsUp className="icon-thumb-small" />추천 {post.upvotes.toLocaleString()}</span>
            </div>

            <hr className="content-divider" />

            <section className="post-content">
                <p>{post.content}</p>
            </section>

            <footer className="detail-footer">
                <button onClick={handleUpvote} className="btn-upvote">
                    <ThumbsUp className="icon-upvote-large" />
                    추천하기 ({post.upvotes.toLocaleString()})
                </button>
            </footer>

            <div className="comment-section">
                <h2>댓글 ({post.comments?.length || 0}개)</h2>
                <div className="comment-list">
                    {post.comments && post.comments.length > 0 ? (
                        post.comments
                            .filter(comment => comment && comment.authorName && comment.content)
                            .map(comment => (
                                <div key={comment._id} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.authorName}</span>
                                        <span className="comment-time">{formatTimeAgo(comment.date)}</span>
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                            ))
                    ) : (
                        <p className="no-comments-message">아직 댓글이 없습니다. 첫 댓글을 달아주세요!</p>
                    )}
                </div>

                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder={status === 'authenticated' ? "댓글을 입력하세요." : "로그인 후 댓글을 작성할 수 있습니다."}
                        disabled={!session?.user || isCommentSubmitting}
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={!session?.user || isCommentSubmitting}
                    >
                        {isCommentSubmitting ? '등록 중...' : '등록'}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .detail-container { max-width: 900px; margin: 40px auto; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .detail-header { display: flex; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                .btn-back-list { background: none; border: 1px solid #ccc; padding: 8px 15px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 15px; color: #555; transition: background 0.2s; }
                .btn-back-list:hover { background: #f0f0f0; }
                .detail-title { margin: 0 0 0 20px; font-size: 1.8em; font-weight: 700; color: #1e3a8a; flex-grow: 1; }
                .post-meta-line, .post-meta-stats-line { display: flex; gap: 15px; font-size: 0.9em; color: #777; margin-bottom: 10px; padding: 0 10px; }
                .meta-category, .meta-author, .meta-time, .meta-stat { display: flex; align-items: center; gap: 4px; }
                .meta-category { color: #3b82f6; font-weight: 600; }
                .content-divider { border: 0; height: 1px; background: #eee; margin: 20px 0; }
                .post-content { min-height: 250px; line-height: 1.8; color: #333; font-size: 1.1em; padding: 0 10px; white-space: pre-wrap; /* 줄바꿈 유지 */ }
                .detail-footer { text-align: center; padding: 30px 0 10px; }
                .btn-upvote { background: #4caf50; color: white; padding: 15px 30px; border: none; border-radius: 30px; cursor: pointer; font-size: 1.2em; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s; }
                .btn-upvote:hover { background: #43a047; }
                
                .comment-section { margin-top: 40px; padding: 25px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; }
                .comment-section h2 { font-size: 1.4em; color: #1e293b; font-weight: 700; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
                
                .comment-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; max-height: 600px; overflow-y: auto; }
                .comment-list::-webkit-scrollbar { width: 6px; }
                .comment-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                .comment-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                .comment-item { background: white; padding: 16px 20px; border-radius: 12px; border: 1px solid #e2e8f0; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .comment-item:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
                
                .comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .comment-author { font-weight: 600; color: #3b82f6; font-size: 0.95em; display: flex; align-items: center; gap: 6px; }
                .comment-author::before { content: '👤'; font-size: 1.1em; }
                .comment-time { color: #94a3b8; font-size: 0.85em; }
                
                .comment-content { color: #334155; font-size: 0.95em; line-height: 1.6; margin: 0; white-space: pre-wrap; word-break: break-word; }
                
                .no-comments-message { text-align: center; color: #94a3b8; padding: 40px 20px; font-size: 0.95em; }
                
                .comment-form { display: flex; flex-direction: column; gap: 12px; background: white; padding: 20px; border-radius: 12px; border: 2px solid #e2e8f0; }
                .comment-form textarea { width: 100%; padding: 14px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95em; resize: vertical; min-height: 80px; font-family: inherit; transition: border-color 0.2s; }
                .comment-form textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .comment-form textarea:disabled { background: #f1f5f9; cursor: not-allowed; }
                
                .comment-form button { align-self: flex-end; background: #3b82f6; color: white; padding: 10px 24px; border: none; border-radius: 8px; font-size: 0.95em; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .comment-form button:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
                .comment-form button:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }
            `}</style>
        </div>
    );
};

export default PostDetailPage;