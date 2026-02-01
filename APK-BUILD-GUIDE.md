# 체리 라이프 트래커 APK 빌드 가이드

## 🍒 개요
이 가이드는 웹 앱을 Android APK로 빌드하는 방법을 설명합니다.

---

## 📱 방법 1: PWA로 설치 (가장 간단)

### 1단계: 앱 배포
- 웹 앱을 Vercel, Netlify, GitHub Pages 등에 배포합니다
- HTTPS 필수!

### 2단계: 모바일에서 설치
**Android (Chrome):**
1. Chrome 브라우저로 앱 접속
2. 우측 상단 메뉴 (⋮) → "홈 화면에 추가" 클릭
3. 앱 이름 확인 후 "추가" 클릭
4. 홈 화면에 아이콘이 생성됩니다 🎉

**iOS (Safari):**
1. Safari 브라우저로 앱 접속
2. 하단 공유 버튼 클릭
3. "홈 화면에 추가" 선택
4. 앱 이름 확인 후 "추가" 클릭

---

## 📦 방법 2: APK 파일 생성 (권장)

### Option A: PWA Builder 사용 (가장 쉬움)

1. **앱 배포**
   - 먼저 웹 앱을 HTTPS로 배포 (Vercel 등)

2. **PWA Builder 접속**
   - https://www.pwabuilder.com 방문
   
3. **APK 생성**
   ```
   - "Start" 버튼 클릭
   - 배포된 앱 URL 입력
   - "Package for Stores" 선택
   - "Android" 선택
   - APK 다운로드
   ```

4. **APK 설치**
   - 생성된 APK를 핸드폰으로 전송
   - 파일 클릭하여 설치
   - (설정에서 "알 수 없는 출처" 허용 필요)

---

### Option B: Capacitor 사용 (고급)

#### 1. Capacitor 설치
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

#### 2. Capacitor 초기화
```bash
npx cap init "체리 라이프 트래커" "com.cherrytracker.app"
```

#### 3. 웹 앱 빌드
```bash
npm run build
```

#### 4. Android 플랫폼 추가
```bash
npx cap add android
```

#### 5. 웹 파일 동기화
```bash
npx cap sync
```

#### 6. Android Studio에서 열기
```bash
npx cap open android
```

#### 7. APK 빌드
Android Studio에서:
- `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- `app/build/outputs/apk/debug/app-debug.apk` 생성됨

---

### Option C: Bubblewrap CLI (구글 공식)

#### 1. Bubblewrap 설치
```bash
npm install -g @bubblewrap/cli
```

#### 2. JDK 11 설치
- https://adoptium.net/ 에서 JDK 11 다운로드 & 설치

#### 3. Android SDK 설치
```bash
bubblewrap doctor
```
- 안내에 따라 Android SDK 자동 설치

#### 4. 프로젝트 초기화
```bash
bubblewrap init --manifest=https://your-app-url.com/manifest.json
```

#### 5. APK 빌드
```bash
bubblewrap build
```

#### 6. APK 위치
- `app-release-signed.apk` 파일 생성됨

---

## 🔑 서명된 APK 만들기 (Google Play 배포용)

### 키 생성
```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias cherry-tracker -keyalg RSA -keysize 2048 -validity 10000
```

### Capacitor에서 서명
`android/app/build.gradle` 수정:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../my-release-key.keystore")
            storePassword "your-password"
            keyAlias "cherry-tracker"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 📝 체크리스트

- [ ] HTTPS로 앱 배포 완료
- [ ] manifest.json 정상 작동 확인
- [ ] service-worker.js 등록 확인
- [ ] PWA로 설치 테스트
- [ ] APK 빌드 완료
- [ ] APK 설치 테스트

---

## 💡 팁

1. **아이콘 최적화**
   - 현재 SVG 아이콘 사용 중
   - PNG로 변환하려면: https://cloudconvert.com/svg-to-png

2. **앱 크기 줄이기**
   - `npm run build` 실행하여 최적화된 빌드 생성
   - 불필요한 패키지 제거

3. **디버깅**
   - Chrome DevTools → Application → Manifest 확인
   - Service Workers 등록 상태 확인

4. **Google Play 배포**
   - Google Play Console: https://play.google.com/console
   - 개발자 등록비: $25 (1회)
   - 서명된 AAB 파일 필요

---

## 🚀 추천 방법

**개인 사용:** PWA로 설치 (방법 1)
**친구/가족 공유:** PWA Builder로 APK 생성 (방법 2-A)  
**Play Store 배포:** Capacitor + 서명된 AAB (방법 2-B + 서명)

---

## 📞 문제 해결

### "앱이 설치되지 않습니다"
- Android 설정 → 보안 → "알 수 없는 출처" 허용

### "PWA 설치 버튼이 안 보여요"
- HTTPS 필수 (localhost는 예외)
- manifest.json과 service-worker.js 확인

### "APK가 너무 커요"
- 빌드 시 production 모드 사용
- `npm run build` 실행 후 빌드
