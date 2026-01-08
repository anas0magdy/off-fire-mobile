import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, TextInput, I18nManager, Dimensions 
} from 'react-native';
import { ArrowLeft, Search, HelpCircle, ChevronDown, ChevronUp, MessageSquare, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function FAQScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const isRTL = I18nManager.isRTL;
  
  // 🔥 التعديل هنا: خليناها left ثابتة، والـ I18nManager هيقلبها يمين في العربي
  const textAlignment = { textAlign: 'left' };
  
  // تظبيط اتجاه السهم (زي صفحة contact)
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  
  const FAQ_ITEMS = [
    { id: 1, question: t('faq_question_1'), answer: t('faq_answer_1') },
    { id: 2, question: t('faq_question_2'), answer: t('faq_answer_2') },
    { id: 3, question: t('faq_question_3'), answer: t('faq_answer_3') },
    { id: 4, question: t('faq_question_4'), answer: t('faq_answer_4') },
    { id: 5, question: t('faq_question_5'), answer: t('faq_answer_5') },
    { id: 6, question: t('faq_question_6'), answer: t('faq_answer_6') },
    { id: 7, question: t('faq_question_7'), answer: t('faq_answer_7') },
    { id: 8, question: t('faq_question_8'), answer: t('faq_answer_8') },
  ];
  
  const filteredFAQ = FAQ_ITEMS.filter(item => 
    searchQuery === '' || 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <LinearGradient
        colors={[COLORS.background, 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            {/* عكسنا السهم هنا */}
            <ArrowLeft size={24} color={COLORS.textPrimary} style={iconTransform} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, textAlignment]}>
              {t('faq_title')}
            </Text>
            <Text style={[styles.headerSubtitle, textAlignment]}>
              {t('faq_subtitle')}
            </Text>
          </View>
          
          <HelpCircle size={24} color={COLORS.primary} />
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, textAlignment]}
              placeholder={t('search_faq_placeholder')}
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredFAQ.length} {t('questions_found') || 'سؤال'}
          </Text>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearAllText}>
                {t('clear_search') || 'مسح البحث'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.faqContainer}>
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion} 
                  onPress={() => toggleItem(item.id)} 
                  activeOpacity={0.8}
                >
                  <View style={styles.questionContent}>
                    <Text style={[styles.questionText, textAlignment]}>
                      {item.question}
                    </Text>
                    {expandedItems[item.id] ? (
                      <ChevronUp size={20} color={COLORS.primary} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>
                
                {expandedItems[item.id] && (
                  <View style={styles.faqAnswer}>
                    <Text style={[styles.answerText, textAlignment]}>
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <HelpCircle size={48} color={COLORS.textSecondary} />
              <Text style={[styles.emptyTitle, textAlignment]}>
                {t('no_results') || 'لا توجد نتائج'}
              </Text>
              <Text style={[styles.emptyDesc, textAlignment]}>
                {t('try_different_search') || 'جرب كلمات بحث مختلفة'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.supportSection}>
          <LinearGradient
            colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
            style={styles.supportCard}
          >
            <MessageSquare size={32} color={COLORS.primary} style={{ marginBottom: 16 }} />
            
            {/* هنا عملنا توسيط للنصوص عشان ده كارت دعم */}
            <Text style={[styles.supportTitle, {textAlign: 'center'}]}>
              {t('still_have_questions')}
            </Text>
            
            <Text style={[styles.supportDesc, {textAlign: 'center'}]}>
              {t('support_available')}
            </Text>
            
            <View style={styles.supportButtons}>
              <TouchableOpacity 
                style={styles.whatsappButton}
                onPress={() => router.push('/(tabs)/contact')}
              >
                <Text style={styles.whatsappButtonText}>
                  {t('contact_support')}
                </Text>
                <MessageSquare size={18} color="#25D366" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => router.push('/(tabs)/contact')}
              >
                <Text style={styles.callButtonText}>
                  {t('call_us') || 'اتصل بنا'}
                </Text>
                <Phone size={18} color={COLORS.background} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SIZES.base * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'flex-start', // هيتقلب يمين لوحده
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    opacity: 0.9,
  },
  
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  
  searchSection: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 24,
  },
  searchContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8, // غيرنا لـ marginRight وهيتقلب لوحده
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    padding: 0,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 20,
  },
  resultsCount: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  faqContainer: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 40,
  },
  faqItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    elevation: 2,
  },
  faqQuestion: {
    padding: 20,
  },
  questionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 16, // هيتقلب يمين في العربي
    lineHeight: 22,
  },
  faqAnswer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  answerText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
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
  },
  emptyDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  supportSection: {
    paddingHorizontal: SIZES.base * 2,
    marginBottom: 60,
  },
  supportCard: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  supportDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: '90%',
  },
  supportButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: 'rgba(37, 211, 102, 0.15)',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(37, 211, 102, 0.3)',
  },
  whatsappButtonText: {
    color: '#25D366',
    fontSize: 15,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '600',
  },
});