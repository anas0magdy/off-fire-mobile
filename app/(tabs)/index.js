import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, ImageBackground, Image, I18nManager 
} from 'react-native';
import { Bell, ArrowLeft, Star, ChevronLeft, CheckCircle, Clock, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme'; 
import { SERVICES, IMAGES, BLOG_POSTS } from '../../constants/data'; 

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const isRTL = I18nManager.isRTL;
  
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };
  const textAlignment = { textAlign: 'auto' }; 

  const HERO_SLIDES_DYNAMIC = [
    {
      id: 1,
      title: t('hero_challenge'),
      subtitle: t('hero_challenge_sub'),
      image: IMAGES.hero1,
    },
  ];

  const FEATURES_DYNAMIC = [
    { id: 1, title: t('feat_certified'), desc: t('feat_certified_desc'), icon: CheckCircle },
    { id: 2, title: t('feat_speed'), desc: t('feat_speed_desc'), icon: Clock },
    { id: 3, title: t('feat_quality'), desc: t('feat_quality_desc'), icon: Award },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent />
      
      {/* 1. Header */}
      <View style={styles.headerWrapper}>
        <LinearGradient
            colors={[COLORS.background, 'rgba(15, 23, 42, 0.95)', 'transparent']}
            style={styles.headerGradient}
        >
            <View style={styles.header}>
                <Image source={IMAGES.logo} style={styles.headerLogo} resizeMode="contain" />
                <TouchableOpacity style={styles.notificationBtn}>
                    <Bell size={22} color={COLORS.textPrimary} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 120 }}>
        
        {/* 2. Hero Section */}
        <TouchableOpacity 
          activeOpacity={0.95} 
          onPress={() => router.push('/quote')}
          style={styles.heroContainer}
        >
          <ImageBackground 
            source={HERO_SLIDES_DYNAMIC[0].image} 
            style={styles.heroImage}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
                colors={['transparent', COLORS.backgroundDarker]}
                style={styles.heroOverlay}
            >
                <View style={styles.badgeContainer}>
                    <Star size={12} color={COLORS.primary} fill={COLORS.primary}/>
                    <Text style={styles.badgeText}>{t('badge_challenge')}</Text>
                </View>
                
                <Text style={[styles.heroTitle, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{HERO_SLIDES_DYNAMIC[0].title}</Text>
                <Text style={[styles.heroSubtitle, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{HERO_SLIDES_DYNAMIC[0].subtitle}</Text>
                
                <View style={styles.heroBtn}>
                  <Text style={styles.heroBtnText}>{t('hero_btn')}</Text>
                  <ArrowLeft size={18} color={COLORS.background} style={iconTransform} />
                </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* 3. Features */}
        <View style={styles.featuresRow}>
          {FEATURES_DYNAMIC.map((feat) => {
            const Icon = feat.icon;
            return (
              <View key={feat.id} style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                   <Icon size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
            )
          })}
        </View>

        {/* 4. Services */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{t('section_services')}</Text>
          <TouchableOpacity onPress={() => router.push('/services')} style={styles.seeAllBtn}>
            <Text style={styles.seeAll}>{t('see_all')}</Text>
            <ChevronLeft size={16} color={COLORS.textSecondary} style={iconTransform} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20 }}
          style={styles.horizontalScroll}
        >
          {SERVICES.map((item) => {
            // 👇 التعديل هنا: بنجيب الاسم والوصف من ملف الترجمة بدلاً من الداتا الثابتة
            const translatedTitle = t(`srv_${item.id}_title`);
            const translatedDesc = t(`srv_${item.id}_desc`);

            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.serviceCard}
                onPress={() => router.push({ pathname: '/service-details', params: { id: item.id } })}
                activeOpacity={0.8}
              >
                <Image source={item.image} style={styles.serviceImage} />
                
                <LinearGradient 
                  colors={['transparent', 'rgba(2, 6, 23, 0.95)']}
                  style={styles.serviceOverlay}
                >
                  {/* هنا بنعرض المتغيرات المترجمة */}
                  <Text style={[styles.serviceTitle, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{translatedTitle}</Text>
                  <Text style={[styles.serviceDesc, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]} numberOfLines={1}>{translatedDesc}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 5. Blog Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{t('section_knowledge')}</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20 }}
          style={styles.horizontalScroll}
        >
          {BLOG_POSTS.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.blogCard}
              onPress={() => router.push({ pathname: '/blog-details', params: { id: post.id } })}
              activeOpacity={0.8}
            >
              <Image source={post.image} style={styles.blogImage} />
              <View style={styles.blogContent}>
                <Text style={[styles.blogDate, textAlignment]}>{post.date}</Text>
                <Text numberOfLines={2} style={[styles.blogTitle, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{post.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 6. CTA Banner */}
        <View style={styles.ctaContainer}>
            <LinearGradient
                colors={[COLORS.surface, COLORS.backgroundDarker]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.ctaContent}
            >
                <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Text style={[styles.ctaTitle, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{t('cta_title')}</Text>
                    <Text style={[styles.ctaDesc, textAlignment, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}>{t('cta_desc')}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.ctaBtnSmall}
                    onPress={() => router.push('/quote')}
                >
                    <ArrowLeft size={24} color={COLORS.background} style={iconTransform} />
                </TouchableOpacity>
            </LinearGradient>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  headerWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  headerGradient: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLogo: { width: 120, height: 40 },
  notificationBtn: { backgroundColor: COLORS.surface, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },

  heroContainer: { marginHorizontal: 20, height: 260, marginBottom: 30, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { flex: 1, padding: 24, justifyContent: 'flex-end', alignItems: 'flex-start' },
  
  badgeContainer: { backgroundColor: COLORS.primaryDim, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: COLORS.primary },
  badgeText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  
  heroTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: 'bold', marginBottom: 8, lineHeight: 32 },
  heroSubtitle: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 20, lineHeight: 22 },
  
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  heroBtnText: { color: COLORS.background, fontWeight: 'bold', fontSize: 14 },

  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 35 },
  featureItem: { alignItems: 'center', width: '30%' },
  featureIconBox: { width: 45, height: 45, borderRadius: 22, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  featureTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
  featureDesc: { color: COLORS.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: 'bold' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { color: COLORS.textSecondary, fontSize: 14 },
  
  horizontalScroll: { marginBottom: 35 },
  
  serviceCard: { width: 160, height: 220, marginEnd: 16, borderRadius: 24, overflow: 'hidden', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  serviceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  serviceOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingTop: 60, alignItems: 'flex-start' },
  serviceTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold' },
  serviceDesc: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },

  blogCard: { width: 260, marginEnd: 16, backgroundColor: COLORS.surface, borderRadius: 20, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  blogImage: { width: 80, height: 80, borderRadius: 16, resizeMode: 'cover' },
  blogContent: { flex: 1, alignItems: 'flex-start' },
  blogDate: { color: COLORS.primary, fontSize: 11, marginBottom: 4 },
  blogTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: 'bold', lineHeight: 20 },

  ctaContainer: { paddingHorizontal: 20 },
  ctaContent: { padding: 24, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border },
  ctaTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' },
  ctaDesc: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  ctaBtnSmall: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
});