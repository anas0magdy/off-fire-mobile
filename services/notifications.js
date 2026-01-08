import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';
import { supabase } from './supabase';

// إعدادات التنبيه
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// إنشاء القنوات
const createNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'التنبيهات العامة',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#f59e0b',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });

      await Notifications.setNotificationChannelAsync('admin_alerts', {
        name: 'تنبيهات الإدارة',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 500, 500, 500],
        lightColor: '#ef4444',
        sound: 'default',
        showBadge: true,
      });
    } catch (error) {
      console.error('Error creating notification channels:', error);
    }
  }
};

// جلب التوكن من Expo
export const getExpoPushToken = async () => {
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;
    
    const tokenObject = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });
    return tokenObject.data;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// طلب الصلاحيات
export const requestNotificationPermissions = async () => {
  try {
    if (!Device.isDevice) return false;

    await createNotificationChannels();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true, allowAnnouncements: true },
      });
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return false;

    const token = await getExpoPushToken();
    
    await AsyncStorage.setItem('@notifications_enabled', 'true');
    if (token) await AsyncStorage.setItem('@notification_token', token);
    
    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

// جلب توكن الأدمن من قاعدة البيانات
const getAdminTokenFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('admin_token')
      .eq('id', 1)
      .single();

    if (error || !data?.admin_token) return null;
    return data.admin_token;
  } catch (err) {
    return null;
  }
};

// إرسال إشعار محلي
export const sendLocalNotification = async (title, body, data = {}, channelId = 'default') => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { ...data, timestamp: new Date().toISOString() },
        sound: 'default',
        channelId,
      },
      trigger: null,
    });
    return true;
  } catch (error) {
    return false;
  }
};

// إرسال إشعار Remote للأدمن
export const sendRemotePushNotification = async (targetToken, title, body, data = {}) => {
  if (!targetToken) return;

  const message = {
    to: targetToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
    channelId: 'admin_alerts',
    priority: 'high',
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Remote Send Error:", error);
  }
};

// === الدوال الرئيسية ===

export const sendNewOrderNotification = async (orderId, clientName, serviceName = '') => {
  // 1. جلب التوكن والإرسال للأدمن
  const adminToken = await getAdminTokenFromDB();
  if (adminToken) {
    await sendRemotePushNotification(
      adminToken,
      '🚨 طلب جديد وصل!', 
      `العميل: ${clientName}\nالخدمة: ${serviceName || 'عام'}\nرقم الطلب: #${orderId}`,
      { type: 'new_order', orderId: orderId, screen: 'admin_orders' }
    );
  }

  // 2. إشعار العميل
  await sendLocalNotification(
    '✅ تم استلام طلبك',
    `تم تسجيل طلبك رقم #${orderId} بنجاح، سيتم مراجعته والتواصل معك قريباً.`,
    { type: 'order_success', orderId: orderId },
    'default'
  );
};

export const sendOfferNotification = async (offerTitle, offerDesc, offerCode) => {
  return await sendLocalNotification(
    `🎁 ${t('off_20_title') || offerTitle}`,
    `${offerDesc || ''} ${offerCode ? `الكود: ${offerCode}` : ''}`.trim(),
    { type: 'offer', code: offerCode, screen: 'offers' },
    'default'
  );
};

export const sendServiceReminder = async (serviceName, message = '') => {
  const defaultMessage = t('hero_cta_primary') || 'اطلب عرض سعر مجاني الآن';
  return await sendLocalNotification(
    '🔔 تذكير',
    `${serviceName || ''} ${message || defaultMessage}`.trim(),
    { type: 'reminder', screen: 'services' },
    'default'
  );
};

// الجدولة
export const scheduleDailyReminder = async (hour = 10, minute = 0) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💡 ' + (t('hero_subheadline') || 'دليلك الرقمي الذكي'),
        body: t('hero_hook') || 'وفّر عناء البحث واحصل على عروض أسعار',
        data: { screen: 'home' },
        sound: 'default',
      },
      trigger: { type: 'calendar', hour: Number(hour), minute: Number(minute), repeats: true },
    });
    return true;
  } catch (error) { return false; }
};

export const scheduleWeeklyServiceReminder = async (serviceName, weekday = 1, hour = 14, minute = 0) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ صيانة دورية',
        body: `هل حان وقت صيانة ${serviceName}؟`,
        data: { screen: 'services' },
        sound: 'default',
      },
      trigger: { type: 'calendar', weekday: Number(weekday), hour: Number(hour), minute: Number(minute), repeats: true },
    });
    return true;
  } catch (error) { return false; }
};

export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const checkNotificationStatus = async () => {
  const enabled = await AsyncStorage.getItem('@notifications_enabled') === 'true';
  const token = await AsyncStorage.getItem('@notification_token');
  const permissions = await Notifications.getPermissionsAsync();
  return { enabled, token, permissions, channels: Platform.OS === 'android' ? 'created' : 'not_needed' };
};

export const setupNotificationListeners = (navigation) => {
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (navigation && data.screen) {
      setTimeout(() => {
          switch (data.screen) {
            case 'offers': navigation.navigate('(tabs)', { screen: 'offers' }); break;
            case 'services': navigation.navigate('(tabs)', { screen: 'services' }); break;
            case 'home': navigation.navigate('(tabs)', { screen: 'index' }); break;
          }
      }, 500);
    }
  });
  return () => Notifications.removeNotificationSubscription(responseListener);
};

export const initializeNotifications = async (navigation) => {
  const granted = await requestNotificationPermissions();
  if (granted) {
    const cleanup = setupNotificationListeners(navigation);
    const scheduled = await AsyncStorage.getItem('@notifications_scheduled');
    if (scheduled !== 'true') {
        await cancelAllScheduledNotifications();
        await scheduleDailyReminder(10, 0);
        await scheduleWeeklyServiceReminder(t('srv_1_title') || 'مكافحة الحريق', 2, 14, 0);
        await AsyncStorage.setItem('@notifications_scheduled', 'true');
    }
    return cleanup;
  }
  return false;
};