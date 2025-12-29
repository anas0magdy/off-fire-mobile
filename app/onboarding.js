import React, { useState, useRef, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Dimensions, StatusBar, Animated 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, ONBOARDING_DATA } from '../constants/data';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current; 

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)');
    }
  };

  const Paginator = ({ data, scrollX }) => {
    return (
      <View style={styles.paginatorContainer}>
        {data.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10], 
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3], 
            extrapolate: 'clamp',
          });
          return (
            <Animated.View 
              key={i.toString()} 
              style={[styles.dot, { width: dotWidth, opacity }]} 
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const Icon = item.icon;
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
            <View style={styles.circleBackground}>
                <Icon size={100} color={COLORS.primary} />
            </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.desc}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      <View style={{ flex: 3 }}>
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
        />
      </View>

      <View style={styles.footer}>
        <Paginator data={ONBOARDING_DATA} scrollX={scrollX} />
        <TouchableOpacity 
            style={[
                styles.btn, 
                currentIndex === ONBOARDING_DATA.length - 1 ? styles.btnEnd : styles.btnNext
            ]}
            onPress={scrollToNext}
            activeOpacity={0.8}
        >
            <Text style={styles.btnText}>
                {currentIndex === ONBOARDING_DATA.length - 1 ? "ابدأ رحلتك" : "التالي"}
            </Text>
            {currentIndex !== ONBOARDING_DATA.length - 1 && (
                <ChevronLeft size={24} color="white" />
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  slide: { width, alignItems: 'center', padding: 20, paddingTop: 100 },
  imageContainer: { flex: 0.6, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  circleBackground: {
    width: 200, height: 200, 
    borderRadius: 100, 
    backgroundColor: COLORS.card, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10
  },
  textContainer: { flex: 0.4, alignItems: 'center' },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  description: { color: COLORS.subText, fontSize: 16, textAlign: 'center', lineHeight: 26, paddingHorizontal: 20 },
  footer: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 50 },
  paginatorContainer: { flexDirection: 'row', height: 64, justifyContent: 'center', alignItems: 'center' },
  dot: { height: 10, borderRadius: 5, backgroundColor: COLORS.primary, marginHorizontal: 5 },
  btn: { height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  btnNext: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border },
  btnEnd: { backgroundColor: COLORS.cta, shadowColor: COLORS.cta, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});