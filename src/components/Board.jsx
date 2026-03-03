import { useState } from 'react';
import { MessageSquarePlus, Trash2, Send, Loader2 } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
        isError ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}
    >
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} className="ml-3 underline">
        닫기
      </button>
    </div>
  );
}

export default function Board() {
  const { posts, loading, toast, setToast, createPost, deletePost } = usePosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = title.trim();
    const c = content.trim();
    if (!t) return;
    setSubmitting(true);
    await createPost({ title: t, content: c });
    setSubmitting(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquarePlus className="w-7 h-7 text-indigo-600" />
            게시판
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-8">
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-3"
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            등록
          </button>
        </form>

        <section>
          <h2 className="text-lg font-semibold mb-4">글 목록</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              로딩 중...
            </div>
          ) : posts.length === 0 ? (
            <p className="text-slate-500">아직 글이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between items-start gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">{post.content || '-'}</p>
                    <time className="text-xs text-slate-400 mt-2 block">
                      {post.created_at ? new Date(post.created_at).toLocaleString('ko-KR') : ''}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 shrink-0"
                    aria-label="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
