import React, { useState, useRef } from 'react';
import { 
  View, Text, FlatList, StyleSheet, StatusBar, Dimensions, 
  TouchableOpacity, ImageBackground, I18nManager 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native'; 
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
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const SLIDES = [
    { id: 1, title: t('onb_1_title'), desc: t('onb_1_desc'), image: IMAGES.hero1 },
    { id: 2, title: t('onb_2_title'), desc: t('onb_2_desc'), image: IMAGES.hero2 },
    { id: 3, title: t('onb_3_title'), desc: t('onb_3_desc'), image: IMAGES.serviceConsult },
  ];

  const handleNext = () => {
    // لو لسه موصلناش لآخر شريحة
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true 
      });
    } else {
      router.replace('/(tabs)');
    }
  };

  // ✅ الحل السحري: دالة بتكتشف الكارت الظاهر حالياً بدقة 100% بدون حسابات
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // إعدادات دقة الرؤية (عشان يحسب الكارت لما يظهر نصه على الأقل)
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

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
        
        // ✅ التغيير هنا: شلنا onMomentumScrollEnd واستخدمنا دي بدالها
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        
        // شلنا getItemLayout عشان نتجنب مشاكل الـ RTL في بعض الموبايلات
        
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <ImageBackground source={item.image} style={styles.image}>
              <LinearGradient
                colors={['transparent', COLORS.background]}
                style={styles.gradient}
              >
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.desc}>{item.desc}</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
      />

      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.paginator}>
            {SLIDES.map((_, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.dot, 
                        { 
                          backgroundColor: currentIndex === index ? COLORS.primary : COLORS.surfaceLight,
                          width: currentIndex === index ? 25 : 10 
                        }
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
                <Check size={20} color={COLORS.white} />
            ) : (
                <ArrowIcon size={20} color={COLORS.white} />
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
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24, textAlign: 'center' },
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
  btnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});