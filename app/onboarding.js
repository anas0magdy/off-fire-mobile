import React, { useState, useRef } from 'react';
import { 
  View, Text, FlatList, StyleSheet, StatusBar, Dimensions, 
  TouchableOpacity, ImageBackground, I18nManager 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Check } from 'lucide-react-native'; // ArrowRight Added
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/theme';
import { IMAGES } from '../constants/data';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  // تعريف الشرائح هنا عشان الترجمة تشتغل
  const SLIDES = [
    { id: 1, title: t('onb_1_title'), desc: t('onb_1_desc'), image: IMAGES.hero1 },
    { id: 2, title: t('onb_2_title'), desc: t('onb_2_desc'), image: IMAGES.hero2 },
    { id: 3, title: t('onb_3_title'), desc: t('onb_3_desc'), image: IMAGES.serviceConsult },
  ];

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)'); // الذهاب للتطبيق الرئيسي
    }
  };

  const textAlignment = { textAlign: 'center' };
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        // مهم جداً للاتجاه في الـ Android
        style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
        renderItem={({ item }) => (
          // بنعكس المحتوى تاني عشان يظهر صح
          <View style={[styles.slide, { transform: [{ scaleX: isRTL ? -1 : 1 }] }]}>
            <ImageBackground source={item.image} style={styles.image}>
              <LinearGradient
                colors={['transparent', COLORS.background]}
                style={styles.gradient}
              >
                <View style={styles.textContainer}>
                    <Text style={[styles.title, textAlignment]}>{item.title}</Text>
                    <Text style={[styles.desc, textAlignment]}>{item.desc}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
      />

      {/* Pagination & Buttons */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.paginator}>
            {SLIDES.map((_, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.dot, 
                        { backgroundColor: currentIndex === index ? COLORS.primary : COLORS.surfaceLight,
                          width: currentIndex === index ? 20 : 10 }
                    ]} 
                />
            ))}
        </View>

        {/* Button */}
        <TouchableOpacity 
            style={styles.btn} 
            onPress={handleNext}
            activeOpacity={0.8}
        >
            <Text style={styles.btnText}>
                {currentIndex === SLIDES.length - 1 ? t('onb_start') : t('onb_next')}
            </Text>
            {currentIndex === SLIDES.length - 1 ? (
                <Check size={20} color={COLORS.background} />
            ) : (
                <ArrowRight size={20} color={COLORS.background} style={iconTransform} />
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  slide: { width, height },
  image: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  gradient: { height: '50%', justifyContent: 'flex-end', paddingBottom: 100 },
  
  textContainer: { paddingHorizontal: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  desc: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 },

  footer: { 
    position: 'absolute', bottom: 40, left: 0, right: 0, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 30 
  },
  
  paginator: { flexDirection: 'row', gap: 8 },
  dot: { height: 10, borderRadius: 5 },

  btn: { 
    backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 14, 
    borderRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 8 
  },
  btnText: { color: COLORS.background, fontWeight: 'bold', fontSize: 16 }
});