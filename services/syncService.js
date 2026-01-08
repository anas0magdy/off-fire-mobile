import NetInfo from '@react-native-community/netinfo';
import { syncOfflineRequests } from './offlineStorage';
import { supabase } from './supabase';

let syncInterval = null;

export const startAutoSync = () => {
  // توقف عن أي Sync سابق
  if (syncInterval) clearInterval(syncInterval);

  // Sync كل 30 ثانية عند وجود اتصال
  syncInterval = setInterval(async () => {
    const state = await NetInfo.fetch();
    const isOnline = state.isConnected && state.isInternetReachable;

    if (isOnline) {
      try {
        const result = await syncOfflineRequests(supabase);
        if (result.synced > 0) {
          console.log(`تم مزامنة ${result.synced} طلب بنجاح`);
        }
      } catch (error) {
        console.error('Auto sync error:', error);
      }
    }
  }, 30000); // 30 ثانية

  return () => {
    if (syncInterval) clearInterval(syncInterval);
  };
};

export const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

// Sync فوري عند عودة الاتصال
export const setupConnectionListener = (onSyncComplete) => {
  return NetInfo.addEventListener(async (state) => {
    const isOnline = state.isConnected && state.isInternetReachable;
    
    if (isOnline) {
      try {
        const result = await syncOfflineRequests(supabase);
        if (onSyncComplete && result.synced > 0) {
          onSyncComplete(result);
        }
      } catch (error) {
        console.error('Connection restored sync error:', error);
      }
    }
  });
};