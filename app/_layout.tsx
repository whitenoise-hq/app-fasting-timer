import '../global.css';

import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useNotification } from '@/hooks/useNotification';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'NanumBarunpen-Regular': require('../assets/fonts/NanumBarunpenR.ttf'),
    'NanumBarunpen-Bold': require('../assets/fonts/NanumBarunpenB.ttf'),
  });

  const { requestPermissions } = useNotification();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 앱 최초 실행 시 알림 권한 요청
  useEffect(() => {
    requestPermissions();

    // 포그라운드 알림 수신 리스너
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // 포그라운드에서 알림 수신 시 처리 (필요 시 확장)
      }
    );

    // 알림 탭 시 반응 리스너
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // 알림 탭 시 처리 (필요 시 확장)
      }
    );

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
