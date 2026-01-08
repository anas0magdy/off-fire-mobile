import '../services/i18n';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, I18nManager } from 'react-native';
import { COLORS } from '../constants/theme';
import { useEffect, useState, useCallback } from 'react';
import OfflineBanner from '../components/OfflineBanner';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertProvider } from '../context/AlertContext';
import { initializeNotifications } from '../services/notifications';
import * as Updates from 'expo-updates';
import { supabase } from '../services/supabase';
// 👇 1. استيراد Linking عشان نمسك الرابط
import * as Linking from 'expo-linking';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null); 

  useEffect(() => {
    async function prepare() {
      try {
        // --- 1. التعامل مع اللغة (زي ما هو) ---
        const savedLang = await AsyncStorage.getItem('language');
        const isAr = savedLang === 'ar' || (!savedLang && I18nManager.isRTL); 
        const currentIsRTL = I18nManager.isRTL;
        if (currentIsRTL !== isAr) {
            I18nManager.allowRTL(isAr);
            I18nManager.forceRTL(isAr);
            if (!__DEV__) await Updates.reloadAsync();
            return; 
        }

        // --- 2. تهيئة الإشعارات ---
        await initializeNotifications(); 

        // --- 3. (الإضافة الجديدة) التعامل مع روابط استعادة الباسورد ---
        const handleDeepLink = async (url) => {
          if (!url) return;
          
          // لو الرابط جاي من Supabase وفيه توكن
          if (url.includes('access_token') || url.includes('type=recovery')) {
            // استخراج البارامترات من الرابط
            const params = {};
            // بنبدل # بـ ? عشان نعرف نطلع الداتا بسهولة لو جاية في Hash
            const cleanUrl = url.replace('#', '?');
            cleanUrl.replace(/([^?&=]+)=([^&]*)/g, (_, key, value) => {
              params[key] = decodeURIComponent(value);
            });

            const accessToken = params['access_token'];
            const refreshToken = params['refresh_token'];

            if (accessToken && refreshToken) {
              // 🔥 هنا السحر: بنجبر Supabase يعمل جلسة
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              
              if (!error) {
                console.log("✅ Session recovered from link!");
                // توجيه لصفحة تغيير الباسورد فوراً
                router.replace('/profile/change-password');
              }
            }
          }
        };

        // الكشف عن الرابط لو التطبيق كان مقفول
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) handleDeepLink(initialUrl);

        // الكشف عن الرابط لو التطبيق مفتوح في الخلفية
        Linking.addEventListener('url', ({ url }) => handleDeepLink(url));


        // --- 4. توجيه البداية ---
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding === 'true') {
            setInitialRoute('/(tabs)');
        } else {
            setInitialRoute('/onboarding');
        }

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && initialRoute) {
      await SplashScreen.hideAsync();
      router.replace(initialRoute);
    }
  }, [appIsReady, initialRoute]);

  if (!appIsReady || !initialRoute) {
    return null; 
  }

  return (
    <AlertProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.background }} onLayout={onLayoutRootView}>
        <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />
        <OfflineBanner />
        
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="service-details" options={{ presentation: 'card' }} />
          <Stack.Screen name="blog-details" options={{ presentation: 'card' }} />
          <Stack.Screen name="quote" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="about" options={{ presentation: 'modal' }} />
          <Stack.Screen name="faq" options={{ presentation: 'modal' }} />
          <Stack.Screen name="privacy" options={{ presentation: 'modal' }} />
          <Stack.Screen name="terms" options={{ presentation: 'modal' }} />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="orders/index" />
          <Stack.Screen name="order-details/[id]" />
          <Stack.Screen name="profile/change-password" options={{ presentation: 'card' }} />
        </Stack>
      </View>
    </AlertProvider>
  );
}