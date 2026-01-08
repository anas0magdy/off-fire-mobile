import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, I18nManager 
} from 'react-native'; // 👈 شيلنا ActivityIndicator و Alert من هنا
import { useRouter } from 'expo-router';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme';
import { AuthService } from '../../services/auth';
import { LoadingOverlay } from '../../components/LoadingOverlay'; // 👈 1. استدعاء المكون
import { useAlert } from '../../context/AlertContext'; // 👈 2. استدعاء الـ Alert الموحد

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showAlert } = useAlert(); // 👈 3. تفعيل الـ Alert
  
  const isRTL = I18nManager.isRTL;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const textAlignment = { textAlign: 'left' };

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      // 👈 استخدام الـ Custom Alert
      showAlert(t('alert_warning'), t('fill_all_fields'), undefined, 'warning');
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPasswordForEmail(email);
      
      // 👈 استخدام الـ Custom Alert للنجاح
      showAlert(
        t('reset_link_sent'), 
        t('reset_link_msg'),
        [{ text: "OK", onPress: () => router.back() }],
        'success'
      );
    } catch (error) {
      // 👈 استخدام الـ Custom Alert للخطأ
      showAlert(t('alert_error'), error.message, undefined, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <ArrowIcon size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('forgot_password_title')}</Text>
          <Text style={styles.subtitle}>{t('forgot_password_desc')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('email_label')}</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, textAlignment]} 
                placeholder={t('ph_email')} 
                placeholderTextColor={COLORS.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleReset}
            // disabled={loading} // مش محتاجين disable لأن الـ Overlay بيغطي الشاشة
          >
              <Text style={styles.loginBtnText}>{t('send_reset_link')}</Text>
              <ArrowIcon size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 👈 4. إضافة مكون التحميل في النهاية */}
      <LoadingOverlay visible={loading} type="submitting" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBar: { paddingTop: 60, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingTop: 40, flexGrow: 1 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10, textAlign: 'left' },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'left', lineHeight: 24 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'left' },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, 
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, color: COLORS.textPrimary, fontSize: 14, textAlign: 'left' },
  loginBtn: { 
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 
  },
  loginBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' }
});