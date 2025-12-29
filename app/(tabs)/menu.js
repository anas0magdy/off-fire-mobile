import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Linking, Share, Image } from 'react-native';
import { 
  User, ChevronLeft, Shield, FileText, Info, Share2, 
  LogOut, Star, Phone, Globe, HelpCircle 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, IMAGES } from '../../constants/data';

export default function MenuScreen() {
  const router = useRouter();

  const handleShare = async () => {
    try { await Share.share({ message: 'حمل تطبيق OFF FIRE ONLINE الآن!' }); } 
    catch (error) { console.log(error.message); }
  };

  const openLink = (url) => Linking.openURL(url);

  // مكون الصف (List Item)
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
      <ChevronLeft size={18} color={COLORS.subText} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} translucent />
      
      {/* Background Gradient */}
      <LinearGradient colors={[COLORS.darker, COLORS.dark]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Profile Section */}
        <View style={styles.profileSection}>
            <LinearGradient
                colors={[COLORS.card, COLORS.dark]}
                style={styles.profileCard}
            >
                <View style={styles.avatarContainer}>
                    <User size={30} color={COLORS.primary} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.userName}>زائر</Text>
                    <Text style={styles.userRole}>عميل جديد</Text>
                </View>
                <TouchableOpacity style={styles.editBtn}>
                    <Text style={styles.editBtnText}>تسجيل دخول</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>

        {/* 2. General Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>عام</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Info} title="من نحن" subtitle="قصتنا ورؤيتنا" onPress={() => router.push('/about')} />
             <View style={styles.divider} />
             <MenuItem icon={Star} title="شركاء النجاح" onPress={() => router.push('/about')} />
             <View style={styles.divider} />
             <MenuItem icon={Phone} title="تواصل معنا" onPress={() => router.push('/(tabs)/contact')} />
          </View>
        </View>

        {/* 3. App Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>التطبيق</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Share2} title="شارك التطبيق" color={COLORS.cta} onPress={handleShare} />
             <View style={styles.divider} />
             <MenuItem icon={Globe} title="زيارة الموقع الإلكتروني" color={COLORS.cta} onPress={() => openLink('https://offfire.online')} />
          </View>
        </View>

        {/* 4. Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>القانونية</Text>
          <View style={styles.sectionBody}>
             <MenuItem icon={Shield} title="سياسة الخصوصية" color={COLORS.subText} onPress={() => {}} />
             <View style={styles.divider} />
             <MenuItem icon={FileText} title="الشروط والأحكام" color={COLORS.subText} onPress={() => {}} />
          </View>
        </View>

        {/* 5. Logout / Footer */}
        <TouchableOpacity style={styles.logoutBtn}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>الإصدار 1.0.0 • OFF FIRE ONLINE</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 100 },

  // Profile
  profileSection: { marginBottom: 30 },
  profileCard: { 
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, 
    borderWidth: 1, borderColor: COLORS.border 
  },
  avatarContainer: { 
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(245, 158, 11, 0.15)', 
    alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: COLORS.primary 
  },
  userName: { color: COLORS.white, fontSize: 20, fontWeight: 'bold', textAlign: 'left' },
  userRole: { color: COLORS.subText, fontSize: 14, textAlign: 'left' },
  editBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  editBtnText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 12 },

  // Sections
  sectionContainer: { marginBottom: 25 },
  sectionHeader: { color: COLORS.subText, fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginLeft: 10, textAlign: 'left' },
  sectionBody: { backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { color: COLORS.white, fontSize: 16, fontWeight: '500', textAlign: 'left' },
  menuSubtitle: { color: COLORS.subText, fontSize: 11, textAlign: 'left' },
  
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 60 },

  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 16, 
    marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' 
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },

  versionText: { color: COLORS.subText, textAlign: 'center', fontSize: 12, opacity: 0.5 },
});