import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, FileText } from 'lucide-react-native';
import { COLORS } from '../constants/data';
import MainButton from '../components/MainButton'; 
import CustomAlert from '../components/CustomAlert'; // <--- استيراد التنبيه الجديد

const PROJECT_TYPES = [
  { id: 'consulting', label: 'استشارات هندسية' },
  { id: 'installation', label: 'توريد وتركيب كامل' },
  { id: 'audit', label: 'تدقيق ومراجعة' },
  { id: 'estimation', label: 'تسعير فقط (Estimation)' },
];

export default function QuoteScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', projectType: null, hasFile: false, notes: '' 
  });

  // --- إعدادات التنبيه الجديد ---
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'error' });

  const showAlert = (title, message, type = 'error') => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const hideAlert = () => {
    setAlertConfig({ ...alertConfig, visible: false });
  };
  // -----------------------------

  const handleNext = () => {
    if (step === 1 && (!formData.name.trim() || !formData.phone.trim())) {
        // استبدلنا Alert.alert بـ showAlert
        showAlert("بيانات ناقصة", "من فضلك تأكد من كتابة الاسم ورقم الجوال للمتابعة.", "error"); 
        return;
    }
    if (step === 2 && !formData.projectType) {
        showAlert("تنبيه", "لازم تختار نوع الخدمة المطلوبة عشان نقدر نحدد التكلفة.", "error"); 
        return;
    }
    if (step < 5) setStep(step + 1); else submitForm();
  };
  
  const prevStep = () => { if (step > 1) setStep(step - 1); else router.back(); };
  
  const submitForm = () => { setIsSubmitted(true); };

  // --- دوال عرض الخطوات ---
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>الاسم بالكامل <Text style={{color: COLORS.primary}}>*</Text></Text>
      <TextInput 
        style={styles.input} 
        placeholder="الاسم الثلاثي" 
        placeholderTextColor={COLORS.subText} 
        textAlign="right" 
        value={formData.name} 
        onChangeText={(t) => setFormData({...formData, name: t})} 
      />
      
      <Text style={styles.label}>رقم الجوال <Text style={{color: COLORS.primary}}>*</Text></Text>
      <TextInput 
        style={styles.input} 
        placeholder="05xxxxxxxx" 
        placeholderTextColor={COLORS.subText} 
        keyboardType="phone-pad" 
        textAlign="right" 
        value={formData.phone} 
        onChangeText={(t) => setFormData({...formData, phone: t})} 
      />
      
      <Text style={styles.label}>البريد الإلكتروني (اختياري)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="email@example.com" 
        placeholderTextColor={COLORS.subText} 
        keyboardType="email-address" 
        textAlign="right" 
        value={formData.email} 
        onChangeText={(t) => setFormData({...formData, email: t})} 
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>اختار نوع الخدمة المطلوبة:</Text>
      {PROJECT_TYPES.map((type) => (
        <TouchableOpacity 
          key={type.id} 
          style={[styles.typeCard, formData.projectType === type.id && styles.activeTypeCard]} 
          onPress={() => setFormData({...formData, projectType: type.id})}
          activeOpacity={0.8}
        >
          <Text style={[styles.typeText, formData.projectType === type.id && styles.activeTypeText]}>
            {type.label}
          </Text>
          <View style={[styles.radioCircle, formData.projectType === type.id && styles.activeRadioCircle]} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>عندك مخططات أو ملفات؟ (اختياري)</Text>
      <TouchableOpacity 
        style={styles.uploadBox} 
        onPress={() => setFormData({...formData, hasFile: !formData.hasFile})}
        activeOpacity={0.8}
      >
        {formData.hasFile ? (
          <>
            <FileText size={50} color={COLORS.primary} />
            <Text style={styles.uploadText}>تم إرفاق الملف: Project_Layout.pdf</Text>
            <Text style={{color: COLORS.cta, marginTop: 15, fontWeight: 'bold'}}>حذف الملف</Text>
          </>
        ) : (
          <>
            <Upload size={50} color={COLORS.subText} />
            <Text style={styles.uploadText}>اضغط هنا لرفع المخططات (PDF/Image)</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>ملاحظات إضافية</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="تفاصيل زيادة..." 
        placeholderTextColor={COLORS.subText} 
        multiline 
        numberOfLines={5} 
        textAlignVertical="top" 
        textAlign="right" 
        value={formData.notes} 
        onChangeText={(t) => setFormData({...formData, notes: t})} 
      />
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>مراجعة طلبك قبل الإرسال</Text>
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{formData.name}</Text>
            <Text style={styles.summaryLabel}>الاسم:</Text>
        </View>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{formData.phone}</Text>
            <Text style={styles.summaryLabel}>الجوال:</Text>
        </View>
        <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{PROJECT_TYPES.find(t => t.id === formData.projectType)?.label}</Text>
            <Text style={styles.summaryLabel}>الخدمة:</Text>
        </View>
      </View>
      <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxText}>موافق على الشروط وسياسة الخصوصية</Text>
          <View style={styles.checkedBox}><CheckCircle size={16} color="white"/></View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (step) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4();
        case 5: return renderStep5();
        default: return null;
    }
  };

  if (isSubmitted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <View style={styles.successIcon}><CheckCircle size={60} color={COLORS.white} /></View>
        <Text style={styles.successTitle}>تم استلام طلبك!</Text>
        <Text style={styles.successDesc}>فريقنا الهندسي هيراجع الطلب وهيتواصل معاك خلال 24 ساعة.</Text>
        <MainButton title="العودة للرئيسية" onPress={() => router.replace('/(tabs)')} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        
        {/* إضافة المكون في الصفحة */}
        <CustomAlert 
            visible={alertConfig.visible}
            title={alertConfig.title}
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={hideAlert}
        />

        <View style={styles.header}>
            <View style={{ width: 40 }} /> 
            <Text style={styles.headerTitle}>طلب عرض سعر</Text>
            <TouchableOpacity onPress={prevStep} style={styles.backBtn}>
                <ArrowRight size={24} color="white" />
            </TouchableOpacity>
        </View>

        <View style={styles.progressWrapper}>
            <View style={[styles.progressBar, { width: `${(step / 5) * 100}%` }]} />
        </View>
        <Text style={styles.stepCount}>خطوة {step} من 5</Text>

        <ScrollView contentContainerStyle={styles.content}>
          {renderContent()} 
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.mainBtn} onPress={handleNext} activeOpacity={0.8}>
            {step !== 5 && <ArrowLeft size={22} color="white" />}
            <Text style={styles.btnText}>{step === 5 ? 'إرسال الطلب الآن' : 'التالي'}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  backBtn: { width: 40, height: 40, backgroundColor: COLORS.card, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  progressWrapper: { height: 6, backgroundColor: COLORS.card, marginHorizontal: 20, marginTop: 20, borderRadius: 10, overflow: 'hidden', direction: 'rtl' },
  progressBar: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 10 },
  stepCount: { color: COLORS.subText, textAlign: 'center', marginTop: 8, fontSize: 13, fontWeight: 'bold' },
  content: { padding: 25 },
  stepContainer: { flex: 1 },
  label: { color: COLORS.text, marginBottom: 12, fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  input: { backgroundColor: COLORS.card, color: 'white', paddingVertical: 18, paddingHorizontal: 15, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
  textArea: { minHeight: 120 },
  stepTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  typeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 20, backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  activeTypeCard: { borderColor: COLORS.primary, backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.subText, marginLeft: 15 },
  activeRadioCircle: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  typeText: { color: COLORS.text, fontSize: 16, fontWeight: '500' },
  activeTypeText: { color: COLORS.primary, fontWeight: 'bold' },
  uploadBox: { height: 250, backgroundColor: COLORS.card, borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  uploadText: { color: COLORS.subText, marginTop: 15, fontSize: 16 },
  summaryBox: { backgroundColor: COLORS.card, padding: 20, borderRadius: 16, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 10 },
  summaryLabel: { color: COLORS.subText, fontSize: 14 },
  summaryValue: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  checkedBox: { width: 24, height: 24, backgroundColor: COLORS.primary, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkboxText: { color: COLORS.subText },
  footer: { padding: 20, paddingBottom: 30, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.dark },
  mainBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  btnText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 18 },
  successIcon: { width: 100, height: 100, backgroundColor: COLORS.primary, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  successDesc: { color: COLORS.subText, textAlign: 'center', marginBottom: 30, lineHeight: 24, fontSize: 16 },
});