import '../global.css';

import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { useNotification } from '@/hooks/useNotification';

/** Expo Go 환경인지 확인 */
const isExpoGo = Constants.appOwnership === 'expo';

// Expo Go가 아닐 때만 Notifications 로드
let Notifications: typeof import('expo-notifications') | null = null;
if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'NanumBarunpen-Regular': require('../assets/fonts/NanumBarunpenR.ttf'),
    'NanumBarunpen-Bold': require('../assets/fonts/NanumBarunpenB.ttf'),
  });

  const { requestPermissions } = useNotification();
  const notificationListener = useRef<{ remove: () => void } | null>(null);
  const responseListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 앱 최초 실행 시 알림 권한 요청
  useEffect(() => {
    requestPermissions();

    if (Notifications) {
      // 포그라운드 알림 수신 리스너
      notificationListener.current = Notifications.addNotificationReceivedListener(
        () => {
          // 포그라운드에서 알림 수신 시 처리 (필요 시 확장)
        }
      );

      // 알림 탭 시 반응 리스너
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        () => {
          // 알림 탭 시 처리 (필요 시 확장)
        }
      );
    }

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [requestPermissions]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
