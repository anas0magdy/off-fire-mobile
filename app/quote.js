import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, ScrollView, Modal, FlatList, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard, I18nManager, Alert, ActivityIndicator 
} from 'react-native';
import { X, ChevronDown, CheckCircle, ArrowRight, ArrowLeft, Upload, FileText, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/theme';
import { SERVICES } from '../constants/data';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../services/supabase';

export default function QuoteScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  
  // بنحدد اللغة عشان اتجاه الكتابة داخل الخانة فقط
  const isArabic = i18n.language === 'ar';

  // ✅ 1. ده ستايل الكتابة (جوه المستطيل) -> يمين في العربي
  const inputAlign = { 
    textAlign: isArabic ? 'right' : 'left',
    writingDirection: isArabic ? 'rtl' : 'ltr' 
  };

  // ✅ 2. ده ستايل العناوين (Label) -> هنجبره يفضل شمال دائماً
  const labelAlign = { textAlign: 'left' }; 

  // اتجاه الأيقونات (زي المرفقات والدروب داون)
  const rowDir = { flexDirection: isArabic ? 'row-reverse' : 'row' };

  // Validation Schema
  const quoteSchema = z.object({
    name: z.string().min(3, { message: isArabic ? "الاسم قصير جداً" : "Name too short" }),
    phone: z.string().regex(/^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, { message: isArabic ? "رقم جوال غير صحيح" : "Invalid phone number" }),
    serviceId: z.number({ required_error: isArabic ? "يجب اختيار خدمة" : "Service is required" }),
    building: z.string().optional(),
    notes: z.string().optional(),
  });

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: '', phone: '', serviceId: undefined, building: '', notes: '' }
  });

  const selectedServiceId = watch("serviceId");
  const selectedService = SERVICES.find(s => s.id === selectedServiceId);

  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const [successData, setSuccessData] = useState({ visible: false, ref: '' });

  const handleCloseSuccess = () => {
    setSuccessData({ visible: false, ref: '' }); 
    router.back();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (!result.canceled) {
        const file = result.assets[0];
        if (file.size > 5 * 1024 * 1024) return Alert.alert("Error", "File too large (Max 5MB)");
        setAttachedFile(file);
      }
    } catch (err) { console.log(err); }
  };

  const uploadFileToSupabase = async (file) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
      const filePath = `${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('attachments').upload(filePath, decode(base64), { contentType: file.mimeType });
      if (error) throw error;
      const { data } = supabase.storage.from('attachments').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) { return null; }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (attachedFile) fileUrl = await uploadFileToSupabase(attachedFile);

      const { data, error } = await supabase.from('orders').insert([{
        client_name: formData.name,
        phone: formData.phone,
        service_id: formData.serviceId,
        service_name: t(`srv_${formData.serviceId}_title`),
        building_type: formData.building,
        notes: formData.notes,
        file_url: fileUrl,
        status: 'pending'
      }]).select();

      if (error) throw error;

      if (data && data.length > 0) {
        const finalRef = `#OFF-${data[0].id}`;
        setSuccessData({ visible: true, ref: finalRef });
      }

    } catch (error) {
      Alert.alert("Error", "Failed to submit request");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ServiceModalItem = ({ item }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => { setValue("serviceId", item.id, { shouldValidate: true }); setModalVisible(false); }}>
      <View style={[styles.modalIconBox, { backgroundColor: COLORS.surfaceLight }]}>
        <item.icon size={20} color={COLORS.primary} />
      </View>
      {/* القائمة المنسدلة برضه هنسيبها شمال عشان التناسق */}
      <Text style={[styles.modalText, { textAlign: 'left' }]}>{t(`srv_${item.id}_title`)}</Text>
      {selectedServiceId === item.id && <CheckCircle size={18} color={COLORS.success} />}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <TouchableOpacity style={styles.closePageBtn} onPress={() => router.back()}>
        <X size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={[styles.title, labelAlign]}>{t('quote_title')}</Text>
            <Text style={[styles.subtitle, labelAlign]}>{t('quote_subtitle')}</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Name */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, labelAlign]}>{t('lbl_name')} <Text style={{color: COLORS.error}}>*</Text></Text>
                <Controller control={control} name="name" render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput 
                        style={[styles.input, errors.name && styles.inputError, inputAlign]} 
                        onBlur={onBlur} onChangeText={onChange} value={value} 
                        placeholder={t('ph_name')} placeholderTextColor={COLORS.textTertiary}
                    />
                  )} />
                {errors.name && <Text style={[styles.errorText, labelAlign]}>{errors.name.message}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, labelAlign]}>{t('lbl_phone')} <Text style={{color: COLORS.error}}>*</Text></Text>
                <Controller control={control} name="phone" render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput 
                        style={[styles.input, errors.phone && styles.inputError, inputAlign]} 
                        onBlur={onBlur} onChangeText={onChange} value={value} 
                        keyboardType="phone-pad" placeholder={t('ph_phone')} placeholderTextColor={COLORS.textTertiary}
                    />
                  )} />
                {errors.phone && <Text style={[styles.errorText, labelAlign]}>{errors.phone.message}</Text>}
            </View>

            {/* Service Dropdown */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, labelAlign]}>{t('lbl_service')} <Text style={{color: COLORS.error}}>*</Text></Text>
                
                {/* 1. rowDir: بيعكس الأيقونة والكلمة
                   2. inputAlign: بيخلي الكلمة نفسها تروح يمين
                */}
                <TouchableOpacity style={[styles.dropdownBtn, errors.serviceId && styles.inputError, rowDir]} onPress={() => setModalVisible(true)}>
                    <Text style={[styles.dropdownText, !selectedService && { color: COLORS.textTertiary }, inputAlign]}>
                        {selectedService ? t(`srv_${selectedService.id}_title`) : t('select_service')}
                    </Text>
                    <ChevronDown size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
                {errors.serviceId && <Text style={[styles.errorText, labelAlign]}>{errors.serviceId.message}</Text>}
            </View>

            {/* Building */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, labelAlign]}>{t('lbl_building')}</Text>
                <Controller control={control} name="building" render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput style={[styles.input, inputAlign]} onBlur={onBlur} onChangeText={onChange} value={value} placeholder={t('ph_building')} placeholderTextColor={COLORS.textTertiary}/>
                  )} />
            </View>

            {/* Upload File */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, labelAlign]}>{isArabic ? 'مرفقات' : 'Attachments'}</Text>
                {!attachedFile ? (
                  <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument} activeOpacity={0.8}>
                    <Upload size={24} color={COLORS.primary} />
                    <Text style={styles.uploadText}>{isArabic ? 'اضغط لرفع ملف' : 'Tap to upload file'}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.fileCard, rowDir]}>
                    <View style={{flexDirection: rowDir.flexDirection, alignItems: 'center', gap: 10, flex: 1}}>
                        <View style={styles.fileIcon}><FileText size={20} color={COLORS.primary} /></View>
                        <Text style={styles.fileName} numberOfLines={1}>{attachedFile.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setAttachedFile(null)}><Trash2 size={20} color={COLORS.error} /></TouchableOpacity>
                  </View>
                )}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, labelAlign]}>{t('lbl_notes')}</Text>
                <Controller control={control} name="notes" render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput 
                        style={[styles.input, styles.textArea, inputAlign]} 
                        multiline numberOfLines={4} onBlur={onBlur} onChangeText={onChange} value={value} 
                        placeholder={t('ph_notes')} placeholderTextColor={COLORS.textTertiary} textAlignVertical="top"
                    />
                  )} />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <Text style={styles.submitText}>{isSubmitting ? t('sending') : t('submit_quote')}</Text>
                {!isSubmitting && (isArabic ? <ArrowLeft size={20} color={COLORS.dark} /> : <ArrowRight size={20} color={COLORS.dark} />)}
                {isSubmitting && <ActivityIndicator size="small" color={COLORS.dark} />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Services Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={[styles.modalHeader, rowDir]}>
                    <Text style={styles.modalTitle}>{t('lbl_service')}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color={COLORS.textSecondary} /></TouchableOpacity>
                </View>
                <FlatList data={SERVICES} renderItem={({item}) => <ServiceModalItem item={item} />} keyExtractor={item => item.id.toString()} />
            </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successData.visible} transparent animationType="fade">
        <View style={styles.successOverlay}>
            <View style={styles.successCard}>
                <View style={styles.successIcon}><CheckCircle size={40} color={COLORS.success} /></View>
                <Text style={styles.successTitle}>{t('success_title')}</Text>
                
                <Text style={[styles.successDesc, { fontSize: 18, color: COLORS.primary, fontWeight: 'bold', marginVertical: 8 }]}>
                    {isArabic ? `رقم الطلب: ${successData.ref}` : `Order Ref: ${successData.ref}`}
                </Text>
                
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
  closePageBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  scrollContent: { padding: 24, paddingTop: 80, paddingBottom: 40 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },
  formContainer: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, color: COLORS.textPrimary, fontSize: 14 },
  inputError: { borderColor: COLORS.error, borderWidth: 1 },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  textArea: { height: 100, paddingTop: 14 },
  dropdownBtn: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, justifyContent: 'space-between', alignItems: 'center' },
  // 👇 ضفت هنا flex: 1 عشان النص ياخد راحته في التمدد
  dropdownText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },
  submitBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitText: { color: COLORS.dark, fontSize: 16, fontWeight: 'bold' },
  
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary, borderRadius: 12, height: 80, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(245, 158, 11, 0.05)' },
  uploadText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },
  fileCard: { alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  fileIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  fileName: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '500', maxWidth: '80%' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '60%' },
  modalHeader: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginEnd: 12 },
  modalText: { fontSize: 16, color: COLORS.textPrimary, flex: 1 },

  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  successCard: { backgroundColor: COLORS.surface, width: '100%', padding: 30, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  successIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(16, 185, 129, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10, textAlign: 'center' },
  successDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  successBtn: { backgroundColor: COLORS.surfaceLight, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  successBtnText: { color: COLORS.textPrimary, fontWeight: 'bold' }
});