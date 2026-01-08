import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  StatusBar, I18nManager, Alert 
} from 'react-native';
import { Ticket, Copy, Check, Clock, Bell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../../constants/theme';
import { OFFERS } from '../../constants/data';
import { sendOfferNotification, checkNotificationStatus } from '../../services/notifications'; 
import { LoadingOverlay } from '../../components/LoadingOverlay'; // 👈 New import

export default function OffersScreen() {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [copiedId, setCopiedId] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); 
  const [loading, setLoading] = useState(false); // 👈 New loading state

  const textAlignment = { textAlign: 'left' };
  const flexDirection = { flexDirection: 'row' };

  // Check notification status on mount
  useEffect(() => {
    checkNotificationStatus().then(status => {
      setNotificationsEnabled(status.enabled);
    });
  }, []);

  // Update handleCopy to trigger loading state
  const handleCopy = async (code, id, title, desc) => {
    try {
      setLoading(true); // 👈 Start loading

      // 1. Copy code to clipboard
      await Clipboard.setStringAsync(code);
      
      // 2. Send notification if enabled
      if (notificationsEnabled) {
        const sent = await sendOfferNotification(title, desc, code);
        if (!sent) {
          Alert.alert('ملاحظة', 'لم يتم إرسال الإشعار. تأكد من تفعيل الإشعارات');
        }
      }
      
      // 3. Change button state
      setCopiedId(id);
      
      // 4. Reset button state after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);

    } catch (error) {
      console.error('Copy failed', error);
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };

  const renderOfferItem = ({ item }) => {
    const title = item.id === 1 ? t('off_20_title') : t('off_free_title');
    const desc = item.id === 1 ? t('off_20_desc') : t('off_free_desc');
    
    const isCopied = copiedId === item.id;

    return (
      <View style={styles.couponCard}>
        {/* Left Part: Icon and distinct color */}
        <View style={styles.leftPart}>
            <View style={styles.iconCircle}>
                <Ticket size={24} color={COLORS.background} />
            </View>
            <View style={styles.verticalLine} />
        </View>

        {/* Right Part: Details */}
        <View style={styles.rightPart}>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={[styles.offerTitle, textAlignment]}>{title}</Text>
                <Text style={[styles.offerDesc, textAlignment]}>{desc}</Text>
                
                <View style={[styles.validityBox, flexDirection]}>
                    <Clock size={12} color={COLORS.textSecondary} />
                    <Text style={styles.validityText}> {t('valid_until')} 30 Dec 2025</Text>
                </View>
            </View>

            {/* Code Button */}
            <TouchableOpacity 
                style={[
                    styles.codeBtn, 
                    isCopied && { backgroundColor: COLORS.success, borderColor: COLORS.success }
                ]}
                onPress={() => handleCopy(item.code, item.id, title, desc)}
                activeOpacity={0.7}
            >
                <Text style={[styles.codeText, isCopied && { color: 'white' }]}>
                    {isCopied ? t('copied') : item.code}
                </Text>
                {isCopied ? (
                    <Check size={16} color="white" style={{ marginLeft: 5 }} />
                ) : (
                    <Copy size={16} color={COLORS.primary} style={{ marginLeft: 5 }} />
                )}
            </TouchableOpacity>
        </View>

        {/* Decorative Circles */}
        <View style={[styles.circleCut, { top: -10, left: '50%', marginLeft: -10 }]} />
        <View style={[styles.circleCut, { bottom: -10, left: '50%', marginLeft: -10 }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header - with notification button */}
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={[styles.headerTitle, textAlignment]}>{t('offers_title')}</Text>
            <Text style={[styles.headerSub, textAlignment]}>
                {t('welcome')}
            </Text>
          </View>
          
          {/* Notification Status Button */}
          <TouchableOpacity 
            style={styles.notificationStatusBtn}
            onPress={() => {
              Alert.alert(
                'حالة الإشعارات',
                notificationsEnabled 
                  ? 'الإشعارات مفعلة. ستتلقى إشعارات بالعروض الجديدة.' 
                  : 'الإشعارات غير مفعلة. قم بتفعيلها من إعدادات التطبيق.',
                [{ text: 'حسناً' }]
              );
            }}
          >
            <Bell size={20} color={notificationsEnabled ? COLORS.primary : COLORS.textSecondary} />
            <View style={[
              styles.notificationDot, 
              { backgroundColor: notificationsEnabled ? COLORS.primary : COLORS.textSecondary }
            ]} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={OFFERS}
        renderItem={renderOfferItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {/* 👈 Loading Overlay Component */}
      <LoadingOverlay visible={loading} type="processing" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  headerContainer: { 
    padding: 20, 
    paddingTop: 60, 
    paddingBottom: 10 
  },
  
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: COLORS.textPrimary 
  },
  
  headerSub: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    marginTop: 5 
  },

  notificationStatusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.background,
  },

  listContent: { padding: 20 },

  couponCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    height: 140,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1, 
    borderColor: COLORS.border 
  },

  leftPart: {
    width: 80,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16, 
    borderBottomRightRadius: 16,
  },
  
  iconCircle: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  
  rightPart: {
    flex: 1,
    padding: 16,
    paddingLeft: 24, 
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },

  offerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: COLORS.textPrimary, 
    marginBottom: 4 
  },
  
  offerDesc: { 
    fontSize: 12, 
    color: COLORS.textSecondary, 
    marginBottom: 10 
  },
  
  validityBox: { 
    alignItems: 'center', 
    marginTop: 5 
  },
  
  validityText: { 
    fontSize: 10, 
    color: COLORS.textSecondary, 
    marginStart: 4 
  },

  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    alignSelf: 'flex-end',
    marginTop: -20
  },
  
  codeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4
  },

  circleCut: {
    position: 'absolute',
    width: 20, 
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    zIndex: 2
  }
});