import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, ScrollView, Modal, FlatList, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard, I18nManager, Alert 
} from 'react-native';
import { X, ChevronDown, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react-native'; // ArrowRight Added
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/theme';
import { SERVICES } from '../constants/data';

export default function QuoteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  // State للفورم
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    building: '',
    notes: '',
    serviceId: null,
    serviceName: ''
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const textAlignment = { textAlign: 'left' }; // Mapping native start
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  // دالة الإرسال (محاكاة)
  const handleSubmit = () => {
    // تحقق بسيط (Validation)
    if (!formData.name || !formData.phone || !formData.serviceId) {
      Alert.alert(t('err_required'), t('lbl_name') + ', ' + t('lbl_phone') + ', ' + t('lbl_service'));
      return;
    }

    setIsSubmitting(true);

    // محاكاة إرسال للسيرفر (2 ثانية)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    router.back(); // رجوع للرئيسية
  };

  const ServiceModalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.modalItem} 
      onPress={() => {
        setFormData({ ...formData, serviceId: item.id, serviceName: t(`srv_${item.id}_title`) });
        setModalVisible(false);
      }}
    >
      <View style={[styles.modalIconBox, { backgroundColor: COLORS.surfaceLight }]}>
        <item.icon size={20} color={COLORS.primary} />
      </View>
      <Text style={[styles.modalText, textAlignment]}>{t(`srv_${item.id}_title`)}</Text>
      {formData.serviceId === item.id && <CheckCircle size={18} color={COLORS.success} />}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* زر إغلاق الصفحة */}
      <TouchableOpacity 
        style={styles.closePageBtn} 
        onPress={() => router.back()}
      >
        <X size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, textAlignment]}>{t('quote_title')}</Text>
            <Text style={[styles.subtitle, textAlignment]}>{t('quote_subtitle')}</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            
            {/* 1. Name */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, textAlignment]}>{t('lbl_name')} <Text style={{color: COLORS.error}}>*</Text></Text>
                <TextInput 
                    style={[styles.input, textAlignment]}
                    placeholder={t('ph_name')}
                    placeholderTextColor={COLORS.textTertiary}
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                />
            </View>

            {/* 2. Phone */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, textAlignment]}>{t('lbl_phone')} <Text style={{color: COLORS.error}}>*</Text></Text>
                <TextInput 
                    style={[styles.input, textAlignment]}
                    placeholder={t('ph_phone')}
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({...formData, phone: text})}
                />
            </View>

            {/* 3. Service Dropdown (Custom) */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, textAlignment]}>{t('lbl_service')} <Text style={{color: COLORS.error}}>*</Text></Text>
                <TouchableOpacity 
                    style={styles.dropdownBtn}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={[styles.dropdownText, !formData.serviceId && { color: COLORS.textTertiary }]}>
                        {formData.serviceName || t('select_service')}
                    </Text>
                    <ChevronDown size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* 4. Building Type */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, textAlignment]}>{t('lbl_building')}</Text>
                <TextInput 
                    style={[styles.input, textAlignment]}
                    placeholder={t('ph_building')}
                    placeholderTextColor={COLORS.textTertiary}
                    value={formData.building}
                    onChangeText={(text) => setFormData({...formData, building: text})}
                />
            </View>

            {/* 5. Notes */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, textAlignment]}>{t('lbl_notes')}</Text>
                <TextInput 
                    style={[styles.input, styles.textArea, textAlignment]}
                    placeholder={t('ph_notes')}
                    placeholderTextColor={COLORS.textTertiary}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top" // مهم للأندرويد في الـ textArea
                    value={formData.notes}
                    onChangeText={(text) => setFormData({...formData, notes: text})}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
                style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.submitText}>{isSubmitting ? t('sending') : t('submit_quote')}</Text>
                {!isSubmitting && (
                   // استخدام الأيقونة الصحيحة بناءً على اللغة
                   isRTL ? <ArrowLeft size={20} color={COLORS.dark} /> : <ArrowRight size={20} color={COLORS.dark} />
                )}
            </TouchableOpacity>

          </View>

        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Services Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{t('lbl_service')}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <X size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>
                <FlatList 
                    data={SERVICES}
                    renderItem={({item}) => <ServiceModalItem item={item} />}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
            <View style={styles.successCard}>
                <View style={styles.successIcon}>
                    <CheckCircle size={40} color={COLORS.success} />
                </View>
                <Text style={styles.successTitle}>{t('success_title')}</Text>
                <Text style={styles.successDesc}>{t('success_desc')}</Text>
                <TouchableOpacity style={styles.successBtn} onPress={handleCloseSuccess}>
                    <Text style={styles.successBtnText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  closePageBtn: {
    position: 'absolute', top: 50, right: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border
  },

  scrollContent: { padding: 24, paddingTop: 80, paddingBottom: 40 },

  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },

  formContainer: { gap: 20 },
  
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.textPrimary,
    fontSize: 14
  },
  textArea: { height: 100, paddingTop: 14 },

  dropdownBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  dropdownText: { fontSize: 14, color: COLORS.textPrimary },

  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: 16, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 10,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  submitText: { color: COLORS.dark, fontSize: 16, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginEnd: 12 },
  modalText: { fontSize: 16, color: COLORS.textPrimary, flex: 1 },

  // Success Styles
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successCard: { backgroundColor: COLORS.surface, width: '100%', padding: 30, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  successIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(16, 185, 129, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10, textAlign: 'center' },
  successDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  successBtn: { backgroundColor: COLORS.surfaceLight, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  successBtnText: { color: COLORS.textPrimary, fontWeight: 'bold' }
});