-- ==============================
-- linkon Supabase 프로젝트 스키마
-- Supabase SQL Editor에서 실행하세요
-- ==============================

-- 1. users 테이블 (auth.users를 미러링)
CREATE TABLE IF NOT EXISTS public.users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text UNIQUE NOT NULL,
  name       text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. service_accounts 테이블 (각 서비스의 Supabase uid 저장)
CREATE TABLE IF NOT EXISTS public.service_accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  linkon_uid  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service     text NOT NULL CHECK (service IN ('vion', 'rion', 'taxon')),
  service_uid uuid NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (linkon_uid, service),
  UNIQUE (service, service_uid)
);

-- 3. registration_preferences 테이블 (가입 시 선호도 조사)
CREATE TABLE IF NOT EXISTS public.registration_preferences (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  linkon_uid        uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_service text CHECK (preferred_service IN ('vion', 'rion', 'taxon')),
  marketing_agreed  boolean NOT NULL DEFAULT false,
  terms_agreed      boolean NOT NULL DEFAULT false,
  terms_agreed_at   timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (linkon_uid)
);

-- ==============================
-- RLS (Row Level Security) 활성화
-- ==============================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_preferences ENABLE ROW LEVEL SECURITY;

-- users RLS: 자신의 레코드만 조회/수정
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- service_accounts RLS: 자신의 서비스 계정만 조회
CREATE POLICY "service_accounts_select_own" ON public.service_accounts
  FOR SELECT USING (auth.uid() = linkon_uid);

-- registration_preferences RLS: 자신의 선호도만 조회
CREATE POLICY "preferences_select_own" ON public.registration_preferences
  FOR SELECT USING (auth.uid() = linkon_uid);

-- ==============================
-- 트리거: auth.users 생성 시 public.users 자동 생성
-- ==============================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
