import { useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { COLORS } from '../constants/data'; // تأكد إن المسار صح

export default function RootLayout() {
  
  // الكود ده هيتنفذ أول ما التطبيق يفتح عشان يجبره يكون عربي
  if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      
      // في بعض الحالات بيحتاج ريستارت للتطبيق عشان يطبق التغيير
      // بس Expo Router بيحاول يطبقها علطول
  }

  return (
    <View style={{ flex: 1, direction: 'rtl' }}> 
      <StatusBar style="light" backgroundColor={COLORS.dark} />
      
      {/* إعدادات التنقل الرئيسية */}
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { direction: 'rtl' } // زيادة تأكيد
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quote" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}