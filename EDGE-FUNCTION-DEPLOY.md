# Supabase Edge Function 배포 가이드 🚀

## 📋 준비물
- Node.js 설치됨 ✅
- 터미널/명령 프롬프트 접근 가능 ✅
- Supabase 계정 로그인 정보 ✅

---

## 🔧 Step 1: Supabase CLI 설치

### Windows:
```bash
npm install -g supabase
```

### Mac/Linux:
```bash
npm install -g supabase
```

설치 후 확인:
```bash
supabase --version
```

---

## 🔑 Step 2: Supabase 로그인

```bash
supabase login
```

- 브라우저가 자동으로 열립니다
- Supabase 계정으로 로그인하세요
- 액세스 토큰이 자동으로 저장됩니다

---

## 🔗 Step 3: 프로젝트 연결

```bash
supabase link --project-ref ikgzqwinmcznwtdjwzgx
```

데이터베이스 비밀번호를 입력하라고 나오면:
- Supabase 대시보드 → Settings → Database에서 확인
- 또는 처음 프로젝트 만들 때 받은 비밀번호 사용

---

## 📦 Step 4: Edge Function 배포

```bash
supabase functions deploy server
```

배포 성공하면 이런 메시지가 나옵니다:
```
✓ Deployed Function server on project ikgzqwinmcznwtdjwzgx
Function URL: https://ikgzqwinmcznwtdjwzgx.supabase.co/functions/v1/server
```

---

## 🔐 Step 5: 환경 변수 설정 (중요!)

Supabase 대시보드에서 설정:

1. https://supabase.com/dashboard/project/ikgzqwinmcznwtdjwzgx/settings/functions
2. "Secrets" 섹션 찾기
3. 다음 환경 변수 추가:

```
SUPABASE_URL = https://ikgzqwinmcznwtdjwzgx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = (Service Role Key - Settings → API에서 확인)
```

**Service Role Key 찾는 법:**
- Supabase 대시보드 → Settings → API
- "service_role" 키 복사 (절대 공유하지 마세요!)

---

## ✅ Step 6: 테스트

브라우저에서 접속:
```
https://ikgzqwinmcznwtdjwzgx.supabase.co/functions/v1/make-server-1427e4c0/health
```

성공하면 이렇게 나옵니다:
```json
{"status":"ok"}
```

---

## 🗄️ Step 7: 데이터베이스 테이블 확인

Supabase 대시보드에서:
1. Table Editor 메뉴 클릭
2. `kv_store_1427e4c0` 테이블이 있는지 확인

**없으면 생성:**
```sql
CREATE TABLE IF NOT EXISTS kv_store_1427e4c0 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kv_store_updated_at
BEFORE UPDATE ON kv_store_1427e4c0
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

SQL Editor에서 실행하세요!

---

## 🎉 완료!

이제 Vercel 배포된 앱이 제대로 작동할 거예요!

배포 후:
1. Vercel 사이트 방문
2. 앱이 정상적으로 로드됨
3. 데이터 저장/불러오기 작동 확인

---

## 🐛 문제 해결

### "Function not found"
→ Edge Function 배포가 안 됨. Step 4 다시 실행

### "Database error"
→ 테이블이 없음. Step 7에서 SQL 실행

### "Unauthorized"
→ 환경 변수 설정 안 됨. Step 5 다시 확인

---

## 📞 도움이 필요하면

터미널에서 나온 에러 메시지를 복사해서 알려주세요!
