# 🍒 체리 라이프 트래커

라이프스타일 투두리스트 + 라이프 트래커 앱

## ✨ 주요 기능

- 📝 **투두리스트**: 카테고리별 할일 관리
- 🏋️ **운동 트래킹**: 필라테스, 수영 등 다양한 운동 기록
- 🐱 **고양이 케어**: 사료, 물, 간식, 구토/변 상태 관리
- 💊 **영양제 관리**: 자유롭게 추가/수정/삭제 가능한 영양제 시스템
- 🌍 **언어 공부**: 자유롭게 추가/수정/삭제 가능한 언어 학습 시스템
- 📅 **캘린더**: 일정 관리 및 반복 이벤트 지원
- 📊 **해빗 트래커**: 월간/주간/연간 습관 추적 (달성률 색상 표시)
- 📝 **하루 일기**: 간단한 메모와 기분 기록

## 🎨 디자인

- **테마**: 체리 컨셉 🍒
- **배경색**: `#FFF5F7` (연한 핑크)
- **강조색**: `#E63946` (체리 레드)
- **폰트**: OngleipParkDahyeon (귀여운 손글씨)
- **타겟**: Z Flip 3 기준 모바일 친화적 디자인

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **상태 관리**: Context API
- **스타일링**: Tailwind CSS v4
- **애니메이션**: Motion (Framer Motion)
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **빌드**: Vite

## 🚀 빠른 시작

### 핸드폰에 앱 설치하기

**가장 쉬운 방법**: [`QUICK-START.md`](./QUICK-START.md) 참고
- GitHub Desktop으로 코드 업로드 (2분)
- Vercel로 자동 배포 (3분)
- 핸드폰에서 PWA 설치 (1분)

### 상세 가이드
- 📦 **HTTPS 배포**: [`DEPLOYMENT-GUIDE.md`](./DEPLOYMENT-GUIDE.md)
- 📱 **APK 빌드**: [`APK-BUILD-GUIDE.md`](./APK-BUILD-GUIDE.md)

## 💻 로컬 개발

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

## 📱 PWA 기능

- ✅ 오프라인 지원
- ✅ 홈 화면 추가 가능
- ✅ 앱처럼 실행
- ✅ 푸시 알림 준비 완료

## 🗂️ 프로젝트 구조

```
├── public/
│   ├── manifest.json          # PWA 설정
│   ├── service-worker.js      # 오프라인 지원
│   └── icon.svg               # 앱 아이콘
├── src/
│   ├── app/
│   │   ├── App.tsx            # 메인 앱
│   │   ├── components/        # React 컴포넌트
│   │   └── context/           # Context API
│   ├── styles/                # CSS 파일
│   └── main.tsx               # 진입점
├── supabase/
│   └── functions/server/      # Edge Functions
├── QUICK-START.md             # 빠른 시작 가이드
├── DEPLOYMENT-GUIDE.md        # 배포 가이드
└── APK-BUILD-GUIDE.md         # APK 빌드 가이드
```

## 🎯 주요 기능 상세

### 영양제 & 언어 공부 시스템
- 사용자가 자유롭게 항목 추가/수정/삭제
- 각 항목마다 이모지/국기 설정 가능
- 해빗 트래커에서 달성률 자동 계산
- 달성률에 따라 색상 농도 표시 (25%, 50%, 75%, 100%)

### 고양이 케어
- 사료, 물, 간식 시간 기록
- 구토/변 상태 중복 선택 및 횟수 체크
- 특이사항 메모 기능

### 해빗 트래커
- **월간**: 모든 습관 한눈에 보기
- **주간**: 이번 주 집중 관리
- **연간**: 장기 트렌드 확인
- 운동은 종류별 색상 구분
- 영양제/언어는 달성률 색상 표시

## 📄 라이선스

Private - 개인 사용

## 🙏 Credits

- Icons: Lucide React
- Font: OngleipParkDahyeon
- Design: Cherry 🍒

---

Made with 💝 by [Your Name]
