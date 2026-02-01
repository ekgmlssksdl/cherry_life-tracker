# 🚀 체리 라이프 트래커 HTTPS 배포 가이드

## 🎯 가장 쉬운 방법들 (무료!)

---

## 방법 1: Vercel (★★★★★ 추천!)

### 왜 Vercel?
- ✅ **완전 무료**
- ✅ **자동 HTTPS**
- ✅ **3분이면 완료**
- ✅ **Git 연동 자동 배포**
- ✅ **Vite 프로젝트 최적화**

### 배포 단계

#### A. GitHub에 코드 업로드 (처음만)

1. **GitHub 계정 만들기**
   - https://github.com 접속
   - Sign up 클릭

2. **새 Repository 만들기**
   - GitHub 우측 상단 `+` → `New repository`
   - Repository name: `cherry-life-tracker`
   - Public 선택
   - `Create repository` 클릭

3. **코드 업로드**
   ```bash
   # 프로젝트 폴더에서 실행
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[your-username]/cherry-life-tracker.git
   git push -u origin main
   ```

#### B. Vercel로 배포

1. **Vercel 접속**
   - https://vercel.com 방문
   - `Sign up` 클릭
   - **GitHub로 로그인** 선택 (가장 쉬움!)

2. **프로젝트 Import**
   - `Add New` → `Project` 클릭
   - GitHub에서 `cherry-life-tracker` 선택
   - `Import` 클릭

3. **설정 (자동 감지됨)**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
   - 그대로 두고 `Deploy` 클릭!

4. **완료! 🎉**
   - 2-3분 후 배포 완료
   - URL: `https://cherry-life-tracker.vercel.app`
   - 이 URL을 핸드폰에서 열면 됩니다!

#### C. 환경 변수 설정 (Supabase)

1. Vercel 프로젝트 → `Settings` → `Environment Variables`
2. 다음 변수들 추가:
   ```
   VITE_SUPABASE_URL = [your-supabase-url]
   VITE_SUPABASE_ANON_KEY = [your-supabase-anon-key]
   ```
3. `Save` 후 `Redeploy`

---

## 방법 2: Netlify (★★★★☆)

### 배포 단계

1. **Netlify 접속**
   - https://www.netlify.com 방문
   - `Sign up` → GitHub로 로그인

2. **배포**
   - `Add new site` → `Import an existing project`
   - GitHub에서 프로젝트 선택
   - Build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```
   - `Deploy` 클릭

3. **환경 변수**
   - Site settings → Environment variables
   - Supabase 키 추가

4. **완료!**
   - URL: `https://cherry-life-tracker.netlify.app`

---

## 방법 3: GitHub Pages (무료, 간단)

### 준비사항

1. **gh-pages 패키지 설치**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **package.json에 scripts 추가**
   ```json
   {
     "scripts": {
       "build": "vite build",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://[your-username].github.io/cherry-life-tracker"
   }
   ```

3. **vite.config.ts 수정**
   ```typescript
   export default defineConfig({
     base: '/cherry-life-tracker/',
     // ... 기존 설정
   })
   ```

### 배포

```bash
npm run deploy
```

완료! URL: `https://[your-username].github.io/cherry-life-tracker`

---

## 🎯 단계별 가이드 (Vercel - 가장 추천!)

### 1️⃣ GitHub 계정 준비 (2분)
1. https://github.com 접속
2. 우측 상단 `Sign up` 클릭
3. 이메일, 비밀번호 입력
4. 이메일 인증 완료

### 2️⃣ 코드 GitHub에 올리기 (5분)

**방법 A: GitHub Desktop 사용 (초보자 추천!)**
1. GitHub Desktop 다운로드: https://desktop.github.com
2. GitHub 계정으로 로그인
3. `File` → `Add Local Repository`
4. 프로젝트 폴더 선택
5. `Publish repository` 클릭
6. Repository name: `cherry-life-tracker`
7. `Publish` 클릭 → 완료!

**방법 B: 명령어 사용**
```bash
# 프로젝트 폴더에서
git init
git add .
git commit -m "체리 트래커 첫 배포"
git branch -M main
git remote add origin https://github.com/[your-username]/cherry-life-tracker.git
git push -u origin main
```

### 3️⃣ Vercel 배포 (3분)

1. **Vercel 가입**
   - https://vercel.com 접속
   - `Sign Up` 클릭
   - **Continue with GitHub** 선택 (제일 쉬움!)
   - GitHub 연동 승인

2. **프로젝트 Import**
   - 대시보드에서 `Add New` → `Project` 클릭
   - `Import Git Repository` 섹션에서 `cherry-life-tracker` 찾기
   - `Import` 클릭

3. **배포 설정**
   ```
   PROJECT NAME: cherry-life-tracker (자동)
   FRAMEWORK: Vite (자동 감지됨)
   ROOT DIRECTORY: ./ (그대로)
   BUILD COMMAND: npm run build (자동)
   OUTPUT DIRECTORY: dist (자동)
   ```
   → 모두 자동으로 설정되니 그냥 `Deploy` 클릭!

4. **환경 변수 추가 (중요!)**
   - 배포 완료 후 → `Settings` → `Environment Variables`
   - 다음 3개 추가:
   
   ```
   Name: VITE_SUPABASE_URL
   Value: [Supabase 프로젝트 URL]
   
   Name: VITE_SUPABASE_ANON_KEY  
   Value: [Supabase Anon Key]
   
   Name: VITE_SUPABASE_SERVICE_ROLE_KEY
   Value: [Supabase Service Role Key]
   ```
   
   - `Save` 클릭
   - `Deployments` 탭 → 최신 배포 → `...` → `Redeploy`

5. **완료! 🎉**
   - URL 확인: `https://cherry-life-tracker.vercel.app`
   - 또는 `https://cherry-life-tracker-[random].vercel.app`

### 4️⃣ 핸드폰에서 PWA 설치

1. **핸드폰 Chrome에서 접속**
   - 위에서 받은 Vercel URL 접속
   - 예: `https://cherry-life-tracker.vercel.app`

2. **홈 화면에 추가**
   - Android: Chrome 메뉴 (⋮) → "홈 화면에 추가"
   - iOS: Safari 공유 버튼 → "홈 화면에 추가"

3. **완료!**
   - 홈 화면에 체리 아이콘 생성됨 🍒
   - 앱처럼 사용 가능!

---

## 🔄 코드 수정 후 재배포

### Vercel (자동!)
```bash
git add .
git commit -m "수정 내용"
git push
```
→ GitHub에 푸시하면 Vercel이 **자동으로 재배포**! 🚀

### GitHub Pages
```bash
npm run deploy
```

---

## 💡 환경 변수 찾는 법 (Supabase)

1. https://supabase.com 로그인
2. 프로젝트 선택
3. 좌측 메뉴 `Settings` → `API`
4. 복사할 값들:
   ```
   Project URL → VITE_SUPABASE_URL
   anon public → VITE_SUPABASE_ANON_KEY
   service_role (secret) → VITE_SUPABASE_SERVICE_ROLE_KEY
   ```

---

## ✅ 배포 체크리스트

- [ ] GitHub 계정 생성
- [ ] 코드 GitHub에 업로드
- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] Vercel에서 프로젝트 Import
- [ ] 환경 변수 3개 추가
- [ ] 배포 완료 확인
- [ ] HTTPS URL 접속 테스트
- [ ] 핸드폰에서 PWA 설치 테스트

---

## 🆘 문제 해결

### "빌드가 실패했어요"
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 확인 후 수정
```

### "환경 변수가 안 불러와져요"
- Vercel: 환경 변수는 `VITE_`로 시작해야 함
- 추가 후 반드시 Redeploy 필요

### "페이지가 안 열려요"
- index.html 파일 확인
- vite.config.ts의 base 경로 확인

### "데이터베이스 연결 안 됨"
- Supabase 환경 변수 확인
- CORS 설정 확인

---

## 🎁 보너스: 커스텀 도메인

Vercel에서 무료로 커스텀 도메인 연결 가능!

1. 도메인 구매 (Namecheap, Gabia 등)
2. Vercel → Settings → Domains
3. 도메인 입력 → DNS 설정 안내
4. 완료: `https://cherry-tracker.com` 🎉

---

## 📞 더 쉬운 방법 없나요?

**가장 쉬운 순서:**
1. ⭐ Vercel (클릭 몇 번으로 끝!)
2. Netlify (거의 똑같음)
3. GitHub Pages (설정 필요)

**추천:** Vercel + GitHub Desktop 조합
→ 코딩 몰라도 5분이면 배포 완료!