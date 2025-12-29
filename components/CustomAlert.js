import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { BlurView } from 'expo-blur'; // ✅ المكتبة شغالة الآن
import { COLORS } from '../constants/data';

const { width } = Dimensions.get('window');

export default function CustomAlert({ visible, title, message, type = 'error', onClose }) {
  if (!visible) return null;

  let IconComponent = Info;
  let iconColor = COLORS.primary;
  
  if (type === 'error') {
    IconComponent = AlertCircle;
    iconColor = '#ef4444'; 
  } else if (type === 'success') {
    IconComponent = CheckCircle;
    iconColor = '#10b981'; 
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* BlurView بيعمل تغبيش للخلفية كلها
         intensity: 40 (قوة التغبيش)
         tint: "dark" (عشان يدي لوك فخم وغامق)
      */}
      <BlurView intensity={40} tint="systemThickMaterialDark" style={styles.overlay}>
        
        <View style={styles.alertContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${iconColor}20`, borderColor: iconColor }]}>
            <IconComponent size={32} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: iconColor }]} 
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>حسناً</Text>
          </TouchableOpacity>
        </View>

      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.3)' // طبقة سوداء خفيفة فوق التغبيش لزيادة التباين
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: 'rgba(30, 41, 59, 0.85)', // لون الكارت غامق وشفاف سنة
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // حدود مضيئة خفيفة
    // الظلال لزيادة العمق
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  iconCircle: {
    width: 60, height: 60,
    borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    color: COLORS.subText,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});