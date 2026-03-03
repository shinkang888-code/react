-- 게시판 posts 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 익명 읽기/쓰기 (배포 후 필요에 따라 정책 수정)
CREATE POLICY "Allow public read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.posts FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON public.posts FOR UPDATE USING (true);

-- updated_at 자동 갱신 (선택)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.posts IS '게시판 글';
