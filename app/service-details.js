import React from 'react';
import { 
  View, Text, ScrollView, StyleSheet, StatusBar, 
  ImageBackground, TouchableOpacity, I18nManager 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, FileText, ArrowRight } from 'lucide-react-native'; // ArrowRight added
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/theme';
import { SERVICES } from '../constants/data';

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const textAlignment = { textAlign: 'left' };
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] }; // لعكس الأيقونات
  
  // 1. بنجيب البيانات الثابتة (الصور والأيقونات) من data.js
  const serviceStaticData = SERVICES.find(s => s.id == id) || SERVICES[0];
  
  // 2. بنجيب النصوص المترجمة بناءً على الـ ID
  const translatedTitle = t(`srv_${id}_title`);
  const translatedDesc = t(`srv_${id}_desc`);
  const translatedLongDesc = t(`srv_${id}_long`);
  
  // بنعمل مصفوفة للمميزات (Features) عشان نعرضها في لوب
  // (عملنا حسابنا إن كل خدمة ليها 4 مميزات في ملف الترجمة)
  const featuresList = [1, 2, 3, 4].map(num => t(`srv_${id}_feat_${num}`));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero Image Section */}
      <ImageBackground 
        source={serviceStaticData.image} 
        style={styles.heroImage}
      >
        <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', COLORS.background]}
            style={styles.heroOverlay}
        >
            {/* Back Button */}
            <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => router.back()}
            >
                {/* استخدمنا ArrowRight في العربي عشان يبقى اتجاهه "رجوع" صحيح */}
                {isRTL ? 
                  <ArrowRight size={24} color="white" /> : 
                  <ArrowLeft size={24} color="white" />
                }
            </TouchableOpacity>

            <View style={styles.heroContent}>
                {/* Icon Badge */}
                <View style={styles.iconBadge}>
                    <serviceStaticData.icon size={32} color={COLORS.primary} />
                </View>
                <Text style={[styles.heroTitle, textAlignment]}>{translatedTitle}</Text>
                <Text style={[styles.heroSubtitle, textAlignment]}>{translatedDesc}</Text>
            </View>
        </LinearGradient>
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Description */}
        <View style={styles.section}>
            <Text style={[styles.longDesc, textAlignment]}>{translatedLongDesc}</Text>
        </View>

        {/* Features List */}
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignment]}>{t('srv_details_features')}</Text>
            <View style={styles.featuresBox}>
                {featuresList.map((feat, index) => (
                    <View key={index} style={styles.featureRow}>
                        <CheckCircle size={20} color={COLORS.primary} />
                        <Text style={[styles.featureText, textAlignment]}>{feat}</Text>
                    </View>
                ))}
            </View>
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
            style={styles.quoteBtn}
            onPress={() => router.push('/quote')}
            activeOpacity={0.8}
        >
            <Text style={styles.quoteBtnText}>{t('request_quote')}</Text>
            <FileText size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  heroImage: { width: '100%', height: 350 },
  heroOverlay: { flex: 1, padding: 20, justifyContent: 'space-between' },
  
  backBtn: { 
    marginTop: 40, 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  
  heroContent: { paddingBottom: 20, alignItems: 'flex-start' }, // alignItems مهم للمحاذاة
  iconBadge: { 
    width: 60, height: 60, borderRadius: 30, 
    backgroundColor: COLORS.surface, 
    alignItems: 'center', justifyContent: 'center', 
    marginBottom: 15,
    borderWidth: 1, borderColor: COLORS.primary
  },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 5 },
  heroSubtitle: { fontSize: 16, color: COLORS.textSecondary, opacity: 0.9 },

  contentContainer: { padding: 24, paddingBottom: 100 },
  
  section: { marginBottom: 30 },
  longDesc: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 26 },
  
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 15 },
  featuresBox: { 
    backgroundColor: COLORS.surface, 
    borderRadius: 20, padding: 20, 
    borderWidth: 1, borderColor: COLORS.border 
  },
  featureRow: { 
    flexDirection: 'row', alignItems: 'center', 
    marginBottom: 15, gap: 12 
  },
  featureText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface,
    padding: 20, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: COLORS.border
  },
  quoteBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 18, borderRadius: 16, gap: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  quoteBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' }
});