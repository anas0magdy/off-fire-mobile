import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Target, Shield, Users, Award, Briefcase, Clock, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, IMAGES, ABOUT_CONTENT } from '../constants/data';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();

  // مكون إحصائيات صغير
  const StatItem = ({ num, label }) => (
    <View style={styles.statItem}>
      <Text style={styles.statNum}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* 1. HERO SECTION PREMIUM */}
      <View style={styles.headerContainer}>
        <Image source={IMAGES.hero1} style={styles.headerImage} />
        <LinearGradient 
          colors={['transparent', COLORS.dark]} 
          style={styles.gradientOverlay}
        >
           {/* Header Nav */}
           <View style={styles.navBar}>
             <Text style={styles.pageTitle}>عن المنصة</Text>
             <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
               <ArrowRight size={24} color={COLORS.white} />
             </TouchableOpacity>
           </View>
           
           <View style={styles.heroContent}>
             <View style={styles.tag}><Text style={styles.tagText}>شريكك الاستراتيجي</Text></View>
             <Text style={styles.mainTitle}>OFF FIRE <Text style={{color: COLORS.primary}}>ONLINE</Text></Text>
             <Text style={styles.subTitle}>{ABOUT_CONTENT.intro}</Text>
           </View>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 2. STATS BAR */}
        <View style={styles.statsContainer}>
          <StatItem num="+500" label="عميل سعيد" />
          <View style={styles.statDivider} />
          <StatItem num="+120" label="مشروع مكتمل" />
          <View style={styles.statDivider} />
          <StatItem num="+10" label="سنوات خبرة" />
        </View>

        {/* 3. STORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{ABOUT_CONTENT.story.title}</Text>
          <Text style={styles.storyText}>{ABOUT_CONTENT.story.content}</Text>
        </View>

        {/* 4. VALUES (GLASS CARDS) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>قيمنا الراسخة</Text>
          <View style={styles.valuesGrid}>
            {ABOUT_CONTENT.values.map((val, index) => (
              <LinearGradient
                key={index}
                colors={[COLORS.card, 'rgba(30, 41, 59, 0.6)']}
                style={styles.valueCard}
              >
                <Shield size={24} color={COLORS.primary} style={{marginBottom: 10}} />
                <Text style={styles.valueTitle}>{val.title}</Text>
                <Text style={styles.valueDesc}>{val.desc}</Text>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* 5. CLIENT JOURNEY (TIMELINE LOOK) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>رحلة العميل</Text>
          <View style={styles.journeyBox}>
             {ABOUT_CONTENT.journey.steps.map((step, index) => (
               <View key={index} style={styles.timelineRow}>
                 <View style={styles.timelineLeft}>
                   <View style={styles.circle}>
                     <Text style={styles.circleNum}>{index + 1}</Text>
                   </View>
                   {index !== ABOUT_CONTENT.journey.steps.length - 1 && <View style={styles.line} />}
                 </View>
                 <View style={styles.timelineContent}>
                   <Text style={styles.timelineText}>{step}</Text>
                 </View>
               </View>
             ))}
          </View>
        </View>

        {/* 6. WHY US */}
        <View style={[styles.section, {marginBottom: 40}]}>
          <Text style={styles.sectionHeader}>لماذا نحن خيارك الذكي؟</Text>
          <View style={styles.whyUsContainer}>
             {ABOUT_CONTENT.whyUs.map((item, index) => (
               <View key={index} style={styles.checkRow}>
                 <CheckCircle size={20} color={COLORS.success} />
                 <Text style={styles.checkText}>{item}</Text>
               </View>
             ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  
  // Header Styles
  headerContainer: { height: 380, width: '100%', position: 'relative' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', inset: 0, paddingTop: 50, paddingHorizontal: 20, justifyContent: 'space-between', paddingBottom: 40 },
  
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  backBtn: { width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' },
  
  heroContent: {},
  tag: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 15 },
  tagText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 12 },
  mainTitle: { color: COLORS.white, fontSize: 36, fontWeight: '900', textAlign: 'left', marginBottom: 10 },
  subTitle: { color: COLORS.subText, fontSize: 16, lineHeight: 24, textAlign: 'left', maxWidth: '90%' },

  content: { padding: 20, marginTop: -20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: COLORS.dark },

  // Stats
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.card, padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: COLORS.border, marginTop: -50, shadowColor: "#000", shadowOffset: {width:0,height:10}, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  statItem: { alignItems: 'center' },
  statNum: { color: COLORS.primary, fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: COLORS.subText, fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, height: '80%', backgroundColor: COLORS.border },

  // Sections
  section: { marginBottom: 35 },
  sectionHeader: { color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'left', borderLeftWidth: 4, borderLeftColor: COLORS.primary, paddingLeft: 10 },
  storyText: { color: COLORS.subText, fontSize: 15, lineHeight: 26, textAlign: 'left' },

  // Values Grid
  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  valueCard: { width: '48%', backgroundColor: COLORS.card, padding: 15, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  valueTitle: { color: COLORS.white, fontWeight: 'bold', fontSize: 14, marginBottom: 5, textAlign: 'left' },
  valueDesc: { color: COLORS.subText, fontSize: 11, textAlign: 'left', lineHeight: 18 },

  // Timeline
  journeyBox: { backgroundColor: COLORS.card, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  timelineRow: { flexDirection: 'row', minHeight: 60 },
  timelineLeft: { alignItems: 'center', marginRight: 15, width: 30 },
  circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  circleNum: { color: COLORS.dark, fontWeight: 'bold', fontSize: 14 },
  line: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 5 },
  timelineContent: { flex: 1, justifyContent: 'center', paddingBottom: 20 },
  timelineText: { color: COLORS.white, fontSize: 15, textAlign: 'left' },

  // Why Us
  whyUsContainer: { gap: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  checkText: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
});