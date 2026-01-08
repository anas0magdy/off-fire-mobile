import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_REQUESTS_KEY = '@offline_requests';

export const OfflineStorage = {
  // حفظ الطلب في وضع Offline
  saveOfflineRequest: async (requestData) => {
    try {
      const existingRequests = await AsyncStorage.getItem(OFFLINE_REQUESTS_KEY);
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      
      const newRequest = {
        ...requestData,
        id: Date.now(), // ID مؤقت
        createdAt: new Date().toISOString(),
        status: 'offline_pending'
      };
      
      requests.push(newRequest);
      await AsyncStorage.setItem(OFFLINE_REQUESTS_KEY, JSON.stringify(requests));
      
      return { success: true, id: newRequest.id };
    } catch (error) {
      console.error('Error saving offline request:', error);
      return { success: false, error };
    }
  },

  // جلب جميع الطلبات المخزنة محلياً
  getOfflineRequests: async () => {
    try {
      const requests = await AsyncStorage.getItem(OFFLINE_REQUESTS_KEY);
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error('Error getting offline requests:', error);
      return [];
    }
  },

  // حذف طلب بعد إرساله بنجاح
  removeOfflineRequest: async (requestId) => {
    try {
      const requests = await AsyncStorage.getItem(OFFLINE_REQUESTS_KEY);
      if (!requests) return { success: true };
      
      const parsedRequests = JSON.parse(requests);
      const filteredRequests = parsedRequests.filter(req => req.id !== requestId);
      
      await AsyncStorage.setItem(OFFLINE_REQUESTS_KEY, JSON.stringify(filteredRequests));
      return { success: true };
    } catch (error) {
      console.error('Error removing offline request:', error);
      return { success: false, error };
    }
  },

  // مسح جميع الطلبات المخزنة
  clearAllOfflineRequests: async () => {
    try {
      await AsyncStorage.removeItem(OFFLINE_REQUESTS_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error clearing offline requests:', error);
      return { success: false, error };
    }
  }
};

export const syncOfflineRequests = async (supabase) => {
  try {
    const requests = await OfflineStorage.getOfflineRequests();
    const successfulSyncs = [];

    for (const request of requests) {
      try {
        const { data, error } = await supabase.from('orders').insert([{
          client_name: request.client_name,
          phone: request.phone,
          service_id: request.service_id,
          service_name: request.service_name,
          building_type: request.building_type,
          notes: request.notes,
          file_url: request.file_url,
          status: 'pending',
          synced_at: new Date().toISOString(),
          was_offline: true
        }]).select();

        if (!error && data) {
          await OfflineStorage.removeOfflineRequest(request.id);
          successfulSyncs.push(request.id);
        }
      } catch (syncError) {
        console.error('Sync error for request:', request.id, syncError);
      }
    }

    return {
      total: requests.length,
      synced: successfulSyncs.length,
      failed: requests.length - successfulSyncs.length
    };
  } catch (error) {
    console.error('Error syncing offline requests:', error);
    return { total: 0, synced: 0, failed: 0, error };
  }
};