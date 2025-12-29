import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, StatusBar, 
  Linking, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/data';
import MainButton from '../../components/MainButton';

const { width } = Dimensions.get('window');

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCall = () => Linking.openURL(`tel:+966500000000`);
  const handleWhatsApp = () => Linking.openURL(`https://wa.me/966500000000`);
  const handleEmail = () => Linking.openURL(`mailto:info@offfire.online`);
  const handleWebsite = () => Linking.openURL(`https://offfire.online`);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} translucent />
        
        {/* Header Background Gradient */}
        <LinearGradient
            colors={[COLORS.darker, COLORS.dark]}
            style={StyleSheet.absoluteFill}
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 1. Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>تواصل معنا</Text>
            <Text style={styles.headerSubtitle}>فريقنا جاهز للرد على استفساراتك 24/7</Text>
          </View>

          {/* 2. Quick Actions Grid */}
          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.actionCard} onPress={handleCall} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6' }]}>
                    <Phone size={24} color="#3b82f6" />
                </View>
                <Text style={styles.actionLabel}>اتصال</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleWhatsApp} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22c55e' }]}>
                    <MessageCircle size={24} color="#22c55e" />
                </View>
                <Text style={styles.actionLabel}>واتساب</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleEmail} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: COLORS.primary }]}>
                    <Mail size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.actionLabel}>ايميل</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleWebsite} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(148, 163, 184, 0.15)', borderColor: COLORS.subText }]}>
                    <Globe size={24} color={COLORS.subText} />
                </View>
                <Text style={styles.actionLabel}>الموقع</Text>
            </TouchableOpacity>
          </View>

          {/* 3. Info Card (Map & Time) */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
                <View style={styles.miniIcon}><MapPin size={18} color={COLORS.white}/></View>
                <View style={{flex: 1}}>
                    <Text style={styles.infoLabel}>مقرنا الرئيسي</Text>
                    <Text style={styles.infoValue}>الرياض، طريق الملك فهد، حي العقيق</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
                <View style={styles.miniIcon}><Clock size={18} color={COLORS.white}/></View>
                <View style={{flex: 1}}>
                    <Text style={styles.infoLabel}>ساعات العمل</Text>
                    <Text style={styles.infoValue}>السبت - الخميس: 9:00 ص - 6:00 م</Text>
                </View>
            </View>
          </View>

          {/* 4. Contact Form */}
          <View style={styles.formContainer}>
              <Text style={styles.formTitle}>أرسل رسالة سريعة</Text>
              
              <Text style={styles.inputLabel}>الاسم</Text>
              <TextInput 
                  style={styles.input} 
                  placeholder="الاسم الكريم" 
                  placeholderTextColor={COLORS.subText} 
                  textAlign="right"
                  value={name}
                  onChangeText={setName}
              />
              
              <Text style={styles.inputLabel}>الرسالة</Text>
              <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="كيف يمكننا مساعدتك؟" 
                  placeholderTextColor={COLORS.subText} 
                  multiline
                  numberOfLines={4}
                  textAlign="right"
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
              />
              
              <View style={{ marginTop: 10 }}>
                <MainButton 
                    title="إرسال الرسالة" 
                    onPress={() => alert('تم الإرسال بنجاح!')}
                    icon={false}
                />
              </View>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { padding: 20, paddingBottom: 100, paddingTop: 60 },
  
  header: { marginBottom: 30 },
  headerTitle: { color: COLORS.white, fontSize: 32, fontWeight: 'bold', marginBottom: 5, textAlign: 'left' },
  headerSubtitle: { color: COLORS.subText, fontSize: 16, textAlign: 'left' },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  actionCard: { 
    width: '48%', 
    backgroundColor: COLORS.card, 
    borderRadius: 20, 
    padding: 15, 
    alignItems: 'center', 
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  actionLabel: { color: COLORS.white, fontSize: 14, fontWeight: 'bold' },

  infoCard: { 
    backgroundColor: COLORS.card, 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 25, 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  miniIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  infoLabel: { color: COLORS.subText, fontSize: 12, marginBottom: 4, textAlign: 'left' },
  infoValue: { color: COLORS.white, fontSize: 14, fontWeight: 'bold', textAlign: 'left' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 15 },

  formContainer: { 
    backgroundColor: COLORS.card, 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: COLORS.primary, // حدود ذهبية خفيفة للتركيز
  },
  formTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'left' },
  
  inputLabel: { color: COLORS.white, fontSize: 14, marginBottom: 8, fontWeight: '600', textAlign: 'left' },
  input: { 
    backgroundColor: COLORS.dark, 
    color: COLORS.white, 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    fontSize: 15
  },
  textArea: { minHeight: 120 },
});