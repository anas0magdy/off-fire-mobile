import { supabase } from './supabase';
import { getExpoPushToken } from './notifications'; 

// إيميل الأدمن
const ADMIN_EMAIL = 'anas0abollale@gmail.com'; 

// دالة التحديث الصامت (Silent Sync)
const _syncTokenIfAdmin = async (email) => {
  try {
    if (!email) return;
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanAdminEmail = ADMIN_EMAIL.trim().toLowerCase();

    if (cleanEmail === cleanAdminEmail) {
      const token = await getExpoPushToken();
      
      if (token) {
        // تحديث قاعدة البيانات بصمت
        await supabase
          .from('app_settings')
          .update({ admin_token: token })
          .eq('id', 1);
      }
    }
  } catch (error) {
    // في الـ Production لا نظهر Alerts للمستخدم، فقط نسجل الخطأ في الخلفية
    console.error("Silent Sync Error:", error);
  }
};

export const AuthService = {
  // تسجيل حساب جديد
  signUp: async ({ email, password, full_name, facility_name, facility_type, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, facility_name, facility_type, phone }
      }
    });

    if (error) throw error;
    if (data?.user?.email) {
        // تشغيل التحديث في الخلفية بدون انتظار (Fire and Forget)
        _syncTokenIfAdmin(data.user.email);
    }
    return data;
  },

  // تسجيل الدخول
  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data?.user?.email) {
        // تشغيل التحديث وانتظاره للتأكد من إتمامه قبل الانتقال
        await _syncTokenIfAdmin(data.user.email);
    }

    return data;
  },

  // تسجيل الخروج
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // جلب البروفايل الحالي
  getCurrentProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // تحديث التوكن عند كل فتحة تطبيق لضمان المزامنة
    _syncTokenIfAdmin(user.email);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) return null;
    return { ...data, email: user.email, id: user.id };
  },
  
  linkOrderToUser: async (orderId, userId) => {
    const id = parseInt(orderId);
    if (isNaN(id)) return;
    await supabase.from('orders').update({ user_id: userId }).eq('id', id); 
  },

  resetPasswordForEmail: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'offfire://profile/change-password', 
    });
    if (error) throw error;
  },

  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  }
};