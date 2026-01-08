import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react-native';
// شيلنا سطر BlurView من هنا عشان ميعملش مشاكل
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function CustomAlert({ visible, title, message, buttons = [], type = 'info', onClose }) {
  if (!visible) return null;

  // تحديد الأيقونة ولون الثيم حسب نوع التنبيه
  let Icon = Info;
  let iconColor = COLORS.primary;
  
  if (type === 'success') { Icon = CheckCircle; iconColor = '#10b981'; }
  else if (type === 'error') { Icon = X; iconColor = '#ef4444'; }
  else if (type === 'warning') { Icon = AlertTriangle; iconColor = '#f59e0b'; }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          
          {/* Header Icon */}
          <View style={[styles.iconWrapper, { borderColor: iconColor, backgroundColor: `${iconColor}15` }]}>
            <Icon size={32} color={iconColor} />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => {
              const isPrimary = btn.style !== 'cancel';
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button, 
                    isPrimary ? { backgroundColor: iconColor } : styles.cancelButton
                  ]}
                  onPress={() => {
                    if (btn.onPress) btn.onPress();
                    onClose();
                  }}
                >
                  <Text style={[
                    styles.buttonText, 
                    !isPrimary && { color: COLORS.textSecondary }
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // لون الخلفية الغامق الشفاف
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: COLORS.surface, 
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});