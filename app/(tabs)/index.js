import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, ImageBackground, Image, Dimensions, I18nManager, Platform 
} from 'react-native';
import { Bell, ArrowRight, ChevronRight, CheckCircle, Clock, 
        Zap, Shield, Users, Target, MessageSquare, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next'; 
import { COLORS, SIZES } from '../../constants/theme'; 
import { SERVICES, IMAGES } from '../../constants/data'; 
import { LoadingOverlay } from '../../components/LoadingOverlay';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation(); 
  const isRTL = I18nManager.isRTL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initHome = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setLoading(false);
    };
    initHome();
  }, []);

  const arrowStyle = { transform: [{ rotate: isRTL ? '180deg' : '0deg' }] };
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };
  
  // شيلنا textAlignStyle من هنا عشان هنوحده CENTER للكل
  
  const FEATURES = [
    { id: 1, title: t('feat_time'), icon: Clock },
    { id: 2, title: t('feat_ai'), icon: Zap },
    { id: 3, title: t('feat_neutral'), icon: Shield },
    { id: 4, title: t('feat_support'), icon: Users },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Image source={IMAGES.logo} style={styles.headerLogo} resizeMode="contain" />
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={22} color="#fff" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
            <ImageBackground 
                source={IMAGES.hero1} 
                style={styles.heroBg}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['transparent', COLORS.background]}
                    style={styles.heroOverlay}
                >
                    <View style={styles.heroContentCentered}>
                        <View style={styles.pillBadge}>
                            <Sparkles size={14} color="#FFD700" />
                            <Text style={styles.pillText}>{t('badge_challenge')}</Text>
                        </View>

                        <Text style={styles.heroTitleCentered}>
                            {t('hero_headline')}
                        </Text>
                        
                        <Text style={styles.heroSubtitleCentered}>
                            {t('hero_subheadline')}
                        </Text>

                        <View style={styles.hookBoxCentered}>
                            <Text style={styles.hookTextCentered}>
                                {t('hero_hook')}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.heroActions}>
                            <TouchableOpacity 
                                style={styles.btnPrimaryLarge}
                                onPress={() => router.push('/quote')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.btnPrimaryText}>{t('hero_cta_primary')}</Text>
                                <View style={[styles.iconContainer, arrowStyle]}>
                                    <ArrowRight size={20} color={COLORS.background} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.btnSecondaryLink}
                                onPress={() => router.push('/(tabs)/contact')}
                            >
                                <Text style={styles.btnSecondaryText}>{t('hero_cta_secondary')}</Text>
                                <View style={[styles.iconContainer, arrowStyle]}>
                                  <ChevronRight size={16} color="#bbb" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>

        {/* 👇👇👇 Features Grid (Centered Vertical Stack) 👇👇👇 */}
        <View style={styles.featuresSection}>
            <View style={styles.featuresGrid}>
                {FEATURES.map((feat) => {
                    const Icon = feat.icon;
                    return (
                        <View key={feat.id} style={styles.featureGridItem}>
                            <View style={styles.featureIconBox}>
                                <Icon size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.featureTextNew}>
                              {feat.title}
                            </Text>
                        </View>
                    )
                })}
            </View>
        </View>
        {/* 👆👆👆 */}

        {/* Challenge Section */}
        <View style={styles.sectionPadding}>
            <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                style={styles.glassCard}
            >
                <View style={styles.cardHeaderRow}>
                    <Target size={24} color={COLORS.primary} />
                    <Text style={styles.cardTitle}>{t('hero_challenge_new')}</Text>
                </View>
                <Text style={styles.cardDesc}>
                    {t('hero_challenge_sub_new')}
                </Text>
            </LinearGradient>
        </View>

        {/* Services */}
        <View style={styles.sectionPadding}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('section_services')}</Text>
                <TouchableOpacity onPress={() => router.push('/services')}>
                    <Text style={styles.linkText}>{t('see_all')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {SERVICES.map((service) => (
                    <TouchableOpacity 
                        key={service.id} 
                        style={styles.serviceCardNew}
                        onPress={() => router.push({ pathname: '/service-details', params: { id: service.id } })}
                    >
                        <Image source={service.image} style={styles.serviceImgNew} />
                        <View style={styles.serviceContentNew}>
                            <Text style={styles.serviceTitleNew} numberOfLines={1}>{t(`srv_${service.id}_title`)}</Text>
                            <Text style={styles.serviceDescNew} numberOfLines={2}>{t(`srv_${service.id}_desc`)}</Text>
                        </View>
                        <View style={styles.serviceIconFloating}>
                            <service.icon size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Journey Timeline */}
        <View style={styles.sectionPadding}>
            <Text style={styles.sectionTitle}>{t('home_journey_title')}</Text>
            <View style={styles.timelineContainer}>
                {[{id:1, icon:MessageSquare}, {id:2, icon:Target}, {id:3, icon:CheckCircle}].map((step, index) => (
                    <View key={step.id} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                            <View style={[styles.timelineDot, step.id === 3 && { backgroundColor: COLORS.primary }]} >
                                <step.icon size={16} color="#fff" />
                            </View>
                            {index !== 2 && <View style={styles.timelineLine} />}
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>{t(`journey_step${step.id}`)}</Text>
                            <Text style={styles.timelineDesc}>{t(`journey_step${step.id}_desc`)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>

        {/* Final CTA */}
        <View style={[styles.sectionPadding, { paddingBottom: 100 }]}>
            <LinearGradient
                colors={[COLORS.primary, '#d97706']}
                start={{x:0, y:0}} end={{x:1, y:1}}
                style={styles.finalCtaBox}
            >
                <View style={styles.finalCtaContent}>
                    <Text style={styles.finalCtaHeader}>{t('home_final_cta_title')}</Text>
                    
                    <Text style={styles.finalCtaDescCentered}>
                       {t('hero_hook')}
                    </Text>

                    <TouchableOpacity 
                        style={styles.finalCtaBtnWhite}
                        onPress={() => router.push('/quote')}
                    >
                        <Text style={styles.finalCtaBtnText}>{t('hero_cta_primary')}</Text>
                        <View style={[styles.iconContainer, arrowStyle]}>
                            <ArrowRight size={20} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Image source={IMAGES.logo} style={styles.watermarkLogo} resizeMode="contain" />
            </LinearGradient>
        </View>

      </ScrollView>

      <LoadingOverlay visible={loading} />
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
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    paddingTop: Platform.OS === 'android' ? 45 : 55,
    paddingBottom: 20, paddingHorizontal: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLogo: { width: 80, height: 40 },
  notificationBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 10, height: 10, backgroundColor: 'red', borderRadius: 5, position: 'absolute', top: 8, right: 8, borderWidth: 2, borderColor: '#000' },

  scrollContent: { paddingBottom: 50 },

  // HERO
  heroContainer: { height: 600, width: '100%' },
  heroBg: { flex: 1, width: '100%', height: '100%' },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', paddingBottom: 40, paddingHorizontal: 20 },
  heroContentCentered: { alignItems: 'center', width: '100%' },
  
  pillBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 8, 
    backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 8, paddingHorizontal: 16, 
    borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 20 
  },
  pillText: { color: '#FFD700', fontWeight: '700', fontSize: 13 },

  heroTitleCentered: { 
    fontSize: 34, fontWeight: '800', color: '#fff', textAlign: 'center', 
    marginBottom: 10, lineHeight: 42 
  },
  heroSubtitleCentered: { 
    fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', 
    marginBottom: 20, maxWidth: '90%', lineHeight: 24 
  },

  hookBoxCentered: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.4)',
    marginBottom: 25,
  },
  hookTextCentered: {
    color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center'
  },

  heroActions: { width: '100%', alignItems: 'center', gap: 15 },
  
  btnPrimaryLarge: {
    width: '90%', backgroundColor: COLORS.primary, height: 56, borderRadius: 28,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    elevation: 10, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowOffset: {width:0, height:4}
  },
  btnPrimaryText: { 
      color: '#000', fontSize: 18, fontWeight: 'bold',
      marginHorizontal: 8 
  },
  
  iconContainer: {
      alignItems: 'center', justifyContent: 'center'
  },

  btnSecondaryLink: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  btnSecondaryText: { 
      color: '#ccc', fontSize: 15, fontWeight: '500',
      marginHorizontal: 5 
  },

  // 👇👇👇👇 الستايل المعدل للـ Centered Grid 👇👇👇👇
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureGridItem: {
    width: '48%',
    flexDirection: 'column', // خليناهم تحت بعض (عمودي)
    alignItems: 'center', // توسيط أفقي للعناصر
    justifyContent: 'center', // توسيط رأسي للعناصر
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 20, // زودنا البادينج الطولي عشان الشكل
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureIconBox: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, // مسافة تحت الأيقونة
  },
  featureTextNew: {
    color: '#fff',
    fontSize: 13, // صغرنا الخط سيكا عشان الإنجليزي الطويل
    fontWeight: '600',
    textAlign: 'center', // 👈 ده اللي بيخلي الكلام في النص
    lineHeight: 18,
  },
  // 👆👆👆👆 نهاية التعديل 👆👆👆👆

  // Generic Section
  sectionPadding: { paddingHorizontal: 20, marginBottom: 35 },
  glassCard: { 
    padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: 'rgba(255,255,255,0.7)', lineHeight: 22, fontSize: 15 },

  // Services
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  linkText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },

  serviceCardNew: { 
    width: 200, height: 260, backgroundColor: '#1e293b', borderRadius: 20, 
    marginRight: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  serviceImgNew: { width: '100%', height: 140 },
  serviceContentNew: { padding: 16 },
  serviceTitleNew: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 6, textAlign: 'left' },
  serviceDescNew: { color: '#94a3b8', fontSize: 13, textAlign: 'left' },
  serviceIconFloating: { 
    position: 'absolute', top: 10, right: 10, width: 32, height: 32, 
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 16, alignItems: 'center', justifyContent: 'center'
  },

  // Timeline
  timelineContainer: { marginTop: 10 },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', width: 40 },
  timelineDot: { 
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#334155', 
    alignItems: 'center', justifyContent: 'center', zIndex: 2 
  },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#334155', marginVertical: 4 },
  timelineContent: { flex: 1, paddingBottom: 30, paddingLeft: 10 },
  timelineTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 6, textAlign: 'left' },
  timelineDesc: { color: '#94a3b8', fontSize: 14, lineHeight: 22, textAlign: 'left' },

  // Final CTA
  finalCtaBox: { 
    borderRadius: 24, padding: 30, overflow: 'hidden', position: 'relative'
  },
  finalCtaContent: { zIndex: 2, alignItems: 'center', gap: 20 },
  finalCtaHeader: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  finalCtaDescCentered: { color: 'rgba(255,255,255,0.9)', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  
  finalCtaBtnWhite: { 
    backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8 
  },
  finalCtaBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
  watermarkLogo: { 
    position: 'absolute', bottom: -20, right: -20, width: 150, height: 150, 
    opacity: 0.1, transform: [{rotate: '-15deg'}] 
  }

});