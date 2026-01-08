import React from 'react';
import { 
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, 
  StatusBar, Dimensions, I18nManager 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, ArrowRight, Target, Shield, Users, Award, 
  Clock, CheckCircle, Building, Factory, GraduationCap, 
  HardHat, Sparkles, ChevronRight, Star, Zap, Globe, Heart 
} from 'lucide-react-native';import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../constants/theme';
import { IMAGES } from '../constants/data';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  // عكس اتجاه السهم فقط
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  const COMPANY_VALUES = [
    { id: 1, icon: Shield, title: t('value_transparency'), desc: t('value_transparency_desc'), color: '#3b82f6' },
    { id: 2, icon: Clock, title: t('value_speed'), desc: t('value_speed_desc'), color: '#10b981' },
    { id: 3, icon: Award, title: t('value_quality'), desc: t('value_quality_desc'), color: '#f59e0b' },
    { id: 4, icon: Users, title: t('value_expertise'), desc: t('value_expertise_desc'), color: '#8b5cf6' },
  ];

  const TARGET_SECTORS = [
    { id: 1, title: t('sector_commercial'), icon: Building, color: '#3b82f6' },
    { id: 2, title: t('sector_industrial'), icon: Factory, color: '#ef4444' },
    { id: 3, title: t('sector_education'), icon: GraduationCap, color: '#10b981' },
    { id: 4, title: t('sector_developers'), icon: HardHat, color: '#f59e0b' },
  ];

  const WHY_US_POINTS = [
      t('why_point_1'), t('why_point_2'), t('why_point_3'),
      t('why_point_4'), t('why_point_5'), t('why_point_6')
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* HERO SECTION */}
      <View style={styles.heroContainer}>
        <Image source={IMAGES.hero1} style={styles.heroImage} blurRadius={2} />
        <LinearGradient 
          colors={['rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.7)', 'rgba(2, 6, 23, 0.95)']}
          style={styles.heroGradient}
        >
          {/* Floating Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#ffffff" style={iconTransform} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{t('about_us')}</Text>
              <Text style={styles.headerSubtitle}>OFF FIRE ONLINE</Text>
            </View>
            <View style={styles.headerIcon}>
              <Star size={22} color={COLORS.primary} fill={COLORS.primary} />
            </View>
          </View>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Sparkles size={16} color="#fbbf24" />
              <Text style={styles.heroBadgeText}>{t('about_hero_badge')}</Text>
            </View>
            
            <Text style={styles.heroMainTitle}>
              {t('about_hero_title_1')} <Text style={{color: COLORS.primary}}>{t('about_hero_title_2')}</Text> {t('about_hero_title_3')}
            </Text>
            
            <Text style={styles.heroDescription}>
              {t('about_intro')}
            </Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Our Mission */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionIcon}>
              <Target size={24} color={COLORS.primary} />
            </View>
            <View style={styles.sectionHeaderContent}>
              <Text style={styles.sectionTitle}>
                {t('mission_title')}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {t('mission_desc')}
              </Text>
            </View>
          </View>
          
          <View style={styles.missionCard}>
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)']}
              style={styles.missionContent}
            >
              <View style={styles.missionPoints}>
                <View style={styles.missionPoint}>
                  <View style={[styles.missionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Zap size={20} color="#3b82f6" />
                  </View>
                  <Text style={styles.missionPointText}>{t('mission_speed')}</Text>
                </View>
                
                <View style={styles.missionPoint}>
                  <View style={[styles.missionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                    <Shield size={20} color="#10b981" />
                  </View>
                  <Text style={styles.missionPointText}>{t('mission_quality')}</Text>
                </View>
                
                <View style={styles.missionPoint}>
                  <View style={[styles.missionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                    <Globe size={20} color="#8b5cf6" />
                  </View>
                  <Text style={styles.missionPointText}>{t('mission_coverage')}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Our Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleLarge}>
            {t('values_title')}
          </Text>
          
          <View style={styles.valuesGrid}>
            {COMPANY_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <View key={value.id} style={styles.valueCardWrapper}>
                  <LinearGradient
                    colors={[`${value.color}20`, `${value.color}05`]}
                    style={styles.valueCard} 
                  >
                    <View style={[styles.valueIconContainer, { backgroundColor: `${value.color}15` }]}>
                      <Icon size={24} color={value.color} />
                    </View>
                    <Text style={styles.valueTitle}>{value.title}</Text>
                    <Text style={styles.valueDesc}>{value.desc}</Text>
                  </LinearGradient>
                </View>
              );
            })}
          </View>
        </View>

        {/* Target Sectors */}
        <View style={styles.section}>
          <View style={styles.sectorHeader}>
            <View style={styles.sectorHeaderContent}>
              <Text style={styles.sectionTitleLarge}>
                {t('sectors_header')}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {t('sectors_subtitle')}
              </Text>
            </View>
            <View style={styles.sectorHeaderIcon}>
              <Building size={28} color={COLORS.primary} />
            </View>
          </View>
          
          <View style={styles.sectorsGrid}>
            {TARGET_SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <TouchableOpacity
                  key={sector.id}
                  style={styles.sectorCard}
                  activeOpacity={0.9}
                  onPress={() => router.push('/services')}
                >
                  <LinearGradient
                    colors={[`${sector.color}20`, `${sector.color}05`]}
                    style={styles.sectorCardGradient}
                  >
                    <View style={styles.sectorCardHeader}>
                      <View style={[styles.sectorIcon, { backgroundColor: `${sector.color}15` }]}>
                        <Icon size={22} color={sector.color} />
                      </View>
                      <Text style={styles.sectorTitle}>{sector.title}</Text>
                    </View>
                    
                    <View style={styles.sectorFooter}>
                      <Text style={styles.sectorAction}>
                        {t('explore_services')}
                      </Text>
                      <ChevronRight size={16} color={sector.color} style={iconTransform} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
            style={styles.whyUsContainer}
          >
            <View style={styles.whyUsHeader}>
              <View style={styles.whyUsIcon}>
                <Heart size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.whyUsTitle}>
                {t('why_us_header')}
              </Text>
            </View>
            
            <View style={styles.whyUsPoints}>
              {WHY_US_POINTS.map((point, index) => (
                <View key={index} style={styles.whyUsPoint}>
                  <View style={styles.whyUsCheck}>
                    <CheckCircle size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.whyUsPointText}>{point}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Final CTA */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#0f172a', '#1e293b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.finalCta}
          >
            <View style={styles.ctaIcon}>
              <Sparkles size={36} color={COLORS.primary} />
            </View>
            
            <Text style={styles.ctaTitle}>
              {t('final_cta_title')}
            </Text>
            
            <Text style={styles.ctaDesc}>
              {t('final_cta_desc')}
            </Text>
            
            <View style={styles.ctaButtons}>
              <TouchableOpacity 
                style={styles.primaryCtaButton}
                onPress={() => router.push('/quote')}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryCtaText}>
                  {t('request_quote')}
                </Text>
                <ArrowRight size={20} color={COLORS.background} style={iconTransform} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryCtaButton}
                onPress={() => router.push('/(tabs)/contact')}
                activeOpacity={0.9}
              >
                <Text style={styles.secondaryCtaText}>
                  {t('hero_cta_secondary')}
                </Text>
              </TouchableOpacity>
            </View>
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
  
  // Hero Section
  heroContainer: {
    height: 390,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: SIZES.base * 2,
  },
  
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    opacity: 0.9,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
    alignItems: 'flex-start', // Standard
  },
  heroBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroBadgeText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '700',
  },
  heroMainTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'left',
  },
  heroDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'left',
  },
  
  // Scroll Content
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 100,
  },
  
  // Sections
  section: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: SIZES.extraLarge * 1.2,
  },
  
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  sectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  sectionHeaderContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'left',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'left',
  },
  sectionTitleLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    letterSpacing: -0.3,
    textAlign: 'left',
  },
  
  // Mission Card
  missionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  missionContent: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  missionPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  missionPoint: {
    alignItems: 'center',
    flex: 1,
  },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  missionPointText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Values Grid
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  valueCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 180,
    elevation: 3,
    alignItems: 'flex-start',
  },
  valueIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  valueTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'left',
  },
  valueDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'left',
  },
  
  // Sectors
  sectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectorHeaderContent: {
    flex: 1,
  },
  sectorHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectorCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
  },
  sectorCardGradient: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    minHeight: 190,
    justifyContent: 'space-between',
  },
  sectorCardHeader: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectorIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'left',
  },
  sectorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sectorAction: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'left',
  },
  
  // Why Us
  whyUsContainer: {
    borderRadius: 24,
    padding: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  whyUsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  whyUsIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyUsTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'left',
  },
  whyUsPoints: {
    gap: 14,
  },
  whyUsPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  whyUsCheck: {
    marginTop: 2,
  },
  whyUsPointText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    textAlign: 'left',
  },
  
  // Final CTA
  finalCta: {
    borderRadius: 24,
    padding: 32,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    elevation: 8,
  },
  ctaIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDesc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    maxWidth: '90%',
  },
  ctaButtons: {
    width: '100%',
    gap: 12,
  },
  primaryCtaButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 6,
  },
  primaryCtaText: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryCtaButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryCtaText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});