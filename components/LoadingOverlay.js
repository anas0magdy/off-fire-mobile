// D:\WEB\OffFireProject\off-fire-mobile\components\LoadingOverlay.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Dimensions, Image } from 'react-native'; // 👈 ضفنا Image
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import { useTranslation } from 'react-i18next';

// 👇 استيراد اللوجو (تأكد إن المسار صح)
const LogoImage = require('../assets/icon.png'); 

const { width, height } = Dimensions.get('window');

export const LoadingOverlay = ({ 
  visible = false, 
  message = '',
  type = 'default',
  backgroundColor = 'rgba(15, 23, 42, 0.95)',
  showProgress = false,
  progress = 0
}) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Default messages based on type
  const getDefaultMessage = () => {
    switch (type) {
      case 'loading':
        return t('loading') || 'جاري التحميل...';
      case 'processing':
        return t('processing') || 'جاري المعالجة...';
      case 'submitting':
        return t('submitting') || 'جاري الإرسال...';
      case 'saving':
        return t('saving') || 'جاري الحفظ...';
      case 'fetching':
        return t('fetching') || 'جاري جلب البيانات...';
      case 'uploading':
        return t('uploading') || 'جاري رفع الملف...';
      default:
        return message || t('loading') || 'جاري التحميل...';
    }
  };

  // Rotation animation
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotationAnim.stopAnimation();
    }
  }, [visible, rotationAnim]);

  // Fade in/out animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  // Progress animation
  useEffect(() => {
    if (showProgress) {
      Animated.timing(progressAnim, {
        toValue: Math.min(progress, 100) / 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, showProgress, progressAnim]);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (!visible) return null;

  const displayMessage = getDefaultMessage();

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={[styles.container, { backgroundColor }]}>
        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Spinner Container */}
          <View style={styles.spinnerContainer}>
            <Animated.View 
              style={[
                styles.spinnerOuter,
                { transform: [{ rotate: rotateInterpolate }] }
              ]}
            >
              <View style={styles.spinnerInner}>
                <ActivityIndicator 
                  size="large" 
                  color={COLORS.primary} 
                  style={styles.activityIndicator}
                />
              </View>
            </Animated.View>
            
            {/* Optional: Different spinner types */}
            {type === 'dots' && (
              <View style={styles.dotsContainer}>
                {[0, 1, 2].map((i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: COLORS.primary,
                        opacity: rotationAnim.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange: i === 0 ? [1, 0.3, 0.3, 1] : 
                                       i === 1 ? [0.3, 1, 0.3, 0.3] : 
                                       [0.3, 0.3, 1, 0.3],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Message */}
          <Text style={styles.message}>{displayMessage}</Text>

          {/* Progress Bar */}
          {showProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    { width: progressWidth }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}

          {/* Optional: Subtle animation elements */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeDot, { backgroundColor: COLORS.primary }]} />
            <View style={[styles.decorativeDot, { backgroundColor: COLORS.cta }]} />
            <View style={[styles.decorativeDot, { backgroundColor: COLORS.success }]} />
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Skeleton Loader Component
export const SkeletonLoader = ({ 
  width = '100%', 
  height = 20, 
  style = {},
  borderRadius = 8,
  shimmer = true
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shimmer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [shimmer, shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300],
  });

  return (
    <View style={[styles.skeletonContainer, { width, height, borderRadius }, style]}>
      <View style={[styles.skeletonBase, { borderRadius }]} />
      {shimmer && (
        <Animated.View 
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
};

// Loading Screen Component
export const LoadingScreen = ({ 
  title = '',
  subtitle = '',
  showLogo = true,
  backgroundColor = COLORS.background
}) => {
  return (
    <View style={[styles.loadingScreen, { backgroundColor }]}>
      {showLogo && (
        <View style={styles.logoContainer}>
          {/* 👇 هنا التعديل: استبدلنا View بـ Image */}
          <Image 
            source={LogoImage} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.logoText}>OFF FIRE</Text>
        </View>
      )}
      
      <LoadingOverlay 
        visible={true}
        type="dots"
        backgroundColor="transparent"
      />
      
      {title && <Text style={styles.screenTitle}>{title}</Text>}
      {subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
    </View>
  );
};

// Button Loading Component
export const ButtonLoader = ({ size = 'small', color = COLORS.background }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotationAnim]);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerSize = size === 'large' ? 24 : size === 'medium' ? 20 : 16;

  return (
    <Animated.View 
      style={[
        styles.buttonLoader,
        { 
          transform: [{ rotate: rotateInterpolate }],
          width: spinnerSize,
          height: spinnerSize,
          borderTopColor: color,
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: COLORS.border,
    maxWidth: 280,
    width: '80%',
  },
  spinnerContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  spinnerOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    transform: [{ scale: 1.2 }],
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  message: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginTop: 10,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  decorativeElements: {
    flexDirection: 'row',
    marginTop: 20,
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    opacity: 0.5,
  },
  skeletonContainer: {
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  skeletonBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.surface,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    // شيلنا الـ backgroundColor: COLORS.primary عشان الصورة تظهر بشفافيتها
    marginBottom: 12,
  },
  logoText: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  screenTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  screenSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 300,
  },
  buttonLoader: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: COLORS.background,
  },
});