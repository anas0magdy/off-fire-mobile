import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, Grid, Percent, Phone, Menu } from 'lucide-react-native';
import { COLORS } from '../../constants/data';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // هنخفي الهيدر العلوي الافتراضي
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'android' ? 70 : 90, // ارتفاع الشريط
          paddingBottom: Platform.OS === 'android' ? 12 : 30,
          paddingTop: 12,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.subText,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'خدماتنا',
          tabBarIcon: ({ color }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: 'العروض',
          tabBarIcon: ({ color }) => <Percent size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'اتصل بنا',
          tabBarIcon: ({ color }) => <Phone size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'المزيد',
          tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}