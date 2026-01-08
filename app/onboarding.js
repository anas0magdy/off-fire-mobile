import React, { useState, useRef } from 'react';
import { 
  View, Text, FlatList, StyleSheet, StatusBar, Dimensions, 
  TouchableOpacity, ImageBackground, I18nManager 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { IMAGES } from '../constants/data';
import { LoadingOverlay } from '../components/LoadingOverlay'; // 👈 1. استدعاء المكون

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false); // 👈 2. متغير التحميل
  const { t } = useTranslation();
  
  const isRTL = I18nManager.isRTL;
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  const SLIDES = [
    { id: 1, title: t('onb_1_title'), desc: t('onb_1_desc'), image: IMAGES.hero1 },
    { id: 2, title: t('onb_2_title'), desc: t('onb_2_desc'), image: IMAGES.hero2 },
    { id: 3, title: t('onb_3_title'), desc: t('onb_3_desc'), image: IMAGES.serviceConsult2 },
  ];

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true 
      });
    } else {
      setLoading(true); // 👈 بدء التحميل عند الانتقال النهائي
      try {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        // تأخير بسيط عشان التحميل يظهر بشكل لطيف
        await new Promise(r => setTimeout(r, 500));
        router.replace('/(tabs)');
      } catch (error) {
        console.log(error);
        router.replace('/(tabs)');
      } finally {
        setLoading(false); // 👈 إيقاف التحميل
      }
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

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
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { transform: [{ scaleX: isRTL ? -1 : 1 }] }]}>
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
                <ArrowRight size={20} color={COLORS.white} style={iconTransform} />
            )}
        </TouchableOpacity>
      </View>

      {/* 👈 3. إضافة المكون في النهاية */}
      <LoadingOverlay visible={loading} />
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
  btnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});