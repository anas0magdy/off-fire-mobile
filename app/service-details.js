import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SERVICES } from '../constants/data';
import MainButton from '../components/MainButton';

export default function ServiceDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const service = SERVICES.find(s => s.id == id);
  if (!service) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. Header with Background Image */}
      <View style={styles.headerContainer}>
         <Image source={service.image} style={styles.headerImage} />
         <LinearGradient colors={['transparent', COLORS.dark]} style={styles.gradientOverlay} />
         
         {/* Navigation Bar - Flexbox used here to fix direction */}
         <View style={styles.navBar}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
            >
                <ArrowRight size={24} color={COLORS.white} />
            </TouchableOpacity>
         </View>

         <View style={styles.titleContainer}>
             <Text style={styles.headerTitle}>{service.title}</Text>
             <View style={styles.tag}><Text style={styles.tagText}>خدمة معتمدة</Text></View>
         </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.desc}>{service.longDesc}</Text>
        </View>

        <View style={styles.featuresBox}>
          <Text style={styles.sectionTitle}>المميزات</Text>
          {service.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <CheckCircle size={20} color={COLORS.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomBar}>
        <MainButton title="اطلب عرض سعر" onPress={() => router.push('/quote')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  
  headerContainer: { height: 350, position: 'relative' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', inset: 0, bottom: 0, height: '100%' },
  
  // شريط التنقل العلوي - Flexbox يضمن ان الزرار يمين
  navBar: { 
    position: 'absolute', top: 50, left: 0, right: 0, 
    flexDirection: 'row', justifyContent: 'flex-start', // في العربي Start يعني يمين
    paddingHorizontal: 20 
  },
  backButton: { 
    width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(10px)'
  },

  titleContainer: { position: 'absolute', bottom: 30, right: 20, alignItems: 'flex-start' },
  headerTitle: { color: COLORS.white, fontSize: 32, fontWeight: 'bold', textAlign: 'left' },
  tag: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  tagText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 12 },

  content: { padding: 24 },
  section: { marginBottom: 30 },
  desc: { color: COLORS.subText, fontSize: 16, lineHeight: 28, textAlign: 'left' },
  
  featuresBox: { backgroundColor: COLORS.card, padding: 20, borderRadius: 20 },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'left' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  featureText: { color: COLORS.text, fontSize: 15 },
  
  footerSpace: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: COLORS.dark, borderTopWidth: 1, borderTopColor: COLORS.border },
});