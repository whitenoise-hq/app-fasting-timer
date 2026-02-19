# 단식 타이머 (Fasting Timer)

간헐적 단식을 쉽게 관리할 수 있는 타이머 앱입니다.

## 주요 기능

### 타이머
- 원형 프로그레스 바로 단식 진행 상황 시각화
- 실시간 남은 시간 표시 (시:분:초)
- 백그라운드 복귀 시 자동 시간 동기화
- 상태별 팁 제공 (단식 중 / 식사 가능)

### 기록 & 통계
- 월간 캘린더로 단식 기록 확인
- 완료/미완료 날짜 색상 구분
- 주간 통계 (성공률, 평균 단식 시간, 연속 스트릭)
- 날짜별 상세 기록 조회

### 가이드
- 단식 플랜별 상세 설명 (12:12, 14:10, 16:8, 23:1)
- 공복 시 허용/금지 음식 목록
- 추천 식사 시간대
- 주의사항 및 FAQ

### 설정
- 단식 플랜 선택 (프리셋 4종 + 커스텀)
- 식사 시작 시간 설정
- 알림 설정 (단식 시작/종료, 리마인더, 격려)
- 다크모드 지원
- 데이터 초기화

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Expo SDK 54 |
| 언어 | TypeScript |
| 스타일링 | NativeWind v4 (Tailwind CSS) |
| 네비게이션 | expo-router |
| 상태관리 | Zustand + AsyncStorage |
| 알림 | expo-notifications |
| SVG | react-native-svg |

## 프로젝트 구조

```
app-fasting-timer/
├── app/                      # expo-router 페이지
│   ├── (tabs)/
│   │   ├── _layout.tsx       # 탭 네비게이션
│   │   ├── index.tsx         # 홈 (타이머)
│   │   ├── records.tsx       # 기록/통계
│   │   ├── guide.tsx         # 단식 가이드
│   │   └── settings.tsx      # 설정
│   └── _layout.tsx           # 루트 레이아웃
├── src/
│   ├── components/           # UI 컴포넌트
│   │   ├── timer/            # 타이머 관련
│   │   ├── records/          # 기록/통계 관련
│   │   ├── guide/            # 가이드 관련
│   │   └── settings/         # 설정 관련
│   ├── hooks/                # 커스텀 훅
│   │   ├── useTimer.ts
│   │   └── useFastingRecords.ts
│   ├── stores/               # Zustand 스토어
│   │   ├── timerStore.ts
│   │   └── settingsStore.ts
│   ├── utils/                # 유틸리티 함수
│   │   ├── time.ts
│   │   └── date.ts
│   ├── constants/            # 상수
│   │   ├── plans.ts
│   │   ├── colors.ts
│   │   └── guide.ts
│   └── types/                # TypeScript 타입
│       └── index.ts
└── assets/                   # 정적 리소스
```

## 시작하기

### 필수 조건

- Node.js 18+
- pnpm (권장) 또는 npm
- Expo Go 앱 (모바일 테스트용)

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm start
```

### 테스트 방법

**Expo Go 앱 사용:**
1. 스마트폰에 Expo Go 앱 설치
2. `pnpm start` 실행
3. 터미널에 표시된 QR 코드 스캔
4. 같은 Wi-Fi 네트워크에 연결되어 있어야 함

**Android 에뮬레이터:**
```bash
pnpm start --android
```

**iOS 시뮬레이터:**
```bash
pnpm start --ios
```

## 빌드 & 배포

### 개발 빌드

```bash
# EAS CLI 설치
npm install -g eas-cli

# 개발 빌드
eas build --profile development --platform android
```

### 프로덕션 빌드

```bash
# 프로덕션 빌드
eas build --profile production --platform android

# 스토어 제출
eas submit --platform android
```

## 단식 플랜

| 플랜 | 단식 | 식사 | 설명 |
|------|------|------|------|
| 12:12 | 12시간 | 12시간 | 입문용 |
| 14:10 | 14시간 | 10시간 | 초보자용 |
| 16:8 | 16시간 | 8시간 | 가장 권장 |
| 23:1 | 23시간 | 1시간 | 1일 1식 |

## 스크립트

```bash
pnpm start          # 개발 서버 시작
pnpm start --android  # Android로 시작
pnpm start --ios      # iOS로 시작
pnpm start --web      # 웹으로 시작
pnpm typecheck      # TypeScript 타입 체크
```

## 라이선스

MIT License
