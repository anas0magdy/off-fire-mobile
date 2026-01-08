import React, { useState, useEffect } from 'react'; // 👈 1. ضفنا useEffect
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, I18nManager
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail, Lock, User, Building, Phone, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme';
import { AuthService } from '../../services/auth';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useAlert } from '../../context/AlertContext';

export default function SignupScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  
  // 👈 2. استقبلنا الإيميل هنا مع رقم الطلب
  const { linkedOrderId, email } = useLocalSearchParams(); 

  const isRTL = I18nManager.isRTL;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const textAlignment = { textAlign: 'left' };

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    facility_name: '',
    facility_type: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // 👈 3. أول ما الصفحة تفتح، لو فيه إيميل جاي من الطلب، املأه في الفورم
  useEffect(() => {
    if (email) {
      setFormData(prev => ({ ...prev, email: email }));
    }
  }, [email]);

  const handleSignup = async () => {
    if (Object.values(formData).some(val => !val)) {
      showAlert(t('alert_warning'), t('fill_all_fields'), undefined, 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await AuthService.signUp(formData);
      
      // ملاحظة: لو نفذت كود SQL Trigger اللي فات، الربط هيحصل أوتوماتيك
      // لكن سيب الكود ده احتياطي مش هيضر
      if (linkedOrderId && data?.user?.id) {
        const cleanId = linkedOrderId.toString().replace(/\D/g, ''); 
        await AuthService.linkOrderToUser(cleanId, data.user.id);
      }

      showAlert(
        t('signup_success_title'), 
        t('signup_success_msg'),
        [{ text: t('i_understand'), onPress: () => router.replace('/(tabs)/menu') }],
        'success'
      );

    } catch (error) {
      showAlert(t('alert_error'), error.message || t('login_error'), undefined, 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {linkedOrderId && (
          <View style={styles.promoBanner}>
            <Text style={styles.promoText}>
              {t('promo_text', { orderId: linkedOrderId })}
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>{t('signup_title')}</Text>
          <Text style={styles.subtitle}>{t('signup_subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('full_name_label')}</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, textAlignment]} placeholder={t('ph_name')} placeholderTextColor={COLORS.textTertiary}
                value={formData.full_name} onChangeText={t => setFormData({...formData, full_name: t})}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('lbl_phone')}</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, textAlignment]} placeholder={t('ph_phone')} placeholderTextColor={COLORS.textTertiary}
                keyboardType="phone-pad"
                value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>{t('facility_name_label')}</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={[styles.input, textAlignment]} placeholder={t('ph_facility')} placeholderTextColor={COLORS.textTertiary}
                  value={formData.facility_name} onChangeText={t => setFormData({...formData, facility_name: t})}
                />
              </View>
            </View>
            
            <View style={[styles.inputGroup, { width: '40%' }]}>
              <Text style={styles.label}>{t('facility_type_label')}</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={[styles.input, textAlignment]} placeholder={t('facility_placeholder')} placeholderTextColor={COLORS.textTertiary}
                  value={formData.facility_type} onChangeText={t => setFormData({...formData, facility_type: t})}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('email_label')}</Text>
            <View style={[
                styles.inputContainer, 
                // 👈 4. تغيير لون الخلفية لو الإيميل جاي جاهز عشان نعرف المستخدم إنه مقفول
                email && { backgroundColor: COLORS.surfaceLight, opacity: 0.8 } 
            ]}>
              <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[
                    styles.input, 
                    textAlignment,
                    email && { color: COLORS.textSecondary } // لون النص رمادي
                ]} 
                placeholder={t('ph_email')} placeholderTextColor={COLORS.textTertiary}
                keyboardType="email-address" autoCapitalize="none"
                value={formData.email} 
                onChangeText={t => setFormData({...formData, email: t})}
                editable={!email} // 👈 5. ممنوع التعديل لو الإيميل جاي من الرابط
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('password_label')}</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, textAlignment]} placeholder={t('ph_password')} placeholderTextColor={COLORS.textTertiary}
                secureTextEntry
                value={formData.password} onChangeText={t => setFormData({...formData, password: t})}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleSignup} 
          >
              <Text style={styles.loginBtnText}>{t('signup_btn')}</Text>
              <ArrowIcon size={20} color={COLORS.background} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('have_account')}</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.linkText}>{t('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} type="processing" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 24, paddingTop: 60, flexGrow: 1 },
  
  promoBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: 12, borderRadius: 12, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.primary
  },
  promoText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10, textAlign: 'left' },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'left' },
  
  form: { gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'left' },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, 
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 12 
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, color: COLORS.textPrimary, fontSize: 14, textAlign: 'left' },
  
  loginBtn: { 
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 
  },
  loginBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10, marginBottom: 20 },
  footerText: { color: COLORS.textSecondary },
  linkText: { color: COLORS.primary, fontWeight: 'bold' }
});