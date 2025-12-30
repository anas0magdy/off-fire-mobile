import { Tabs } from 'expo-router';
import { Home, Grid, Tag, Phone, Menu } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { COLORS } from '../../constants/theme'; 
import { useTranslation } from 'react-i18next'; // 👈 استيراد هوك الترجمة

export default function TabLayout() {
  const { t } = useTranslation(); // 👈 تفعيل الترجمة

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface, // استخدامنا لألوان الثيم الجديد
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 2,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // خط افتراضي مؤقت
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // هنا بنستخدم t('home') عشان يجيب الكلمة من ملف json
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