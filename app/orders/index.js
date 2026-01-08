import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  StatusBar, RefreshControl 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, FileText, ChevronLeft, Calendar } from 'lucide-react-native';
import { useTranslation } from 'react-i18next'; 
import { COLORS } from '../../constants/theme';
import { AuthService } from '../../services/auth';
import { supabase } from '../../services/supabase';
import { LoadingOverlay } from '../../components/LoadingOverlay'; // 👈 1. استدعاء المكون الجديد

export default function OrdersListScreen() {
  const router = useRouter();
  const { t } = useTranslation(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null); 

  // جلب البيانات عند التركيز على الشاشة
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // ✅ Real-time Subscription (الكود الأصلي زي ما هو)
  useEffect(() => {
    let subscription;

    const setupRealtime = async () => {
      const user = await AuthService.getCurrentProfile();
      if (!user) return;
      setUserId(user.id);

      subscription = supabase
        .channel('public:orders')
        .on(
          'postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'orders', 
            filter: `user_id=eq.${user.id}` 
          }, 
          (payload) => {
            fetchOrders(); 
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const user = await AuthService.getCurrentProfile();
      if (!user) {
        setLoading(false);
        return; 
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return COLORS.warning;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t('status_pending');
      case 'completed': return t('status_completed');
      case 'cancelled': return t('status_cancelled');
      default: return status;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => router.push(`/order-details/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
           <View style={styles.iconBox}>
             <FileText size={20} color={COLORS.primary} />
           </View>
           <View>
             <Text style={styles.serviceName}>{item.service_name}</Text>
             <Text style={styles.orderRef}>#{item.id}</Text>
           </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.dateRow}>
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={styles.dateText}>
            {item.created_at ? item.created_at.split('T')[0].split('-').reverse().join('/') : ''}
          </Text>
        </View>
        <ChevronLeft size={18} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('my_orders_title')}</Text>
        <View style={{width: 40}} /> 
      </View>

      {/* 👈 التعديل هنا:
         شيلنا شرط (loading ? ActivityIndicator : FlatList)
         وخلينا الـ FlatList تظهر علطول، والـ Overlay يغطي عليها لو فيه تحميل
      */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FileText size={50} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>{t('no_orders_list')}</Text>
            <TouchableOpacity style={styles.newOrderBtn} onPress={() => router.push('/quote')}>
              <Text style={styles.newOrderBtnText}>{t('create_new_order')}</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} tintColor={COLORS.primary} />
        }
      />

      {/* 👈 2. وضعنا المكون هنا في النهاية عشان يظهر فوق الكل */}
      <LoadingOverlay visible={loading} type="fetching" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  // center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // شيلنا الستايل ده لأنه مبقاش مستخدم
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },

  listContent: { padding: 20 },
  
  orderCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  serviceInfo: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', alignItems: 'center', justifyContent: 'center' },
  serviceName: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  orderRef: { color: COLORS.textSecondary, fontSize: 12 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dateText: { color: COLORS.textSecondary, fontSize: 13, minWidth: 80 }, 

  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSecondary, fontSize: 16, marginTop: 10, marginBottom: 20 },
  newOrderBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  newOrderBtnText: { color: COLORS.white, fontWeight: 'bold' }
});