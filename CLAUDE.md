# CLAUDE.md — app-fasting-timer

> 이 문서는 Claude Code가 프로젝트 컨텍스트를 이해하고 일관된 코드를 생성하기 위한 가이드입니다.

---

## 프로젝트 개요

간헐적 단식 타이머 앱. 사용자가 단식 플랜을 선택하고, 타이머로 단식 진행 상황을 추적하며, 기록과 통계를 확인할 수 있다. Google Play 출시 대상.

- **레포**: app-fasting-timer
- **플랫폼**: Android (Google Play)
- **언어**: 한국어 (기본), 앱 내 텍스트는 한국어

---

## 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Expo | SDK 52 |
| 언어 | TypeScript | 5.x |
| 스타일링 | NativeWind | v4 |
| 네비게이션 | expo-router | 최신 |
| 상태관리 | Zustand | 최신 |
| 로컬 저장 | @react-native-async-storage/async-storage | 최신 |
| 알림 | expo-notifications | 최신 |
| 차트 | react-native-svg + victory-native | 최신 |
| 광고 | react-native-google-mobile-ads | 최신 |
| 빌드 | EAS Build | 최신 |

---

## 폴더 구조

```
app-fasting-timer/
├── app/                      # expo-router 페이지 (파일 기반 라우팅)
│   ├── (tabs)/
│   │   ├── _layout.tsx       # 탭 네비게이션 레이아웃
│   │   ├── index.tsx         # 홈 (타이머)
│   │   ├── records.tsx       # 기록/통계
│   │   ├── guide.tsx         # 단식 가이드
│   │   └── settings.tsx      # 설정
│   └── _layout.tsx           # 루트 레이아웃
├── src/
│   ├── components/           # UI 컴포넌트
│   │   ├── timer/            # 타이머 관련
│   │   ├── records/          # 기록/통계 관련
│   │   ├── plan/             # 플랜 선택 관련
│   │   └── common/           # 공통 컴포넌트
│   ├── hooks/                # 커스텀 훅
│   ├── stores/               # Zustand 스토어
│   ├── utils/                # 유틸리티 함수
│   ├── constants/            # 상수 (플랜, 색상, 가이드 데이터)
│   └── types/                # TypeScript 타입 정의
├── assets/                   # 이미지, 폰트 등 정적 리소스
├── CLAUDE.md
├── app.json
├── package.json
└── tsconfig.json
```

---

## 코딩 컨벤션

### 컴포넌트

- **함수형 컴포넌트만 사용** (class 컴포넌트 금지)
- **default export 사용**
- 컴포넌트 파일명은 **PascalCase** (예: `CircularTimer.tsx`)
- 한 컴포넌트 파일은 **200줄 이하** 유지. 초과 시 분리
- Props 타입은 컴포넌트 파일 상단에 `interface`로 정의

```tsx
// ✅ 좋은 예
interface CircularTimerProps {
  progress: number;
  remainingTime: number;
}

export default function CircularTimer({ progress, remainingTime }: CircularTimerProps) {
  return (/* ... */);
}
```

### 스타일링

- **NativeWind className만 사용** (StyleSheet.create 금지)
- Tailwind 유틸리티 클래스로 스타일링
- 색상은 `src/constants/colors.ts`에서 관리
- 다크모드는 NativeWind의 `dark:` 프리픽스 활용

```tsx
// ✅ 좋은 예
<View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">

// ❌ 나쁜 예
<View style={styles.container}>
```

### 상태관리 (Zustand)

- 스토어 파일은 `src/stores/`에 위치
- 스토어명은 `camelCase` + `Store` 접미사 (예: `timerStore.ts`)
- AsyncStorage 연동은 Zustand persist 미들웨어 사용
- 스토어 하나당 하나의 관심사만 담당

```tsx
// ✅ 좋은 예 — timerStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerState {
  isRunning: boolean;
  startTime: string | null;
  // ...
  startTimer: () => void;
  stopTimer: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      isRunning: false,
      startTime: null,
      startTimer: () => set({ isRunning: true, startTime: new Date().toISOString() }),
      stopTimer: () => set({ isRunning: false }),
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 커스텀 훅

- 파일명은 `use` 프리픽스 + camelCase (예: `useTimer.ts`)
- 비즈니스 로직은 훅으로 분리, 컴포넌트는 UI에만 집중
- 훅 파일은 `src/hooks/`에 위치

### 타입

- 모든 타입/인터페이스는 `src/types/index.ts`에 정의
- `any` 사용 금지. 부득이한 경우 `unknown` 사용 후 타입 가드
- API 응답, 데이터 모델 등 공유 타입은 반드시 `types/`에서 import

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `CircularTimer.tsx` |
| 훅 파일 | camelCase, use 프리픽스 | `useTimer.ts` |
| 스토어 파일 | camelCase, Store 접미사 | `timerStore.ts` |
| 유틸 파일 | camelCase | `time.ts` |
| 상수 파일 | camelCase | `plans.ts` |
| 변수/함수 | camelCase | `remainingTime` |
| 타입/인터페이스 | PascalCase | `FastingPlan` |
| 상수 값 | UPPER_SNAKE_CASE | `DEFAULT_PLAN_ID` |

### 주석

- **한국어 주석 사용**
- 함수/훅 상단에 JSDoc 스타일로 역할 설명
- 복잡한 로직에만 인라인 주석 추가. 자명한 코드에는 주석 불필요

```tsx
// ✅ 좋은 예
/** 남은 단식 시간을 시:분:초 형태로 변환 */
function formatRemainingTime(minutes: number): string {
  // ...
}
```

---

## 데이터 모델

```typescript
// 단식 플랜
interface FastingPlan {
  id: string;
  name: string;           // "12:12", "14:10", "16:8", "23:1", "커스텀"
  label: string;          // "입문용", "초보자용", "가장 권장", "1일 1식", "커스텀"
  fastingHours: number;
  eatingHours: number;
  description: string;
}

// 기본 플랜 (src/constants/plans.ts)
const DEFAULT_PLANS: FastingPlan[] = [
  { id: "12-12", name: "12:12", label: "입문용",   fastingHours: 12, eatingHours: 12, description: "저녁 8시 ~ 아침 8시 공복 유지" },
  { id: "14-10", name: "14:10", label: "초보자용", fastingHours: 14, eatingHours: 10, description: "아침을 늦게 먹거나 저녁을 일찍 마치는 방식" },
  { id: "16-8",  name: "16:8",  label: "가장 권장", fastingHours: 16, eatingHours: 8,  description: "오전 11시 ~ 오후 7시 식사" },
  { id: "23-1",  name: "23:1",  label: "1일 1식",  fastingHours: 23, eatingHours: 1,  description: "강력한 체지방 분해 효과" },
];

// 단식 기록
interface FastingRecord {
  id: string;
  planId: string;
  startTime: string;      // ISO 8601
  endTime: string | null;
  targetDuration: number; // 분
  actualDuration: number; // 분
  completed: boolean;
}

// 알림 설정
interface NotificationSettings {
  fastingStart: boolean;
  fastingEnd: boolean;
  eatingReminder: boolean;  // 식사 종료 30분 전
  halfwayCheer: boolean;    // 단식 중간 격려
}

// 사용자 설정
interface UserSettings {
  selectedPlanId: string;
  customFastingHours: number | null;
  customEatingHours: number | null;
  eatingStartTime: string;  // "11:00"
  notifications: NotificationSettings;
  darkMode: boolean;
}

// 통계
interface FastingStats {
  totalFasts: number;
  completedFasts: number;
  currentStreak: number;
  longestStreak: number;
  averageDuration: number;  // 분
  successRate: number;      // 퍼센트
}
```

---

## 화면 구성 (4탭)

### 1. 홈 (타이머) — `app/(tabs)/index.tsx`
- 원형 프로그레스 타이머 (메인 UI)
- 현재 플랜 표시 (예: "16:8 · 가장 권장")
- 단식 시작/종료 버튼
- 오늘의 단식 요약 (시작 시간, 목표 시간)
- 상태별 팁 (단식 중: "물, 블랙커피는 OK!", 식사 중: "30분 후 단식 시작")

### 2. 기록 — `app/(tabs)/records.tsx`
- 캘린더 뷰 (단식 완료한 날 마킹)
- 날짜 탭 시 상세 기록
- 주간 통계 카드 (성공률, 평균 시간, 스트릭)

### 3. 가이드 — `app/(tabs)/guide.tsx`
- 단식 방법별 설명 (12:12, 14:10, 16:8, 23:1)
- 공복 시 허용/금지 음식
- 주의사항 (당뇨, 임산부 등)
- FAQ

### 4. 설정 — `app/(tabs)/settings.tsx`
- 단식 플랜 선택 (프리셋 4종 + 커스텀 직접 입력)
- 식사 시작 시간 설정
- 알림 종류별 ON/OFF
- 다크모드 토글
- 데이터 초기화
- 앱 정보/버전

---

## 알림 (푸시)

expo-notifications를 사용한 로컬 푸시 알림. 서버 불필요.

| 알림 종류 | 트리거 시점 | 메시지 예시 |
|----------|-----------|-----------|
| 단식 시작 | 식사 시간 종료 시 | "단식이 시작되었습니다 💪" |
| 단식 종료 | 목표 단식 시간 도달 | "단식 완료! 식사를 시작하세요 🎉" |
| 식사 종료 리마인더 | 식사 마감 30분 전 | "30분 후 단식이 시작됩니다" |
| 중간 격려 | 단식 시간의 50% 지점 | "절반 지났어요! 잘하고 있습니다 🔥" |

---

## 광고 (AdMob)

- 라이브러리: `react-native-google-mobile-ads`
- 개발 시 **테스트 광고 ID만 사용** (정책 위반 방지)
- 배너 광고: 홈 화면 하단 상시 노출
- 전면 광고: 기록 확인 시 3회 중 1회
- 출시 직전에 실제 광고 단위 ID로 교체

---

## 개발 시 주의사항

1. **Expo Go에서 테스트 불가한 기능**: AdMob, 푸시 알림 → EAS dev client 빌드 필요
2. **AsyncStorage 데이터 구조 변경 시**: 마이그레이션 로직 필수 (기존 사용자 데이터 유지)
3. **타이머 백그라운드 동작**: 앱이 백그라운드일 때 타이머는 startTime 기준으로 계산 (setInterval 의존 금지)
4. **날짜/시간 처리**: `new Date()` 직접 사용 대신 ISO 8601 문자열로 저장, 표시 시에만 포맷팅
5. **다크모드**: NativeWind `dark:` 프리픽스로 처리. 시스템 설정 연동 + 수동 토글 지원

---

## 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
style: 스타일/UI 변경 (로직 변경 없음)
refactor: 코드 리팩토링
docs: 문서 수정
chore: 빌드, 설정 등 기타 변경
```

예시:
```
feat: 원형 타이머 컴포넌트 구현
fix: 타이머 백그라운드 복귀 시 시간 동기화 오류 수정
style: 홈 화면 다크모드 색상 적용
```

---

## 빌드 & 배포

```bash
# 개발 빌드 (dev client)
eas build --profile development --platform android

# 프로덕션 빌드
eas build --profile production --platform android

# 스토어 제출
eas submit --platform android
```

---

## 참고 문서

- [Expo 공식 문서](https://docs.expo.dev)
- [NativeWind v4](https://www.nativewind.dev)
- [expo-router](https://docs.expo.dev/router/introduction/)
- [Zustand](https://zustand-demo.pmnd.rs)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [react-native-google-mobile-ads](https://docs.page/invertase/react-native-google-mobile-ads)