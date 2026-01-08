import React, { useState, useCallback } from 'react'; // 👈 1. تأكدنا من useState
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Linking, Share, I18nManager, Alert } from 'react-native';
import { 
  User, ChevronLeft, Shield, FileText, Info, Share2, 
  LogOut, Star, Phone, Globe, Languages, HelpCircle, LogIn, Briefcase, Lock
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates'; 
import { COLORS } from '../../constants/theme'; 
import { AuthService } from '../../services/auth';
import { useAlert } from '../../context/AlertContext';
import { LoadingOverlay } from '../../components/LoadingOverlay'; // 👈 2. استدعاء المكون

export default function MenuScreen() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const { t, i18n } = useTranslation(); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 3. متغير التحميل

  useFocusEffect(
    useCallback(() => {
      checkProfile();
    }, [])
  );

  const checkProfile = async () => {
    // ممكن تضيف تحميل هنا لو حابب، بس الأفضل يكون خفي عشان ميزعجش المستخدم كل مرة يفتح القائمة
    const user = await AuthService.getCurrentProfile();
    setProfile(user);
  };

  const handleLogout = async () => {
    showAlert(
      t('logout'), 
      t('confirm_logout_msg') || "هل أنت متأكد من تسجيل الخروج؟", 
      [
        { text: t('cancel'), style: 'cancel' }, 
        { 
          text: t('logout'), 
          onPress: async () => { 
            try {
              setLoading(true); // 👈 شغل التحميل
              await AuthService.signOut();
              setProfile(null);
              router.replace('/auth/login');
            } catch (e) { 
              console.log(e); 
            } finally {
              setLoading(false); // 👈 وقف التحميل
            }
          } 
        }
      ],
      'warning' 
    );
  };

  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    const isNextRTL = nextLang === 'ar'; // عربي = يمين

    try {
        setLoading(true); // 👈 شغل التحميل
        
        // 1. حفظ اللغة الجديدة
        await AsyncStorage.setItem('language', nextLang);
        await i18n.changeLanguage(nextLang);
        
        // 2. ضبط الاتجاه وعمل ريستارت
        if (I18nManager.isRTL !== isNextRTL) {
            I18nManager.allowRTL(isNextRTL);
            I18nManager.forceRTL(isNextRTL);
            
            // ريستارت فوري
            if (!__DEV__) {
                await Updates.reloadAsync();
            } else {
                // لو احنا في الـ Development
                setLoading(false); // وقف التحميل عشان الرسالة تظهر
                alert('تم تغيير اللغة. يرجى عمل Reload يدوي للتطبيق لتعديل الاتجاه.');
            }
        } else {
            setLoading(false); // لو مفيش تغيير اتجاه
        }
    } catch (error) {
        setLoading(false);
        Alert.alert(t('alert_error'), "Error changing language");
    }
  };

  const handleShare = async () => {
    try { 
        await Share.share({ message: t('share_msg_content') }); 
    } 
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
        <View style={{ flex: 1 }}> 
            <Text style={[styles.menuTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
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
                    <Text style={styles.userName}>
                        {profile ? profile.full_name : t('guest')}
                    </Text>
                    <Text style={styles.userRole}>
                        {profile ? profile.facility_name : t('new_client')}
                    </Text>
                </View>
                {!profile && (
                  <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/auth/login')}>
                      <Text style={styles.editBtnText}>{t('login')}</Text>
                  </TouchableOpacity>
                )}
            </LinearGradient>
        </View>

        {/* 2. My Orders & Security */}
        {profile && (
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>{t('account_section')}</Text>
                <View style={styles.sectionBody}>
                    <MenuItem 
                        icon={Briefcase} 
                        title={t('my_orders_title')} 
                        subtitle={t('my_orders_desc')}
                        onPress={() => router.push('/orders')} 
                    />
                    <View style={styles.divider} />
                    <MenuItem 
                        icon={Lock} 
                        title={t('change_password_menu')} 
                        subtitle={t('security_settings')}
                        onPress={() => router.push('/profile/change-password')} 
                    />
                </View>
            </View>
        )}

        {/* 3. General Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{t('general')}</Text>
          <View style={styles.sectionBody}>
             <MenuItem 
               icon={Languages} 
               title={t('change_lang')} 
               subtitle={t('other_lang_name')}
               color={COLORS.info}
               onPress={toggleLanguage} 
             />
             <View style={styles.divider} />
             
             <MenuItem 
               icon={HelpCircle} 
               title={t('faq_title')} 
               subtitle={t('faq_subtitle')}
               color={COLORS.info}
               onPress={() => router.push('/faq')} 
             />
             <View style={styles.divider} />
             
             <MenuItem icon={Info} title={t('about_us')} onPress={() => router.push('/about')} />
             <View style={styles.divider} />
             <MenuItem icon={Star} title={t('partners')} onPress={() => router.push('/about')} />
             <View style={styles.divider} />
             <MenuItem icon={Phone} title={t('contact')} onPress={() => router.push('/(tabs)/contact')} />
          </View>
        </View>

        {/* 4. App Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{t('app_section')}</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Share2} title={t('share_app')} color={COLORS.secondary} onPress={handleShare} />
             <View style={styles.divider} />
             <MenuItem icon={Globe} title={t('visit_website')} color={COLORS.secondary} onPress={() => Linking.openURL('https://offfire.online')} />
          </View>
        </View>

        {/* 5. Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{t('legal')}</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Shield} title={t('privacy')} color={COLORS.textSecondary} onPress={() => router.push('/privacy')} />
             <View style={styles.divider} />
             <MenuItem icon={FileText} title={t('terms')} color={COLORS.textSecondary} onPress={() => router.push('/terms')} />
          </View>
        </View>

        {/* 6. Auth Actions */}
        {profile ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>{t('logout')}</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: COLORS.info }]} onPress={() => router.push('/auth/login')}>
                <LogIn size={20} color={COLORS.info} />
                <Text style={[styles.logoutText, { color: COLORS.info }]}>{t('login')}</Text>
            </TouchableOpacity>
        )}

        <Text style={styles.versionText}>{t('version')} 1.0.0 • {t('app_name_text')}</Text>

      </ScrollView>
      {/* 👈 4. إضافة مكون التحميل في النهاية */}
      <LoadingOverlay visible={loading} type="processing" />
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
  
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16 
  },
  menuLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15, 
    flex: 1 
  },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  
  menuTitle: { 
    color: COLORS.textPrimary, 
    fontSize: 16, 
    fontWeight: '500', 
    textAlign: 'left' 
  },
  menuSubtitle: { 
    color: COLORS.textSecondary, 
    fontSize: 11, 
    textAlign: 'left' 
  },
  
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 60 },

  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 16, 
    marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' 
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

  versionText: { color: COLORS.textSecondary, textAlign: 'center', fontSize: 12, opacity: 0.5 },
});