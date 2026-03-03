# React 게시판 – 배포 가이드

## 1. GitHub (완료)
- 리포: https://github.com/shinkang888-code/react
- `master` 브랜치 푸시 완료

## 2. Supabase 백엔드 발행

### 옵션 A: Supabase 대시보드에서 테이블 생성
1. https://supabase.com/dashboard 접속 → 로그인
2. **New project**로 프로젝트 생성 (이름 예: `react-board`)
3. **SQL Editor**에서 아래 SQL 실행:

```sql
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.posts FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON public.posts FOR UPDATE USING (true);
```

4. **Settings → API**에서 `Project URL`과 `anon public` 키 복사

### 옵션 B: Supabase CLI로 마이그레이션 적용
```bash
supabase login
supabase link --project-ref <프로젝트-ref>
supabase db push
```
프로젝트 ref는 대시보드 URL의 `https://supabase.com/dashboard/project/여기` 값입니다.

### 프론트/배포에 넣을 환경 변수
- `VITE_SUPABASE_URL`: Project URL
- `VITE_SUPABASE_ANON_KEY`: anon public key

프로젝트 루트에 `.env` 생성 후 위 두 값 넣고, Vercel에서는 **Project Settings → Environment Variables**에 동일하게 추가하세요.

## 3. Vercel 프론트 발행

1. **로그인 (최초 1회)**  
   터미널에서:
   ```bash
   vercel login
   ```

2. **배포**
   ```bash
   vercel --prod
   ```
   또는 GitHub 리포지토리를 Vercel에 연결한 뒤, `master` 푸시 시 자동 배포되도록 설정할 수 있습니다.

3. **환경 변수**  
   Vercel 대시보드 → 해당 프로젝트 → **Settings → Environment Variables**에  
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가 후 재배포.

## 4. 로컬 실행
```bash
cp .env.example .env
# .env에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 입력
npm install
npm run dev
```
