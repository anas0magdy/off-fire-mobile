// D:\WEB\OffFireProject\off-fire-mobile\services\errorHandler.js
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { t } from 'i18next';

class ErrorHandler {
  constructor() {
    this.errorLogs = [];
    this.maxLogs = 100;
  }

  // Handle different types of errors
  async handle(error, context = '', options = {}) {
    const { showAlert = true, logToStorage = true } = options;
    
    // Log error to console
    console.error(`[${new Date().toISOString()}] Error in ${context}:`, error);
    
    // Add to memory logs
    this.addToLogs({
      timestamp: new Date().toISOString(),
      context,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name,
      },
      userInfo: await this.getUserInfo(),
    });

    // Save to storage if enabled
    if (logToStorage) {
      await this.saveErrorToStorage(error, context);
    }

    // Show appropriate alert to user
    if (showAlert) {
      this.showUserFriendlyAlert(error, context);
    }

    // Return error information for debugging
    return {
      handled: true,
      type: this.getErrorType(error),
      context,
      timestamp: new Date().toISOString(),
    };
  }

  // Categorize error types
  getErrorType(error) {
    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toLowerCase() || '';

    if (message.includes('network') || message.includes('offline') || message.includes('internet')) {
      return 'NETWORK_ERROR';
    }
    
    if (message.includes('supabase') || message.includes('database') || message.includes('server')) {
      return 'SERVER_ERROR';
    }
    
    if (message.includes('auth') || message.includes('login') || message.includes('permission')) {
      return 'AUTH_ERROR';
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'VALIDATION_ERROR';
    }
    
    if (message.includes('storage') || message.includes('file') || message.includes('upload')) {
      return 'STORAGE_ERROR';
    }
    
    if (message.includes('timeout') || message.includes('time out')) {
      return 'TIMEOUT_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  // Show user-friendly alert based on error type
  showUserFriendlyAlert(error, context = '') {
    const errorType = this.getErrorType(error);
    const isArabic = t('language') === 'ar';

    switch (errorType) {
      case 'NETWORK_ERROR':
        Alert.alert(
          t('error_network_title') || 'خطأ في الاتصال',
          t('error_network_message') || 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى',
          [{ text: t('ok') || 'حسناً' }]
        );
        break;

      case 'SERVER_ERROR':
        Alert.alert(
          t('error_server_title') || 'خطأ في الخادم',
          t('error_server_message') || 'حدث خطأ تقني. الرجاء المحاولة لاحقاً',
          [
            { text: t('retry') || 'إعادة المحاولة', style: 'default' },
            { text: t('cancel') || 'إلغاء', style: 'cancel' }
          ]
        );
        break;

      case 'AUTH_ERROR':
        Alert.alert(
          t('error_auth_title') || 'خطأ في المصادقة',
          t('error_auth_message') || 'يجب تسجيل الدخول للمتابعة',
          [
            { text: t('login') || 'تسجيل الدخول', style: 'default' },
            { text: t('cancel') || 'إلغاء', style: 'cancel' }
          ]
        );
        break;

      case 'VALIDATION_ERROR':
        Alert.alert(
          t('error_validation_title') || 'خطأ في البيانات',
          error.message || (t('error_validation_message') || 'الرجاء مراجعة البيانات المدخلة'),
          [{ text: t('ok') || 'حسناً' }]
        );
        break;

      case 'STORAGE_ERROR':
        Alert.alert(
          t('error_storage_title') || 'خطأ في التخزين',
          t('error_storage_message') || 'تعذر حفظ الملف. تأكد من صلاحيات التخزين',
          [{ text: t('ok') || 'حسناً' }]
        );
        break;

      case 'TIMEOUT_ERROR':
        Alert.alert(
          t('error_timeout_title') || 'انتهى الوقت',
          t('error_timeout_message') || 'انتهت مدة الاتصال. حاول مرة أخرى',
          [{ text: t('retry') || 'إعادة المحاولة' }]
        );
        break;

      default:
        Alert.alert(
          t('error_general_title') || 'حدث خطأ',
          t('error_general_message') || 'عذراً، حدث خطأ غير متوقع. سيتم إصلاحه قريباً',
          [{ text: t('ok') || 'حسناً' }]
        );
        break;
    }
  }

  // Add error to in-memory logs
  addToLogs(errorInfo) {
    this.errorLogs.unshift(errorInfo);
    
    // Keep only last N logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLogs);
    }
  }

  // Save error to AsyncStorage for persistence
  async saveErrorToStorage(error, context) {
    try {
      const errors = await AsyncStorage.getItem('@app_errors');
      const parsedErrors = errors ? JSON.parse(errors) : [];
      
      const errorEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        context,
        error: {
          message: error.message,
          stack: error.stack?.substring(0, 500), // Limit stack trace length
          code: error.code,
        },
        appState: await this.getAppState(),
      };

      parsedErrors.unshift(errorEntry);
      
      // Keep only last 50 errors
      if (parsedErrors.length > 50) {
        parsedErrors.splice(50);
      }

      await AsyncStorage.setItem('@app_errors', JSON.stringify(parsedErrors));
    } catch (storageError) {
      console.error('Failed to save error to storage:', storageError);
    }
  }

  // Get user info for error context
  async getUserInfo() {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      const language = await AsyncStorage.getItem('@language');
      
      return {
        userId: userId || 'guest',
        language: language || 'ar',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return { error: 'Failed to get user info' };
    }
  }

  // Get app state info
  async getAppState() {
    try {
      const networkState = await NetInfo.fetch();
      
      return {
        isConnected: networkState.isConnected,
        isInternetReachable: networkState.isInternetReachable,
        connectionType: networkState.type,
        appVersion: '1.0.0',
        platform: Platform.OS,
      };
    } catch (error) {
      return { error: 'Failed to get app state' };
    }
  }

  // Get all error logs
  getErrorLogs() {
    return [...this.errorLogs];
  }

  // Clear all error logs
  clearErrorLogs() {
    this.errorLogs = [];
    AsyncStorage.removeItem('@app_errors');
  }

  // Network error checker
  async checkNetworkAndThrow() {
    const networkState = await NetInfo.fetch();
    
    if (!networkState.isConnected || !networkState.isInternetReachable) {
      throw new Error('NETWORK_ERROR: No internet connection');
    }
    
    return true;
  }

  // Supabase error handler
  handleSupabaseError(error, operation = '') {
    let userMessage = '';
    
    switch (error.code) {
      case '23505': // Unique violation
        userMessage = t('error_supabase_unique') || 'هذا السجل موجود بالفعل';
        break;
      case '23503': // Foreign key violation
        userMessage = t('error_supabase_foreign') || 'لا يمكن حذف هذا السجل لأنه مرتبط بسجلات أخرى';
        break;
      case '42501': // Insufficient privilege
        userMessage = t('error_supabase_privilege') || 'ليس لديك صلاحية للقيام بهذه العملية';
        break;
      case 'PGRST116': // Resource not found
        userMessage = t('error_supabase_not_found') || 'لم يتم العثور على المورد المطلوب';
        break;
      default:
        userMessage = t('error_supabase_general') || 'حدث خطأ في قاعدة البيانات';
    }
    
    return {
      originalError: error,
      userMessage,
      operation,
      handled: true,
    };
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions
export const handleError = (error, context = '', options = {}) => {
  return errorHandler.handle(error, context, options);
};

export const handleSupabaseError = (error, operation = '') => {
  return errorHandler.handleSupabaseError(error, operation);
};

export const checkNetwork = () => {
  return errorHandler.checkNetworkAndThrow();
};

// Error Boundary Component (for React)
export const withErrorBoundary = (WrappedComponent, errorContext = '') => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      errorHandler.handle(error, `${errorContext} - ErrorBoundary`, {
        showAlert: false,
        logToStorage: true,
      });
      
      console.error('ErrorBoundary caught error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ color: '#ef4444', fontSize: 16, textAlign: 'center' }}>
              {t('error_boundary_message') || 'حدث خطأ في هذه الشاشة. الرجاء إعادة فتح التطبيق.'}
            </Text>
          </View>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};