import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Linking, Alert, I18nManager 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Download, FileText, Building, CheckCircle, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next'; 
import { COLORS } from '../../constants/theme';
import { supabase } from '../../services/supabase';
import { LoadingOverlay } from '../../components/LoadingOverlay'; // 👈 1. استدعاء المكون

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation(); 
  const [order, setOrder] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // ده للعمليات زي قبول العرض

  const isRTL = I18nManager.isRTL;
  const textAlignStyle = { textAlign: isRTL ? 'right' : 'left' };

  useEffect(() => {
    fetchOrderDetails();

    const offersSubscription = supabase
      .channel(`public:offers:order_id=${id}`)
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'offers', filter: `order_id=eq.${id}` }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchOrderDetails(); 
        }
      )
      .subscribe();

    const orderSubscription = supabase
      .channel(`public:orders:id=${id}`)
      .on(
        'postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, 
        (payload) => {
            setOrder(prev => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(offersSubscription);
      supabase.removeChannel(orderSubscription);
    };
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders').select('*').eq('id', id).single();
      if (orderError) throw orderError;
      setOrder(orderData);

      const { data: offersData, error: offersError } = await supabase
        .from('offers').select('*').eq('order_id', id).order('created_at', { ascending: false });
      if (offersError) throw offersError;
      setOffers(offersData || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openPdf = async (url) => {
    if (!url) {
      Alert.alert(t('alert_title'), t('no_file_url'));
      return;
    }
    try {
      const cleanUrl = url.trim(); 
      const supported = await Linking.canOpenURL(cleanUrl);
      if (supported) {
        await Linking.openURL(cleanUrl);
      } else {
        Alert.alert(t('alert_title'), t('no_app_supported'));
      }
    } catch (error) {
      console.error("Linking Error:", error);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    Alert.alert(
      t('confirm_accept_title'),
      t('confirm_accept_msg'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('confirm'), 
          onPress: async () => {
            setActionLoading(true); // 👈 تشغيل التحميل
            try {
              const { error: offerError } = await supabase
                .from('offers').update({ status: 'accepted' }).eq('id', offerId);
              if (offerError) throw offerError;

              const { error: orderError } = await supabase
                .from('orders').update({ status: 'offer_accepted' }).eq('id', id);
              if (orderError) throw orderError;

              Alert.alert(t('success_title'), t('offer_accepted_success'));

            } catch (error) {
              console.error(error);
              Alert.alert(t('error_title'), t('accept_error_msg'));
            } finally {
              setActionLoading(false); // 👈 إيقاف التحميل
            }
          }
        }
      ]
    );
  };

  // 👈 2. شيلنا الـ if (loading) return ... عشان نعرض الهيكل وفوقه الـ Overlay
  
  if (!loading && !order) return <View style={styles.center}><Text style={{color: 'white'}}>{t('order_not_found')}</Text></View>;

  const isAnyOfferAccepted = offers.some(o => o.status === 'accepted');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <ArrowLeft size={24} color={COLORS.textPrimary} style={{ transform: [{ scaleX: isRTL ? 1 : -1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('order_details')} {id}</Text>
        <View style={{width: 40}} /> 
      </View>

      {/* لو لسه بيحمل، ممكن نعرض view فاضي أو Skeleton، بس هنا هنسيبه فاضي والـ Overlay شغال */}
      {order && (
        <ScrollView contentContainerStyle={styles.content}>
          
          <View style={styles.statusBanner}>
              {order.status === 'offer_accepted' ? (
                  <>
                      <CheckCircle size={20} color={COLORS.success} />
                      <Text style={[styles.statusText, {color: COLORS.success}]}>{t('status_accepted')}</Text>
                  </>
              ) : (
                  <>
                      <Clock size={20} color={COLORS.warning} />
                      <Text style={[styles.statusText, {color: COLORS.warning}]}>{t('status_pending')}</Text>
                  </>
              )}
          </View>

          <Text style={[styles.sectionHeader, textAlignStyle]}>{t('offers_section_title')} ({offers.length})</Text>
          
          {offers.length > 0 ? (
            offers.map((offer) => {
              const isAccepted = offer.status === 'accepted';
              return (
                  <View key={offer.id} style={[styles.offerCard, isAccepted && styles.acceptedCard]}>
                      <View style={styles.offerHeader}>
                          <View style={styles.companyIcon}>
                              <Building size={24} color={COLORS.primary} />
                          </View>
                          <View style={{flex: 1}}>
                              <Text style={[styles.companyName, textAlignStyle]}>{offer.company_name}</Text>
                              <Text style={[styles.offerDate, textAlignStyle]}>{new Date(offer.created_at).toLocaleDateString()}</Text>
                          </View>
                      </View>
                      
                      {offer.price && <Text style={[styles.priceText, textAlignStyle]}>{t('approx_price')} {offer.price} {isRTL ? 'ر.س' : 'SAR'}</Text>}
                      {offer.description && <Text style={[styles.offerDesc, textAlignStyle]}>{offer.description}</Text>}

                      <TouchableOpacity style={styles.downloadBtn} onPress={() => openPdf(offer.pdf_url)}>
                          <FileText size={18} color={COLORS.textPrimary} />
                          <Text style={styles.downloadText}>{t('view_offer_file')}</Text>
                          <Download size={18} color={COLORS.textPrimary} />
                      </TouchableOpacity>

                      <View style={styles.actionsContainer}>
                          {isAccepted ? (
                              <View style={styles.acceptedBadge}>
                                  <CheckCircle size={18} color="white" />
                                  <Text style={styles.acceptedText}>{t('offer_accepted_badge')}</Text>
                              </View>
                          ) : (
                              !isAnyOfferAccepted && (
                                  <TouchableOpacity 
                                      style={styles.acceptBtn} 
                                      onPress={() => handleAcceptOffer(offer.id)}
                                      // disabled={actionLoading} // مش محتاجين disable لأن الـ Overlay بيمنع الضغط
                                  >
                                      <Text style={styles.acceptBtnText}>{t('accept_offer_btn')}</Text>
                                      <CheckCircle size={18} color="white" />
                                  </TouchableOpacity>
                              )
                          )}
                      </View>
                  </View>
              );
            })
          ) : (
            <View style={styles.emptyOffers}>
              <Text style={styles.emptyOffersText}>{t('no_offers_title')}</Text>
              <Text style={styles.emptyOffersSub}>{t('no_offers_sub')}</Text>
            </View>
          )}

        </ScrollView>
      )}

      {/* 👈 3. إضافة مكون التحميل في النهاية 
          هيظهر لو بنحمل البيانات (loading) أو بنعمل عملية (actionLoading)
      */}
      <LoadingOverlay visible={loading || actionLoading} type={actionLoading ? 'processing' : 'fetching'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  content: { padding: 20 },

  statusBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 15, backgroundColor: COLORS.surface, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  statusText: { fontSize: 16, fontWeight: 'bold' },

  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 16 },

  offerCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  acceptedCard: { borderColor: COLORS.success, borderWidth: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)' },
  
  offerHeader: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  companyIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)', alignItems: 'center', justifyContent: 'center' },
  companyName: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold' },
  offerDate: { color: COLORS.textSecondary, fontSize: 12 },
  
  priceText: { color: COLORS.success, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  offerDesc: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 16, lineHeight: 20 },
  
  downloadBtn: { backgroundColor: COLORS.surfaceLight, padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  downloadText: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 14 },

  actionsContainer: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 16 },
  acceptBtn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  acceptBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  
  acceptedBadge: { backgroundColor: COLORS.success, padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  acceptedText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  emptyOffers: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',     // 👈 دي أهم حاجة عشان ياخد مساحة الشاشة
      paddingHorizontal: 20, // 👈 ادي المساحة الجانبية للأب بدل النص
      marginTop: 50,     // (أو حسب ما أنت عامل)
  },  
  emptyOffersText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  emptyOffersSub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    
    // 👇 التعديلات هنا:
    width: '100%',     // عشان ياخد عرض الأب كله
    lineHeight: 22,    // عشان الحروف متبقاش لازقة
  },
});