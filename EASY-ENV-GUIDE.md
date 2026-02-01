# 🔑 환경 변수 추가하기 (초간단 가이드)

## 환경 변수가 뭔가요?

앱이 데이터베이스(Supabase)와 통신하려면 **비밀번호** 같은 게 필요해요.
그게 바로 환경 변수입니다! 3개만 복사해서 붙여넣으면 끝이에요.

---

## 📝 Step 1: Supabase에서 값 복사하기

### 1-1. Supabase 접속
1. https://supabase.com 접속
2. 로그인
3. 프로젝트 클릭 (이미 만들어둔 프로젝트)

### 1-2. API 키 찾기
1. 왼쪽 메뉴에서 **⚙️ Settings** (설정) 클릭
2. **API** 클릭
3. 아래 3개 값을 **복사**하세요:

```
┌─────────────────────────────────────────────┐
│ Project URL                                  │
│ https://xxxxxxxx.supabase.co                │  ← 이거 복사!
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ API Keys                                     │
│                                              │
│ anon public                                  │
│ eyJhbGc... (긴 문자열)                        │  ← 이거 복사!
│                                              │
│ service_role (secret!)                       │
│ eyJhbGc... (또 다른 긴 문자열)                 │  ← 이거도 복사!
└─────────────────────────────────────────────┘
```

**💡 팁:** 메모장에 3개를 먼저 복사해두면 편해요!

---

## 🚀 Step 2: Vercel에 붙여넣기

### 2-1. Vercel 프로젝트 열기
1. https://vercel.com 접속
2. 로그인
3. `cherry-life-tracker` 프로젝트 클릭

### 2-2. Settings 들어가기
1. 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭

### 2-3. 환경 변수 3개 추가하기

#### 첫 번째 추가:
```
┌────────────────────────────────────────┐
│ Key (Name)                              │
│ VITE_SUPABASE_URL                       │  ← 정확히 이렇게 입력!
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Value                                   │
│ https://xxxxxxxx.supabase.co           │  ← Supabase에서 복사한 URL 붙여넣기
└────────────────────────────────────────┘

Environment: Production (✓), Preview (✓), Development (✓)
→ 3개 모두 체크!

[Save] 클릭
```

#### 두 번째 추가:
```
┌────────────────────────────────────────┐
│ Key (Name)                              │
│ VITE_SUPABASE_ANON_KEY                  │  ← 정확히 이렇게 입력!
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Value                                   │
│ eyJhbGc... (anon public 키)             │  ← Supabase anon 키 붙여넣기
└────────────────────────────────────────┘

Environment: 3개 모두 체크

[Save] 클릭
```

#### 세 번째 추가:
```
┌────────────────────────────────────────┐
│ Key (Name)                              │
│ VITE_SUPABASE_SERVICE_ROLE_KEY          │  ← 정확히 이렇게 입력!
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Value                                   │
│ eyJhbGc... (service_role 키)            │  ← Supabase service_role 키 붙여넣기
└────────────────────────────────────────┘

Environment: 3개 모두 체크

[Save] 클릭
```

---

## 🔄 Step 3: 다시 배포하기 (중요!)

환경 변수를 추가한 후엔 **반드시 다시 배포**해야 적용돼요!

1. Vercel에서 상단 메뉴 **Deployments** 클릭
2. 맨 위에 있는 최신 배포 찾기
3. 오른쪽 **⋯** (점 3개) 클릭
4. **Redeploy** 클릭
5. **Redeploy** 버튼 한번 더 클릭 (확인)
6. 1-2분 기다리면 완료! ✅

---

## ✅ 확인하기

### 잘 됐는지 확인하는 법:
1. 핸드폰 Chrome에서 Vercel URL 접속
   - 예: `https://cherry-life-tracker.vercel.app`
2. 앱이 정상적으로 열리나요?
3. 데이터가 저장/불러오기 되나요?
4. 됐다! 🎉

---

## 🆘 문제 해결

### "환경 변수를 어디에 입력해요?"
→ Vercel 프로젝트 → Settings → Environment Variables

### "Key를 뭐라고 적어야 해요?"
→ 정확히 이렇게 3개:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY
```
(오타 주의! 대문자/언더바 정확히!)

### "Value는 뭐예요?"
→ Supabase에서 복사한 긴 문자열들

### "추가했는데 앱이 안 돼요"
→ Redeploy 했나요? 안 했으면 적용 안 돼요!

### "Supabase 프로젝트가 없어요"
→ https://supabase.com 에서 새 프로젝트 만들기
→ 3-5분 기다리면 자동 생성됨

---

## 📋 체크리스트

- [ ] Supabase 접속 완료
- [ ] Settings → API 들어감
- [ ] Project URL 복사함
- [ ] anon public 키 복사함
- [ ] service_role 키 복사함
- [ ] Vercel Settings → Environment Variables 들어감
- [ ] VITE_SUPABASE_URL 추가함
- [ ] VITE_SUPABASE_ANON_KEY 추가함
- [ ] VITE_SUPABASE_SERVICE_ROLE_KEY 추가함
- [ ] Deployments → Redeploy 클릭함
- [ ] 핸드폰에서 접속 테스트 완료!

---

## 🎯 요약 (3줄 정리)

1. **Supabase**: Settings → API → 3개 복사
2. **Vercel**: Settings → Environment Variables → 3개 붙여넣기
3. **Redeploy** 클릭 → 완료! 🍒
