import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Linking, Share, I18nManager, Alert } from 'react-native';
import { 
  User, ChevronLeft, Shield, FileText, Info, Share2, 
  LogOut, Star, Phone, Globe, Languages 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next'; // هوك الترجمة
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme'; // استخدام الثيم مباشرة

export default function MenuScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation(); // استدعاء أدوات الترجمة

  // دالة تغيير اللغة
  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    const isRTL = nextLang === 'ar';

    // 1. تغيير اللغة في التطبيق فوراً
    await i18n.changeLanguage(nextLang);
    
    // 2. حفظ اختيار المستخدم
    await AsyncStorage.setItem('language', nextLang);

    // 3. ضبط الاتجاه (لو تغير الاتجاه لازم تنبيه المستخدم)
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      
      // بما أن expo-updates فيه مشكلة، هنطلب من المستخدم يعيد تشغيل التطبيق يدوياً
      Alert.alert(
        nextLang === 'ar' ? "تم تغيير اللغة" : "Language Changed",
        nextLang === 'ar' 
          ? "يرجى إغلاق التطبيق وفتحه مجدداً لتطبيق الاتجاه العربي بالكامل." 
          : "Please restart the app to apply English layout correctly.",
        [{ text: "OK" }]
      );
    }
  };

  const handleShare = async () => {
    try { await Share.share({ message: 'OFF FIRE ONLINE App' }); } 
    catch (error) { console.log(error.message); }
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, color = COLORS.primary, isDestructive = false }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : `${color}15` }]}>
          <Icon size={20} color={isDestructive ? '#EF4444' : color} />
        </View>
        <View>
            <Text style={[styles.menuTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {/* عكس السهم لو اللغة إنجليزي */}
      <ChevronLeft 
        size={18} 
        color={COLORS.textSecondary} 
        style={{ transform: [{ rotate: I18nManager.isRTL ? '0deg' : '180deg' }] }} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Profile Section */}
        <View style={styles.profileSection}>
            <LinearGradient
                colors={[COLORS.surface, COLORS.background]}
                style={styles.profileCard}
            >
                <View style={styles.avatarContainer}>
                    <User size={30} color={COLORS.primary} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.userName}>{t('guest')}</Text>
                    <Text style={styles.userRole}>{t('new_client')}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.editBtnText}>{t('login')}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>

        {/* 2. Language Switcher (New!) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{t('general')}</Text>
          <View style={styles.sectionBody}>
             {/* زر تغيير اللغة */}
             <MenuItem 
                icon={Languages} 
                title={t('change_lang')} 
                subtitle={i18n.language === 'ar' ? 'English' : 'العربية'}
                color={COLORS.info}
                onPress={toggleLanguage} 
             />
             <View style={styles.divider} />
             <MenuItem icon={Info} title={t('about_us')} onPress={() => router.push('/about')} />
             <View style={styles.divider} />
             <MenuItem icon={Star} title={t('partners')} onPress={() => router.push('/about')} />
             <View style={styles.divider} />
             <MenuItem icon={Phone} title={t('contact')} onPress={() => router.push('/(tabs)/contact')} />
          </View>
        </View>

        {/* 3. App Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{t('app_section')}</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Share2} title={t('share_app')} color={COLORS.secondary} onPress={handleShare} />
             <View style={styles.divider} />
             <MenuItem icon={Globe} title={t('visit_website')} color={COLORS.secondary} onPress={() => Linking.openURL('https://offfire.online')} />
          </View>
        </View>

        {/* 4. Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{t('legal')}</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Shield} title={t('privacy')} color={COLORS.textSecondary} onPress={() => {}} />
             <View style={styles.divider} />
             <MenuItem icon={FileText} title={t('terms')} color={COLORS.textSecondary} onPress={() => {}} />
          </View>
        </View>

        {/* 5. Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>{t('version')} 1.0.0 • OFF FIRE ONLINE</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 100 },

  profileSection: { marginBottom: 30 },
  profileCard: { 
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: COLORS.border 
  },
  avatarContainer: { 
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryDim, 
    alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: COLORS.primary 
  },
  userName: { color: COLORS.textPrimary, fontSize: 20, fontWeight: 'bold', textAlign: 'left' },
  userRole: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'left' },
  editBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  editBtnText: { color: COLORS.background, fontWeight: 'bold', fontSize: 12 },

  sectionContainer: { marginBottom: 25 },
  sectionHeader: { color: COLORS.textSecondary, fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 10, textAlign: 'left' },
  sectionBody: { backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '500', textAlign: 'left' },
  menuSubtitle: { color: COLORS.textSecondary, fontSize: 11, textAlign: 'left' },
  
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 60 },

  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 16, 
    marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' 
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

  versionText: { color: COLORS.textSecondary, textAlign: 'center', fontSize: 12, opacity: 0.5 },
});