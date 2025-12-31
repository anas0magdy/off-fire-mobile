import React from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Image, TextInput, StatusBar, I18nManager, Platform 
} from 'react-native';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react-native'; 
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme';
import { SERVICES } from '../../constants/data';

export default function ServicesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  
  // ✅ 1. بنشوف اللغة عشان السيرش بار بس
  const isArabic = i18n.language === 'ar';

  // ✅ 2. ستايلات خاصة بالهيدر والسيرش بار فقط
  const headerAlign = { textAlign: isArabic ? 'right' : 'left' };
  const searchDir = { flexDirection: isArabic ? 'row-reverse' : 'row' };
  
  // ده عشان أيقونة السهم في الكروت (شكله حلو لما يتقلب)
  const iconTransform = { transform: [{ scaleX: isArabic ? -1 : 1 }] };

  const renderServiceItem = ({ item }) => {
    const title = t(`srv_${item.id}_title`); 
    const desc = t(`srv_${item.id}_desc`);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({ pathname: '/service-details', params: { id: item.id } })}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
            {item.image ? (
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            ) : (
                <View style={[styles.cardImage, { backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center' }]}>
                    <item.icon size={40} color={COLORS.primary} />
                </View>
            )}
            
            {/* رجعنا مكان الأيقونة ثابت يمين زي كودك القديم */}
            <View style={styles.iconBadge}>
                <item.icon size={20} color={COLORS.primary} />
            </View>
        </View>

        {/* ⛔️ ملمسناش الكارت نهائي: هيفضل محاذاة للشمال زي ما كان مظبوط معاك */}
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{desc}</Text>
            
            <View style={styles.cardFooter}>
                <Text style={styles.learnMore}>
                    {t('see_all') || 'More'} 
                </Text>
                <ArrowRight size={14} color={COLORS.primary} style={iconTransform} /> 
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ✅ 3. التعديل الوحيد هنا: الهيدر والبحث */}
      <View style={styles.headerContainer}>
        {/* العنوان يجي يمين */}
        <Text style={[styles.headerTitle, headerAlign]}>{t('services')}</Text>
        
        {/* شريط البحث: بنعكسه عشان العدسة والكتابة يبقوا يمين */}
        <View style={[styles.searchBar, searchDir]}>
            <Search size={20} color={COLORS.textSecondary} style={{ marginHorizontal: 10 }} />
            <TextInput 
                placeholder={t('search_placeholder')}
                placeholderTextColor={COLORS.textSecondary}
                // الكتابة جوه البحث يمين
                style={[styles.searchInput, headerAlign]} 
            />
        </View>
      </View>

      <FlatList
        data={SERVICES}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
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
    alignItems: 'center', // شيلنا flexDirection عشان بنحطه ديناميك فوق
    backgroundColor: COLORS.surface, 
    borderRadius: 12, height: 50, paddingHorizontal: 5,
    borderWidth: 1, borderColor: COLORS.border 
  },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14, height: '100%' },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 20 },

  card: { 
    width: '48%', 
    backgroundColor: COLORS.surface, 
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 4
  },
  
  imageContainer: { height: 120, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  
  iconBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 36, height: 36, borderRadius: 18, 
    backgroundColor: COLORS.background, 
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border
  },

  // ⛔️ رجعت زي القديم بالظبط: flex-start و left
  cardContent: { padding: 12, alignItems: 'flex-start' }, 
  // رجعت textAlign left عشان ميبوظش
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4, textAlign: 'left' },
  cardDesc: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 16, textAlign: 'left' },
  
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' },
  learnMore: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
});