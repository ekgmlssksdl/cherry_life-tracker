-- 라이프스타일 트래커 앱 데이터베이스 설정
-- Supabase SQL Editor에서 이 스크립트를 실행하세요

-- 1. 할 일 테이블
create table if not exists todos (
  id uuid default gen_random_uuid() primary key,
  text text,
  completed boolean default false,
  date text,
  category text,
  time text,
  category_order int,
  time_order int,
  created_at timestamp with time zone default now()
);

-- 2. 운동 기록 테이블
create table if not exists exercises (
  id uuid default gen_random_uuid() primary key,
  date text,
  type text,
  duration int,
  intensity text,
  memo text,
  swimming_styles jsonb,
  total_distance int,
  pilates_equipment jsonb,
  body_parts jsonb,
  created_at timestamp with time zone default now()
);

-- 3. 고양이 케어 테이블
create table if not exists cat_cares (
  id uuid default gen_random_uuid() primary key,
  date text,
  stool_count int default 0,
  urine_count int default 0,
  food_remaining int default 0,
  supplements boolean default false,
  vomit_type text,
  stool_condition text,
  abnormality_memo text,
  created_at timestamp with time zone default now()
);

-- 4. 하루 요약 테이블
create table if not exists day_logs (
  id uuid default gen_random_uuid() primary key,
  date text,
  photo text,
  memo text,
  created_at timestamp with time zone default now()
);

-- 5. 일정 테이블
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  date text,
  end_date text,
  title text,
  start_time text,
  end_time text,
  description text,
  is_all_day boolean default false,
  created_at timestamp with time zone default now()
);

-- 6. 영양제 섭취 테이블
create table if not exists supplements (
  id uuid default gen_random_uuid() primary key,
  date text,
  probiotics boolean default false,
  magnesium boolean default false,
  olive_oil boolean default false,
  other boolean default false,
  created_at timestamp with time zone default now()
);

-- 7. 언어 공부 테이블
create table if not exists language_studies (
  id uuid default gen_random_uuid() primary key,
  date text,
  english boolean default false,
  french boolean default false,
  japanese boolean default false,
  spanish boolean default false,
  created_at timestamp with time zone default now()
);

-- 인덱스 생성 (성능 향상)
create index if not exists idx_todos_date on todos(date);
create index if not exists idx_exercises_date on exercises(date);
create index if not exists idx_cat_cares_date on cat_cares(date);
create index if not exists idx_day_logs_date on day_logs(date);
create index if not exists idx_events_date on events(date);
create index if not exists idx_supplements_date on supplements(date);
create index if not exists idx_language_studies_date on language_studies(date);

-- Row Level Security (RLS) 활성화 (선택사항 - 인증 기능 추가 시 필요)
-- alter table todos enable row level security;
-- alter table exercises enable row level security;
-- alter table cat_cares enable row level security;
-- alter table day_logs enable row level security;
-- alter table events enable row level security;
-- alter table supplements enable row level security;
-- alter table language_studies enable row level security;

-- 공개 접근 정책 (개발용 - 프로덕션에서는 인증 필요)
-- create policy "Enable all access for todos" on todos for all using (true);
-- create policy "Enable all access for exercises" on exercises for all using (true);
-- create policy "Enable all access for cat_cares" on cat_cares for all using (true);
-- create policy "Enable all access for day_logs" on day_logs for all using (true);
-- create policy "Enable all access for events" on events for all using (true);
-- create policy "Enable all access for supplements" on supplements for all using (true);
-- create policy "Enable all access for language_studies" on language_studies for all using (true);
