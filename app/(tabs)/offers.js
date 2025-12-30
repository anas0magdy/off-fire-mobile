import React, { useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  StatusBar, I18nManager 
} from 'react-native';
import { Ticket, Copy, Check, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard'; // استيراد مكتبة النسخ
import { COLORS } from '../../constants/theme';
import { OFFERS } from '../../constants/data';

export default function OffersScreen() {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  // حالة عشان نغير شكل الزرار لما المستخدم ينسخ الكود
  const [copiedId, setCopiedId] = useState(null);

  const textAlignment = { textAlign: 'left' };
  const flexDirection = { flexDirection: 'row' }; 

  const handleCopy = async (code, id) => {
    // 1. نسخ الكود للحافظة فعلياً
    await Clipboard.setStringAsync(code);
    
    // 2. تغيير حالة الزرار
    setCopiedId(id);
    
    // 3. رجع الزرار لطبيعته بعد ثانيتين
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderOfferItem = ({ item }) => {
    // ترجمة البيانات
    const title = item.id === 1 ? t('off_20_title') : t('off_free_title');
    const desc = item.id === 1 ? t('off_20_desc') : t('off_free_desc');
    
    const isCopied = copiedId === item.id;

    return (
      <View style={styles.couponCard}>
        {/* الجزء الأيسر: الأيقونة واللون المميز */}
        <View style={styles.leftPart}>
            <View style={styles.iconCircle}>
                <Ticket size={24} color={COLORS.background} />
            </View>
            <View style={styles.verticalLine} />
        </View>

        {/* الجزء الأيمن: التفاصيل */}
        <View style={styles.rightPart}>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={[styles.offerTitle, textAlignment]}>{title}</Text>
                <Text style={[styles.offerDesc, textAlignment]}>{desc}</Text>
                
                <View style={[styles.validityBox, flexDirection]}>
                    <Clock size={12} color={COLORS.textSecondary} />
                    <Text style={styles.validityText}> {t('valid_until')} 30 Dec 2025</Text>
                </View>
            </View>

            {/* زرار الكود */}
            <TouchableOpacity 
                style={[
                    styles.codeBtn, 
                    isCopied && { backgroundColor: COLORS.success, borderColor: COLORS.success }
                ]}
                onPress={() => handleCopy(item.code, item.id)}
                activeOpacity={0.7}
            >
                <Text style={[styles.codeText, isCopied && { color: 'white' }]}>
                    {isCopied ? t('copied') : item.code}
                </Text>
                {isCopied ? (
                    <Check size={16} color="white" style={{ marginLeft: 5 }} />
                ) : (
                    <Copy size={16} color={COLORS.primary} style={{ marginLeft: 5 }} />
                )}
            </TouchableOpacity>
        </View>

        {/* دوائر الزينة (عشان شكل الكوبون المقصوص) */}
        <View style={[styles.circleCut, { top: -10, left: 70 }]} />
        <View style={[styles.circleCut, { bottom: -10, left: 70 }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, textAlignment]}>{t('offers_title')}</Text>
        <Text style={[styles.headerSub, textAlignment]}>
            {t('welcome')}
        </Text>
      </View>

      <FlatList
        data={OFFERS}
        renderItem={renderOfferItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  headerContainer: { padding: 20, paddingTop: 60, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary },
  headerSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 5 },

  listContent: { padding: 20 },

  couponCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    height: 140,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1, borderColor: COLORS.border 
  },

  leftPart: {
    width: 80,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16, 
    borderBottomRightRadius: 16,
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center'
  },
  
  rightPart: {
    flex: 1,
    padding: 16,
    paddingLeft: 24, 
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },

  offerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 4 },
  offerDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },
  
  validityBox: { alignItems: 'center', marginTop: 5 },
  validityText: { fontSize: 10, color: COLORS.textSecondary, marginStart: 4 },

  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignSelf: 'flex-end',
    marginTop: -20
  },
  codeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4
  },

  circleCut: {
    position: 'absolute',
    width: 20, height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    zIndex: 2
  }
});