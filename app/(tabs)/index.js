import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, ImageBackground, Image 
} from 'react-native';
import { Bell, ArrowLeft, Star, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { COLORS, SERVICES, HERO_SLIDES, FEATURES, IMAGES, BLOG_POSTS } from '../../constants/data';
import { useRouter } from 'expo-router';
import MainButton from '../../components/MainButton'; 

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} translucent />
      
      {/* 1. Glass Header */}
      <View style={styles.headerWrapper}>
        <LinearGradient
            colors={[COLORS.dark, 'rgba(15, 23, 42, 0.95)', 'transparent']}
            style={styles.headerGradient}
        >
            <View style={styles.header}>
                <Image source={IMAGES.logo} style={styles.headerLogo} resizeMode="contain" />
                <TouchableOpacity style={styles.notificationBtn}>
                    <Bell size={22} color={COLORS.text} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 120 }}>
        
        {/* 2. Premium Hero Section (Content Fixed) */}
        <TouchableOpacity 
          activeOpacity={0.95} 
          onPress={() => router.push('/quote')}
          style={styles.heroContainer}
        >
          <ImageBackground 
            source={HERO_SLIDES[0].image} 
            style={styles.heroImage}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
                colors={['transparent', COLORS.darker]}
                style={styles.heroOverlay}
            >
                <View style={styles.badgeContainer}>
                    <Star size={12} color={COLORS.primary} fill={COLORS.primary}/>
                    <Text style={styles.badgeText}>تحدي وحل</Text>
                </View>
                {/* هنا يعرض التحدي والحل من الداتا */}
                <Text style={styles.heroTitle}>{HERO_SLIDES[0].title}</Text>
                <Text style={styles.heroSubtitle}>{HERO_SLIDES[0].subtitle}</Text>
                
                <View style={styles.heroBtn}>
                  <Text style={styles.heroBtnText}>ابدأ الحل الذكي الآن</Text>
                  <ArrowLeft size={18} color={COLORS.dark} />
                </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        {/* 3. Stats / Features */}
        <View style={styles.featuresRow}>
          {FEATURES.map((feat) => {
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

        {/* 4. Services (FIXED: Empty Cards Solved) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>خدماتنا</Text>
          <TouchableOpacity onPress={() => router.push('/services')} style={styles.seeAllBtn}>
            <Text style={styles.seeAll}>المزيدد</Text>
            <ChevronLeft size={16} color={COLORS.subText} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20 }}
          style={styles.horizontalScroll}
        >
          {SERVICES.map((item) => (
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
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{item.desc}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 5. Blog Section (11 Articles) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>مركز المعرفة</Text>
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
                <Text style={styles.blogDate}>{post.date}</Text>
                <Text numberOfLines={2} style={styles.blogTitle}>{post.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 6. CTA Banner */}
        <View style={styles.ctaContainer}>
            <LinearGradient
                colors={[COLORS.card, COLORS.darker]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.ctaContent}
            >
                <View style={{flex: 1}}>
                    <Text style={styles.ctaTitle}>مشروعك محتاج مختصين؟</Text>
                    <Text style={styles.ctaDesc}>نفذ اشتراطات الدفاع المدني بأسرع وقت.</Text>
                </View>
                <TouchableOpacity 
                    style={styles.ctaBtnSmall}
                    onPress={() => router.push('/quote')}
                >
                    <ArrowLeft size={24} color={COLORS.dark} />
                </TouchableOpacity>
            </LinearGradient>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  
  headerWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  headerGradient: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLogo: { width: 120, height: 40 },
  notificationBtn: { backgroundColor: COLORS.card, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },

  heroContainer: { marginHorizontal: 20, height: 260, marginBottom: 30, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { flex: 1, padding: 24, justifyContent: 'flex-end', alignItems: 'flex-start' },
  badgeContainer: { backgroundColor: 'rgba(245, 158, 11, 0.2)', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: COLORS.primary },
  badgeText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  heroTitle: { color: COLORS.white, fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'left', lineHeight: 32 },
  heroSubtitle: { color: COLORS.subText, fontSize: 14, marginBottom: 20, textAlign: 'left', lineHeight: 22 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  heroBtnText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 14 },

  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 35 },
  featureItem: { alignItems: 'center', width: '30%' },
  featureIconBox: { width: 45, height: 45, borderRadius: 22, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  featureTitle: { color: COLORS.text, fontSize: 13, fontWeight: 'bold', marginTop: 5 },
  featureDesc: { color: COLORS.subText, fontSize: 10, textAlign: 'center', marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { color: COLORS.subText, fontSize: 14 },
  
  horizontalScroll: { marginBottom: 35 },
  
  // FIX: Explicit dimensions and overflow for Service Cards
  serviceCard: { width: 160, height: 220, marginRight: 16, borderRadius: 24, overflow: 'hidden', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  serviceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  serviceOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingTop: 60 },
  serviceTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', textAlign: 'left' },
  serviceDesc: { color: COLORS.subText, fontSize: 12, textAlign: 'left', marginTop: 4 },

  blogCard: { width: 260, marginRight: 16, backgroundColor: COLORS.card, borderRadius: 20, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  blogImage: { width: 80, height: 80, borderRadius: 16, resizeMode: 'cover' },
  blogContent: { flex: 1 },
  blogDate: { color: COLORS.primary, fontSize: 11, marginBottom: 4, textAlign: 'left' },
  blogTitle: { color: COLORS.white, fontSize: 13, fontWeight: 'bold', textAlign: 'left', lineHeight: 20 },

  ctaContainer: { paddingHorizontal: 20 },
  ctaContent: { padding: 24, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border },
  ctaTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', textAlign: 'left' },
  ctaDesc: { color: COLORS.subText, fontSize: 13, marginTop: 4, textAlign: 'left' },
  ctaBtnSmall: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
});