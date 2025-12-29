import { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/data';
import { FireExtinguisher } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // محاكاة تحميل.. ثم الانتقال للرئيسية
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, marginBottom: 20 }}>
        <FireExtinguisher size={60} color="white" />
      </View>
      <Text style={{ color: COLORS.white, fontSize: 32, fontWeight: '900', letterSpacing: 1 }}>
        OFF FIRE
      </Text>
      <Text style={{ color: COLORS.cta, fontSize: 16, letterSpacing: 8, fontWeight: 'bold', marginTop: 5 }}>
        ONLINE
      </Text>
    </View>
  );
}