import { useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
// 👇 تأكد إن المسار ده صح ويشير لملف الثيم الجديد اللي عملناه
import { COLORS } from '../constants/theme'; 
import { FireExtinguisher } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // محاكاة تحميل.. ثم الانتقال للرئيسية
    const timer = setTimeout(() => {
      router.replace('/onboarding'); // تأكد إن الصفحة دي موجودة
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* دائرة الأيقونة بشفافية عشان تليق مع الخلفية الداكنة */}
      <View style={styles.iconBox}>
        <FireExtinguisher size={60} color={COLORS.primary} />
      </View>

      <Text style={styles.title}>
        OFF FIRE
      </Text>
      
      <Text style={styles.subtitle}>
        ONLINE
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, // الخلفية الموحدة #0B1120
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  iconBox: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // لون خفيف جداً ورا الأيقونة
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
    color: COLORS.primary, // اللون الأحمر المميز
    fontSize: 16, 
    letterSpacing: 8, 
    fontWeight: 'bold', 
    marginTop: 8 
  }
});