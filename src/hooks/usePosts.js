import { useState, useEffect, useCallback } from 'react';
import { fetchPosts as fetchPostsApi, createPost as createPostApi, deletePost as deletePostApi } from '../services/boardService';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await fetchPostsApi();
    setLoading(false);
    if (err) {
      setError(err.message);
      setToast({ type: 'error', message: '목록을 불러오지 못했습니다.' });
      return;
    }
    setPosts(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createPost = useCallback(async (payload) => {
    setError(null);
    const { data, error: err } = await createPostApi(payload);
    if (err) {
      setToast({ type: 'error', message: err.message || '글 작성에 실패했습니다.' });
      return null;
    }
    setToast({ type: 'success', message: '글이 등록되었습니다.' });
    if (data) setPosts((prev) => [data, ...prev]);
    return data;
  }, []);

  const deletePost = useCallback(async (id) => {
    const { error: err } = await deletePostApi(id);
    if (err) {
      setToast({ type: 'error', message: err.message || '삭제에 실패했습니다.' });
      return;
    }
    setToast({ type: 'success', message: '삭제되었습니다.' });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { posts, loading, error, toast, setToast, load, createPost, deletePost };
}
