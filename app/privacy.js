import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, I18nManager, Linking 
} from 'react-native';
import { ArrowLeft, ArrowRight, Shield, Mail, Lock, Eye, UserCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';

export default function PrivacyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const isRTL = I18nManager.isRTL;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowLeft; // في contact.js كان مستخدم ArrowRight مقلوب، هنا Left شغال برده
  // لو حابب توحدها زي contact.js:
  // const ArrowIcon = isRTL ? ArrowLeft : ArrowRight; (مع التحويل)
  
  const privacySections = [
    { id: 1, icon: Shield, title: t('privacy_section1_title'), content: t('privacy_section1_content') },
    { id: 2, icon: UserCheck, title: t('privacy_section2_title'), content: t('privacy_section2_content') },
    { id: 3, icon: Eye, title: t('privacy_section3_title'), content: t('privacy_section3_content') },
    { id: 4, icon: Lock, title: t('privacy_section4_title'), content: t('privacy_section4_content') },
    { id: 5, icon: Shield, title: t('privacy_section5_title'), content: t('privacy_section5_content') },
    { id: 6, icon: UserCheck, title: t('privacy_section6_title'), content: t('privacy_section6_content') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.background, 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowIcon size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {t('privacy_policy')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('privacy_last_updated')}
            </Text>
          </View>
          
          <Shield size={24} color={COLORS.primary} />
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Shield size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.introText}>
            {t('privacy_intro') || 'نحن نحمي خصوصيتك ونسعى لضمان أمان معلوماتك في كل خطوة.'}
          </Text>
        </View>
        
        {/* Privacy Sections */}
        <View style={styles.sectionsContainer}>
          {privacySections.map((section) => {
            const Icon = section.icon;
            return (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)']}
                    style={styles.sectionIconContainer}
                  >
                    <Icon size={20} color={COLORS.primary} />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>
                    {section.title}
                  </Text>
                </View>
                <Text style={styles.sectionContent}>
                  {section.content}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Contact Section */}
        <View style={styles.contactSection}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.contactCard}
          >
            <Mail size={28} color={COLORS.cta} style={{ marginBottom: 16 }} />
            
            <Text style={styles.contactTitle}>
              {t('privacy_contact')}
            </Text>
            
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => Linking.openURL('mailto:info@offfire.online')}
            >
              <Text style={styles.emailText}>
                info@offfire.online
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.contactDesc}>
              {t('privacy_contact_desc') || 'نحن نرحب باستفساراتك وملاحظاتك حول سياسة الخصوصية'}
            </Text>
          </LinearGradient>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  
  // Header
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SIZES.base * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'left',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.9,
    textAlign: 'left',
  },
  
  // Scroll Content
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  
  // Intro Card
  introCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: SIZES.base * 2,
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    elevation: 3,
  },
  introIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  introText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    textAlign: 'center',
  },
  
  // Sections Container
  sectionsContainer: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 40,
  },
  
  // Section Card
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 2,
    alignItems: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'left',
  },
  sectionContent: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    textAlign: 'left',
  },
  
  // Contact Section
  contactSection: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 60,
  },
  contactCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emailButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  emailText: {
    color: COLORS.cta,
    fontSize: 16,
    fontWeight: '600',
  },
  contactDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
  },
});