# 🍒 체리 트래커 → APK 완전 가이드 (초보자용)

## 🎯 목표: 핸드폰에 앱 설치하기!

---

## ✨ 가장 쉬운 방법 (5분!)

### 1단계: GitHub Desktop 다운로드
- 링크: https://desktop.github.com
- 설치 후 GitHub 계정으로 로그인
- (계정 없으면 https://github.com 에서 가입)

### 2단계: 프로젝트 GitHub에 올리기
1. GitHub Desktop 열기
2. `File` → `Add Local Repository`
3. 프로젝트 폴더 선택
4. `Publish repository` 클릭
5. 이름: `cherry-life-tracker` 입력
6. `Publish` 클릭 ✅

### 3단계: Vercel로 배포 (자동 HTTPS!)
1. https://vercel.com 접속
2. `Sign Up` → `Continue with GitHub` 클릭
3. `Add New` → `Project` 클릭
4. `cherry-life-tracker` 선택
5. `Deploy` 클릭
6. 3분 기다리면 완료! 🎉

### 4단계: 환경 변수 추가
1. Vercel에서 `Settings` → `Environment Variables`
2. 다음 3개 추가:
   ```
   VITE_SUPABASE_URL = [복사한 URL]
   VITE_SUPABASE_ANON_KEY = [복사한 KEY]
   VITE_SUPABASE_SERVICE_ROLE_KEY = [복사한 KEY]
   ```
   (Supabase에서 복사: Settings → API)
3. `Save` → `Deployments` → `Redeploy` 클릭

### 5단계: 핸드폰에 설치
1. 핸드폰 Chrome에서 Vercel URL 접속
   (예: https://cherry-life-tracker.vercel.app)
2. Chrome 메뉴 (⋮) → "홈 화면에 추가"
3. 완료! 홈 화면에 체리 아이콘 생김 🍒

---

## 📱 APK 파일로 만들기 (선택사항)

### PWA Builder 사용 (제일 쉬움!)
1. https://www.pwabuilder.com 접속
2. Vercel URL 입력
   (예: https://cherry-life-tracker.vercel.app)
3. `Start` 클릭
4. `Package for Stores` 선택
5. `Android` 선택 → APK 다운로드
6. APK 파일을 핸드폰에 전송 후 설치

---

## 📝 체크리스트

- [ ] GitHub 계정 만들기
- [ ] GitHub Desktop 설치
- [ ] 프로젝트 GitHub에 업로드
- [ ] Vercel 계정 만들기 (GitHub 연동)
- [ ] Vercel에 배포
- [ ] 환경 변수 3개 추가
- [ ] 핸드폰에서 접속 확인
- [ ] PWA 설치 완료!

---

## 🆘 문제 생기면?

**"GitHub Desktop이 안 열려요"**
→ 명령어로 업로드: `DEPLOYMENT-GUIDE.md` 참고

**"Vercel 빌드가 실패했어요"**
→ 환경 변수를 제대로 추가했는지 확인

**"핸드폰에 설치가 안 돼요"**
→ HTTPS URL로 접속했는지 확인 (http:// ❌, https:// ✅)

**"앱이 데이터를 못 불러와요"**
→ Vercel 환경 변수 확인 → Redeploy

---

## 📚 더 자세한 가이드

- **배포 상세 가이드**: `DEPLOYMENT-GUIDE.md`
- **APK 빌드 가이드**: `APK-BUILD-GUIDE.md`

---

## 🎉 요약

1. **GitHub Desktop**으로 코드 업로드 (2분)
2. **Vercel**로 배포 (3분)
3. 핸드폰 **Chrome**에서 "홈 화면에 추가" (1분)

**총 6분이면 완료!** 🚀
