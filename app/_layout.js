import '../services/i18n'; // 👈 ده السطر الجديد المهم جداً
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, I18nManager } from 'react-native';
import { COLORS } from '../constants/theme';
import { useEffect } from 'react';

export default function RootLayout() {
  
  useEffect(() => {
    // التأكد من الاتجاه عند بدء التشغيل
    // لو اللغة عربي والاتجاه مش يمين، اجبره يبقى يمين
    const isRTL = I18nManager.isRTL;
    if (isRTL && !I18nManager.isRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />
      
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="service-details" options={{ presentation: 'card' }} />
        <Stack.Screen name="blog-details" options={{ presentation: 'card' }} />
        <Stack.Screen name="quote" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="about" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}