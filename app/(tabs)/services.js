import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Image, TextInput, StatusBar, I18nManager, Dimensions, 
  ScrollView 
} from 'react-native';
// 👇 1. ضفنا ChevronLeft عشان العربي
import { Search, ChevronRight, ChevronLeft, Filter, CheckCircle, Star, Clock, Users, Shield } from 'lucide-react-native'; 
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../../constants/theme';
import { SERVICES, IMAGES } from '../../constants/data';
import { LoadingOverlay } from '../../components/LoadingOverlay'; 

const { width } = Dimensions.get('window');

export default function ServicesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const isRTL = I18nManager.isRTL;
  
  // ✅ 2. تحديد أيقونة السهم بناءً على اللغة (بدل الـ transform اللي بيخفيها)
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setLoading(false);
    };
    loadData();
  }, []); 
  
  const FILTERS = [
    { id: 'all', label: t('filter_all') || 'الكل' },
    { id: 'fire', label: t('filter_fire') || 'مكافحة حريق' },
    { id: 'alarm', label: t('filter_alarm') || 'إنذار مبكر' },
    { id: 'equipment', label: t('filter_equipment') || 'معدات' },
    { id: 'consulting', label: t('filter_consulting') || 'استشارات' },
  ];

  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = searchQuery === '' || 
      t(`srv_${service.id}_title`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(`srv_${service.id}_desc`).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'fire' && service.id === 1) ||
      (selectedFilter === 'alarm' && service.id === 2) ||
      (selectedFilter === 'equipment' && service.id === 3) ||
      (selectedFilter === 'consulting' && (service.id === 4 || service.id === 5));
    
    return matchesSearch && matchesFilter;
  });

  const SERVICE_FEATURES = [
    { id: 1, icon: CheckCircle, label: t('feature_certified') || 'شركات معتمدة' },
    { id: 2, icon: Clock, label: t('feature_fast') || 'سرعة التنفيذ' },
    { id: 3, icon: Users, label: t('feature_experts') || 'خبراء متخصصون' },
    { id: 4, icon: Shield, label: t('feature_quality') || 'ضمان الجودة' },
  ];

  const renderServiceItem = ({ item }) => {
    const title = t(`srv_${item.id}_title`);
    const desc = t(`srv_${item.id}_desc`);
    const features = [
      t(`srv_${item.id}_feat_1`),
      t(`srv_${item.id}_feat_2`),
      t(`srv_${item.id}_feat_3`)
    ].filter(Boolean);

    return (
      <TouchableOpacity 
        style={styles.serviceCard}
        onPress={() => router.push({ 
          pathname: '/service-details', 
          params: { id: item.id } 
        })}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.95)']}
          style={styles.serviceCardGradient}
        >
          {/* الصورة */}
          <View style={styles.serviceImageContainer}>
            {item.image ? (
              <Image source={item.image} style={styles.serviceCardImage} resizeMode="cover" />
            ) : (
              <View style={[styles.serviceCardImage, styles.serviceImageFallback]}>
                <item.icon size={40} color={COLORS.primary} />
              </View>
            )}
            
            <View style={[styles.serviceIconBadge, isRTL ? { left: 16 } : { right: 16 }]}>
              <item.icon size={22} color={COLORS.primary} />
            </View>
            
            <View style={[styles.serviceCategoryTag, isRTL ? { right: 16 } : { left: 16 }]}>
              <Text style={styles.serviceCategoryText}>
                {selectedFilter === 'all' ? t('category_general') || 'عام' : 
                 selectedFilter === 'fire' ? t('category_fire') || 'حريق' :
                 selectedFilter === 'alarm' ? t('category_alarm') || 'إنذار' :
                 selectedFilter === 'equipment' ? t('category_equipment') || 'معدات' : 
                 t('category_consulting') || 'استشارات'}
              </Text>
            </View>
          </View>

          {/* المحتوى */}
          <View style={styles.serviceContent}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceCardTitle} numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.ratingBadge}>
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
            
            <Text style={styles.serviceCardDesc} numberOfLines={2}>
              {desc}
            </Text>
            
            {/* المميزات */}
            {features.length > 0 && (
              <View style={styles.serviceFeatures}>
                {features.slice(0, 2).map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <CheckCircle size={14} color={COLORS.primary} />
                    <Text style={styles.featureText} numberOfLines={1}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* الزر - تبديل الأماكن في العربي */}
            <View style={[styles.serviceFooter, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => router.push({ 
                  pathname: '/service-details', 
                  params: { id: item.id } 
                })}
              >
                <Text style={styles.detailsButtonText}>
                  {t('view_details') || 'عرض التفاصيل'}
                </Text>
                
                {/* ✅ 3. الأيقونة هنا هتظهر 100% لأنها مش معمولة transform */}
                <ArrowIcon 
                    size={16} 
                    color={COLORS.primary} 
                    style={styles.detailsArrow} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quoteButton}
                onPress={() => router.push('/quote')}
              >
                <Text style={styles.quoteButtonText}>
                  {t('request_quote')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* 🔝 Header */}
      <LinearGradient
        colors={[COLORS.background, 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {t('services')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('services_subtitle') || 'اختر الخدمة التي تحتاجها'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* 🔍 Search Bar */}
        <View style={styles.section}>
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('search_placeholder')}
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign={isRTL ? 'right' : 'left'} 
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 🎯 Service Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('why_choose_us') || 'لماذا تختار خدماتنا؟'}
          </Text>
          
          <View style={styles.featuresGrid}>
            {SERVICE_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <View key={feature.id} style={styles.featureItem}>
                  <LinearGradient
                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)']}
                    style={styles.featureIconContainer}
                  >
                    <Icon size={22} color={COLORS.primary} />
                  </LinearGradient>
                  <Text style={styles.featureLabel}>
                    {feature.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 🏷️ Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('filter_by') || 'تصفية حسب:'}
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTag,
                  selectedFilter === filter.id && styles.filterTagActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 📊 Results Info */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredServices.length} {t('services_found') || 'خدمة'}
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
          >
            <Text style={styles.resetText}>
              {t('reset_filters') || 'إعادة التعيين'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🛡️ Services List */}
        <View style={styles.section}>
          {filteredServices.length > 0 ? (
            <FlatList
              data={filteredServices}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Search size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>
                {t('no_services_found') || 'لا توجد خدمات'}
              </Text>
              <Text style={styles.emptyDesc}>
                {t('try_different_search') || 'جرب بحثاً مختلفاً أو تصفية أخرى'}
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
              >
                <Text style={styles.emptyButtonText}>
                  {t('show_all_services') || 'عرض جميع الخدمات'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 🚀 CTA */}
        <View style={styles.section}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
            style={styles.ctaCard} 
          >
            <Text style={styles.ctaTitle}>
              {t('need_custom_service') || 'هل تحتاج خدمة مخصصة؟'}
            </Text>
            <Text style={styles.ctaDesc}>
              {t('contact_experts') || 'تواصل مع خبرائنا لتصميم حل يناسب احتياجاتك بالتحديد'}
            </Text>
            
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => router.push('/quote')}
            >
              <Text style={styles.ctaButtonText}>
                {t('request_custom_quote') || 'اطلب عرض سعر مخصص'}
              </Text>
              {/* هنا برضه بنستخدم الأيقونة الديناميكية */}
              <ArrowIcon size={16} color={COLORS.primary} style={styles.detailsArrow} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

      </ScrollView>
      <LoadingOverlay visible={loading} type="fetching" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SIZES.base * 2,
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
    textAlign: 'left',
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    opacity: 0.9,
    textAlign: 'left',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: SIZES.extraLarge,
    paddingHorizontal: SIZES.base * 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
    textAlign: 'left',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  searchIcon: {
    marginEnd: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    padding: 0,
    textAlign: 'left',
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  filtersScroll: {
    paddingRight: 20,
  },
  filterTag: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 6,
  },
  filterTagActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.background,
    fontWeight: '700',
  },
  resultsInfo: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  resultsCount: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  servicesList: {
    gap: 16,
  },
  serviceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  serviceCardGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  serviceImageContainer: {
    height: 160,
    position: 'relative',
  },
  serviceCardImage: {
    width: '100%',
    height: '100%',
  },
  serviceImageFallback: {
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIconBadge: {
    position: 'absolute',
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  serviceCategoryTag: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  serviceCategoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  serviceContent: {
    padding: 20,
    alignItems: 'flex-start',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  serviceCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'left',
  },
  ratingBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '700',
  },
  serviceCardDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'left',
  },
  serviceFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  featureTag: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    maxWidth: 120,
    textAlign: 'left',
  },
  serviceFooter: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quoteButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    flexGrow: 0,
  },
  quoteButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emptyButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  ctaCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: '90%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  ctaButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
  detailsArrow: {
    marginStart: 6, // ✅ هي دي اللي بتعمل المسافة
    flexShrink: 0, 
  },
});