import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, I18nManager 
} from 'react-native';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, Shield, Edit } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';

export default function TermsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const isRTL = I18nManager.isRTL;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowLeft;
  
  const termsSections = [
    { id: 1, icon: CheckCircle, title: t('terms_section1_title'), content: t('terms_section1_content') },
    { id: 2, icon: FileText, title: t('terms_section2_title'), content: t('terms_section2_content') },
    { id: 3, icon: AlertTriangle, title: t('terms_section3_title'), content: t('terms_section3_content') },
    { id: 4, icon: Scale, title: t('terms_section4_title'), content: t('terms_section4_content') },
    { id: 5, icon: Shield, title: t('terms_section5_title'), content: t('terms_section5_content') },
    { id: 6, icon: Edit, title: t('terms_section6_title'), content: t('terms_section6_content') },
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
              {t('terms_conditions')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('terms_last_updated')}
            </Text>
          </View>
          
          <FileText size={24} color={COLORS.primary} />
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <AlertTriangle size={24} color="#f59e0b" />
          </View>
          <Text style={styles.noticeText}>
            {t('terms_notice') || 'يرجى قراءة الشروط والأحكام بعناية قبل استخدام المنصة'}
          </Text>
        </View>
        
        {/* Terms Sections */}
        <View style={styles.sectionsContainer}>
          {termsSections.map((section) => {
            const Icon = section.icon;
            return (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.05)']}
                    style={styles.sectionIconContainer}
                  >
                    <Icon size={20} color={COLORS.cta} />
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
        
        {/* Acceptance Section */}
        <View style={styles.acceptanceSection}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
            style={styles.acceptanceCard}
          >
            <CheckCircle size={28} color={COLORS.primary} style={{ marginBottom: 16 }} />
            
            <Text style={styles.acceptanceTitle}>
              {t('acceptance') || 'القبول'}
            </Text>
            
            <Text style={styles.acceptanceText}>
              {t('terms_acceptance')}
            </Text>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueButtonText}>
                {t('i_understand') || 'أوافق وأفهم'}
              </Text>
            </TouchableOpacity>
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
  
  // Notice Card
  noticeCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: SIZES.base * 2,
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  noticeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'left',
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
  
  // Acceptance Section
  acceptanceSection: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 60,
  },
  acceptanceCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
  },
  acceptanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  acceptanceText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: '90%',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
  },
  continueButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});