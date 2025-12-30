import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

// باليت الألوان الاحترافية (Midnight Industrial)
export const COLORS = {
  // الألوان الأساسية
  primary: "#f59e0b",      // Amber 500 (ذهبي - للتركيز والأزرار الرئيسية)
  primaryDim: "rgba(245, 158, 11, 0.15)", // خلفية شفافة للذهبي
  secondary: "#3b82f6",    // Blue 500 (للروابط والأيقونات الثانوية)
  
  // الخلفيات (Dark Mode Deep)
  background: "#0f172a",   // Slate 900 (الخلفية الرئيسية)
  backgroundDarker: "#020617", // Slate 950 (للتدرجات العميقة)
  
  // الكروت والأسطح
  surface: "#1e293b",      // Slate 800 (لون الكروت)
  surfaceLight: "#334155", // Slate 700 (للعناصر النشطة)
  
  // النصوص
  textPrimary: "#f8fafc",  // Slate 50 (أبيض ناصع للعناوين)
  textSecondary: "#94a3b8", // Slate 400 (رمادي للنصوص الفرعية)
  textTertiary: "#64748b", // Slate 500 (للتفاصيل غير المهمة)
  
  // الحالات
  success: "#10b981",      // Emerald 500
  error: "#ef4444",        // Red 500
  warning: "#f59e0b",      // Amber 500
  info: "#3b82f6",         // Blue 500
  
  // الحدود والشفافية
  border: "rgba(255, 255, 255, 0.08)", // حدود خفيفة جداً
  white: "#FFFFFF",
  transparent: "transparent",
};

// المقاسات الموحدة
export const SIZES = {
  // الهوامش والمسافات
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 24,
  extraLarge: 32,
  
  // نصف القطر (Radius)
  radius_sm: 8,
  radius_md: 16,
  radius_lg: 24,
  radius_xl: 30,
  
  // الشاشة
  width,
  height,
};

// الظلال الموحدة (لإعطاء عمق)
export const SHADOWS = {
  light: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
};

const appTheme = { COLORS, SIZES, SHADOWS };

export default appTheme;