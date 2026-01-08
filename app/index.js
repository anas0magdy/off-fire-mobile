import { useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme'; 
import { FireExtinguisher } from 'lucide-react-native';
import { startAutoSync } from '../services/syncService';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 استدعاء المكتبة

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // تشغيل المزامنة التلقائية
    const stopSync = startAutoSync();

    const checkOnboarding = async () => {
      try {
        // ننتظر 2 ثانية عشان اللوجو ياخد وقته
        await new Promise(resolve => setTimeout(resolve, 2000));

        // نفحص هل العميل شاف الـ Onboarding قبل كده؟
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

        if (hasSeenOnboarding === 'true') {
          // لو شافه، وديه على التابات الرئيسية علطول
          router.replace('/(tabs)');
        } else {
          // لو أول مرة، وديه شرح التطبيق
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // في حالة الخطأ، وديه للـ Onboarding كإجراء احتياطي
        router.replace('/onboarding');
      }
    };

    checkOnboarding();

    return () => {
      stopSync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.iconBox}>
        <FireExtinguisher size={60} color={COLORS.primary} />
      </View>

      <Text style={styles.title}>
        OFF FIRE
      </Text>
      
      <Text style={styles.subtitle}>
        ONLINE
      </Text>

      {/* مؤشر تحميل عشان المستخدم يعرف إننا بنجهز البيانات */}
      <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  iconBox: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 24, 
    borderRadius: 24, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  title: { 
    color: '#FFFFFF', 
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  subtitle: { 
    color: COLORS.primary, 
    fontSize: 16, 
    letterSpacing: 8, 
    fontWeight: 'bold', 
    marginTop: 8 
  }
});