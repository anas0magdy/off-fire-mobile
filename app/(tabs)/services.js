import React from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Image, TextInput, StatusBar, I18nManager, Platform 
} from 'react-native';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react-native'; // ArrowRight Added
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme';
import { SERVICES } from '../../constants/data';

export default function ServicesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // تحديد اتجاه النصوص والأيقونات ديناميكياً (نفس نظام الصفحة الرئيسية)
  const isRTL = I18nManager.isRTL;
  const textAlignment = { textAlign: 'left' }; // native start mapping
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  // دالة لرسم كارت الخدمة
  const renderServiceItem = ({ item }) => {
    // بنجيب الترجمة بناءً على الـ ID بتاع الخدمة
    const title = t(`srv_${item.id}_title`); 
    const desc = t(`srv_${item.id}_desc`);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({ pathname: '/service-details', params: { id: item.id } })}
        activeOpacity={0.8}
      >
        {/* صورة الخدمة */}
        <View style={styles.imageContainer}>
            {item.image ? (
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            ) : (
                // لو مفيش صورة (زي خدمة التراخيص) بنحط لون خلفية
                <View style={[styles.cardImage, { backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center' }]}>
                    <item.icon size={40} color={COLORS.primary} />
                </View>
            )}
            
            {/* الأيقونة العائمة فوق الصورة */}
            <View style={styles.iconBadge}>
                <item.icon size={20} color={COLORS.primary} />
            </View>
        </View>

        {/* محتوى الكارت */}
        <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, textAlignment]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.cardDesc, textAlignment]} numberOfLines={2}>{desc}</Text>
            
            <View style={styles.cardFooter}>
                <Text style={styles.learnMore}>
                    {t('see_all') || 'More'} 
                </Text>
                {/* استخدمنا ArrowRight هنا عشان يبقى شكله زي "اقرأ المزيد ->" */}
                <ArrowRight size={14} color={COLORS.primary} style={iconTransform} /> 
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* 1. Header & Search */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, textAlignment]}>{t('services')}</Text>
        
        {/* Search Bar - شكل احترافي */}
        <View style={styles.searchBar}>
            <Search size={20} color={COLORS.textSecondary} style={{ marginHorizontal: 10 }} />
            <TextInput 
                placeholder={t('search_placeholder')}
                placeholderTextColor={COLORS.textSecondary}
                style={[styles.searchInput, textAlignment]} 
            />
        </View>
      </View>

      {/* 2. Services Grid */}
      <FlatList
        data={SERVICES}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // عرض كارتين بجانب بعض
        columnWrapperStyle={styles.columnWrapper} // مسافات بين العمودين
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  headerContainer: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 15 },
  
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: COLORS.surface, 
    borderRadius: 12, height: 50, paddingHorizontal: 5,
    borderWidth: 1, borderColor: COLORS.border 
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14, height: '100%' },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 20 },

  card: { 
    width: '48%', // عشان ياخد نص الشاشة مع مسافة صغيرة
    backgroundColor: COLORS.surface, 
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 4
  },
  
  imageContainer: { height: 120, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  
  iconBadge: {
    position: 'absolute', top: 10, right: 10, // دايما يمين الصورة كشكل جمالي
    width: 36, height: 36, borderRadius: 18, 
    backgroundColor: COLORS.background, // لون داكن عشان يبرز
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border
  },

  cardContent: { padding: 12, alignItems: 'flex-start' }, // alignItems مهم عشان الكلام يبدأ صح
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 16 },
  
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' },
  learnMore: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
});