import { Tabs } from 'expo-router';
import { Home, Grid, Tag, Phone, Menu } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { COLORS } from '../../constants/theme'; 
import { useTranslation } from 'react-i18next';
// 👇 1. استيراد مكتبة حساب الحواف الآمنة
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { t } = useTranslation();
  
  // 👇 2. حساب المسافة الآمنة للموبايل الحالي
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 0,
          
          // 👇 3. التعديل هنا: الارتفاع والحشو بقوا ديناميكيين
          // بنخلي الارتفاع الأساسي 60 + المسافة السفلية للموبايل (عشان يرتفع فوق الزراير)
          height: 60 + insets.bottom, 
          
          // الحشو من تحت: لو الموبايل ليه حافة (زي الايفون او اندرويد بزراير شاشة) بناخد مقاسها
          // لو ملوش (زراير خارجية) بنسيب مسافة 10 بيكسل بس
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 2,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'), 
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t('services'),
          tabBarIcon: ({ color }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: t('offers'),
          tabBarIcon: ({ color }) => <Tag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: t('contact'),
          tabBarIcon: ({ color }) => <Phone size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t('menu'),
          tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}