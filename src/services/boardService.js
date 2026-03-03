import { supabase } from '../lib/supabaseClient';

export async function fetchPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, content, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    console.error('fetchPosts:', e);
    return { data: null, error: e };
  }
}

export async function createPost({ title, content }) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content }])
      .select('id, title, content, created_at')
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (e) {
    console.error('createPost:', e);
    return { data: null, error: e };
  }
}

export async function deletePost(id) {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (e) {
    console.error('deletePost:', e);
    return { error: e };
  }
}
