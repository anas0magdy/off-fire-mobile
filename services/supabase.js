import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // إصلاح لمشاكل الروابط في الأندرويد
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👇 1. حط رابط المشروع هنا (Project URL)
const supabaseUrl = 'https://bvnsvbdefluhegdllpom.supabase.co'; 

// 👇 2. حط مفتاح الـ anon public هنا
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bnN2YmRlZmx1aGVnZGxscG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTEyNTMsImV4cCI6MjA4MjY4NzI1M30.U3_SoQLk_0LYJspf7QsFXYFS3eH3TC_FFurkJfWYgMs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});