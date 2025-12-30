import React from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  StatusBar, Linking, ScrollView, I18nManager 
} from 'react-native';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/theme';

export default function ContactScreen() {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const textAlignment = { textAlign: 'left' };
  const iconTransform = { transform: [{ scaleX: isRTL ? -1 : 1 }] };

  // دالة لفتح الروابط (اتصال، إيميل، خريطة)
  const handlePress = (type, value) => {
    let url = '';
    switch (type) {
      case 'phone': url = `tel:${value}`; break;
      case 'email': url = `mailto:${value}`; break;
      case 'map': url = 'https://maps.google.com/?q=Riyadh'; break; // رابط تجريبي للرياض
      default: break;
    }
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const ContactCard = ({ icon: Icon, title, desc, action, value }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handlePress(action, value)}
      activeOpacity={0.7}
    >
      <View style={styles.iconBox}>
        <Icon size={24} color={COLORS.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, textAlignment]}>{title}</Text>
        <Text style={[styles.cardDesc, textAlignment]}>{desc}</Text>
        <Text style={[styles.cardValue, textAlignment]}>{value}</Text>
      </View>
      <View style={styles.arrowBox}>
        <ArrowRight size={20} color={COLORS.textSecondary} style={iconTransform} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, textAlignment]}>{t('contact_title')}</Text>
          <Text style={[styles.subtitle, textAlignment]}>{t('contact_subtitle')}</Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.cardsContainer}>
          <ContactCard 
            icon={Phone} 
            title={t('phone_title')} 
            desc={t('phone_desc')} 
            value="+966 50 000 0000" 
            action="phone" 
          />
          
          <ContactCard 
            icon={Mail} 
            title={t('email_title')} 
            desc={t('email_desc')} 
            value="info@offfire.online" 
            action="email" 
          />
          
          <ContactCard 
            icon={MapPin} 
            title={t('location_title')} 
            desc={t('location_desc')} 
            value="Olaya St, Riyadh" 
            action="map" 
          />
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>{t('follow_us')}</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialBtn}><Facebook size={24} color="#1877F2" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Instagram size={24} color="#E4405F" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Linkedin size={24} color="#0A66C2" /></TouchableOpacity>
          </View>
        </View>

        {/* Send Message CTA */}
        <TouchableOpacity style={styles.messageBtn} activeOpacity={0.8}>
           <Text style={styles.messageBtnText}>{t('send_message')}</Text>
           <Send size={20} color={COLORS.background} style={iconTransform} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary },

  cardsContainer: { gap: 16, marginBottom: 40 },
  
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  iconBox: {
    width: 50, height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginEnd: 16
  },
  
  cardContent: { flex: 1, alignItems: 'flex-start' },
  cardTitle: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  cardDesc: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  cardValue: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  
  arrowBox: { marginStart: 10 },

  socialSection: { alignItems: 'center', marginBottom: 30 },
  socialTitle: { color: COLORS.textSecondary, marginBottom: 20, fontSize: 14 },
  socialIcons: { flexDirection: 'row', gap: 20 },
  socialBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border
  },

  messageBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    padding: 18, borderRadius: 16,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  messageBtnText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' }
});