import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, I18nManager
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, ArrowLeft, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme';
import { AuthService } from '../../services/auth';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useAlert } from '../../context/AlertContext';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  
  const isRTL = I18nManager.isRTL;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const textAlignment = { textAlign: 'left' }; 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert(t('alert_warning'), t('fill_all_fields'), undefined, 'warning');
      return;
    }

    setLoading(true);
    try {
      // الاستدعاء هنا هيشغل الـ sync الداخلي في auth.js
      await AuthService.signIn({ email, password });
      
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/menu'); 
      }
      
    } catch (error) {
      showAlert(t('alert_error'), t('login_error'), undefined, 'error');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <TouchableOpacity 
        style={styles.closeBtn} 
        onPress={() => {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)/menu');
            }
        }}
      >
        <X size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('login_welcome')}</Text>
          <Text style={styles.subtitle}>{t('login_subtitle')}</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('password_label')}</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={[styles.input, textAlignment]} 
                placeholder={t('ph_password')} 
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              style={styles.forgotBtn} 
              onPress={() => router.push('/auth/forgot-password')}
            >
                <Text style={styles.forgotText}>{t('forgot_password')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleLogin}
          >
              <Text style={styles.loginBtnText}>{t('login_btn')}</Text>
              <ArrowIcon size={20} color={COLORS.background} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('no_account')}</Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.linkText}>{t('create_account')}</Text>
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
  scrollContent: { padding: 24, paddingTop: 80, flexGrow: 1 }, 
  
  closeBtn: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 10, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: COLORS.surface, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },

  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10, textAlign: 'left' },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'left' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'left' },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, 
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, color: COLORS.textPrimary, fontSize: 14, textAlign: 'left' },
  
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },

  loginBtn: { 
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 
  },
  loginBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 20 },
  footerText: { color: COLORS.textSecondary },
  linkText: { color: COLORS.primary, fontWeight: 'bold' }
});