import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, ArrowRight, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { supabase } from '../../services/supabase'; 
import { I18nManager } from 'react-native';
import { useAlert } from '../../context/AlertContext';
import { useTranslation } from 'react-i18next'; 

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  
  const textAlignment = { textAlign: 'left' }; 
  const isRTL = I18nManager.isRTL;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // ✅ التأكد من وجود جلسة (Session) فعالة
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsVerifying(false);
      } else {
        // لو مفيش جلسة، نستنى شوية يمكن الـ listener في _layout يشتغل
        // ولو طولت نرجعه للوجين
        setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) setIsVerifying(false);
            else {
                showAlert(t('alert_error'), "انتهت صلاحية الرابط", [{ text: "OK", onPress: () => router.replace('/auth/login') }]);
            }
        }, 3000);
      }
    };

    checkSession();
  }, []);

  const handleUpdate = async () => {
    if (!password || !confirmPassword) {
      showAlert(t('alert_warning'), t('fill_all_fields'));
      return;
    }
    if (password.length < 6) {
      showAlert(t('alert_warning'), t('password_min_length'));
      return;
    }
    if (password !== confirmPassword) {
      showAlert(t('alert_error'), t('password_mismatch'));
      return;
    }

    setLoading(true);
    try {
      // ✅ تحديث الباسورد للمستخدم الحالي
      const { error } = await supabase.auth.updateUser({ password: password });
      
      if (error) throw error;

      showAlert(
        t('password_updated'), 
        t('password_updated_msg'),
        [{ text: "OK", onPress: () => router.replace('/(tabs)/menu') }]
      );
    } catch (error) {
      showAlert(t('alert_error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background}}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{marginTop: 10, color: COLORS.textSecondary}}>جاري التحقق من الصلاحية...</Text>
        </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/auth/login')}> 
           <ArrowIcon size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={[styles.title, textAlignment]}>{t('change_password_title')}</Text>
          <Text style={[styles.subtitle, textAlignment]}>{t('forgot_password_desc')?.replace('email', 'new password') || 'Enter new password'}</Text> 
        </View>

        <View style={styles.form}>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, textAlignment]}>{t('new_password')}</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                 <Lock size={20} color={COLORS.textSecondary} />
              </View>
              <TextInput 
                style={[styles.input, textAlignment]} 
                placeholder="********" 
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={COLORS.textSecondary}/> : <Eye size={20} color={COLORS.textSecondary}/>}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, textAlignment]}>{t('confirm_password')}</Text>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                 <Lock size={20} color={COLORS.textSecondary} />
              </View>
              <TextInput 
                style={[styles.input, textAlignment]} 
                placeholder="********" 
                placeholderTextColor={COLORS.textTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <>
                <Text style={styles.loginBtnText}>{t('update_password_btn')}</Text>
                <CheckCircle size={20} color={COLORS.background} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBar: { paddingTop: 60, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' }, 
  scrollContent: { padding: 24, paddingTop: 20, flexGrow: 1 },
  
  header: { marginBottom: 40, alignItems: 'flex-start' }, 
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },
  
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'left' }, 
  
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', backgroundColor: COLORS.surface, 
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14 
  },
  iconBox: { marginEnd: 10 }, 
  
  input: { flex: 1, paddingVertical: 14, color: COLORS.textPrimary, fontSize: 14 },
  
  loginBtn: { 
    backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 
  },
  loginBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' }
});