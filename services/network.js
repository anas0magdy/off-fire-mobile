import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, isInternetReachable };
};

export const checkNetworkConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      connectionType: state.type,
      details: state.details
    };
  } catch (error) {
    console.error('Network check error:', error);
    return { isConnected: false, isInternetReachable: false };
  }
};

export const NetworkUtils = {
  isOnline: async () => {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  },
  
  getConnectionInfo: async () => {
    return await NetInfo.fetch();
  }
};