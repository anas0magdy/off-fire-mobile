import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ticket, Copy } from 'lucide-react-native';
import { COLORS, OFFERS } from '../../constants/data';
import MainButton from '../../components/MainButton';

export default function OffersScreen() {
  const router = useRouter();

  const renderOfferItem = ({ item }) => (
    <View style={styles.ticketContainer}>
      {/* الجزء العلوي (التفاصيل) */}
      <View style={styles.ticketMain}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>عرض حصري 🔥</Text>
        </View>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDesc}>{item.desc}</Text>
      </View>

      {/* الخط الفاصل (Dashed Line) */}
      <View style={styles.dashedContainer}>
        <View style={styles.circleLeft} />
        <View style={styles.dashLine} />
        <View style={styles.circleRight} />
      </View>

      {/* الجزء السفلي (الكود والزرار) */}
      <View style={styles.ticketFooter}>
        <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>كود الخصم:</Text>
            <View style={styles.codeBox}>
                <Text style={styles.codeText}>{item.code}</Text>
                <Copy size={14} color={COLORS.subText} />
            </View>
        </View>
        
        <MainButton 
            title="استخدم العرض" 
            onPress={() => router.push('/quote')}
            style={{ marginTop: 15 }}
            icon={false} // مش لازم سهم هنا
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>العروض والخصومات</Text>
        <Text style={styles.headerSubtitle}>استفد من خصومات حصرية لعملائنا</Text>
      </View>

      <FlatList
        data={OFFERS}
        renderItem={renderOfferItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  
  header: { padding: 20, paddingTop: 60 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'left' },
  headerSubtitle: { color: COLORS.subText, fontSize: 16, textAlign: 'left' },
  
  ticketContainer: { marginBottom: 25, backgroundColor: COLORS.card, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  
  ticketMain: { padding: 24, paddingBottom: 10 },
  badge: { backgroundColor: 'rgba(249, 115, 22, 0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
  badgeText: { color: COLORS.cta, fontSize: 12, fontWeight: 'bold' },
  offerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'left' },
  offerDesc: { color: COLORS.subText, fontSize: 15, textAlign: 'left', lineHeight: 22 },
  
  dashedContainer: { height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  circleLeft: { width: 30, height: 30, backgroundColor: COLORS.dark, borderRadius: 15, marginLeft: -15 },
  dashLine: { flex: 1, height: 1, borderWidth: 1, borderColor: '#333', borderStyle: 'dashed', borderRadius: 1 },
  circleRight: { width: 30, height: 30, backgroundColor: COLORS.dark, borderRadius: 15, marginRight: -15 },
  
  ticketFooter: { padding: 24, paddingTop: 10, backgroundColor: 'rgba(0,0,0,0.2)' },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  codeLabel: { color: COLORS.subText, fontSize: 14 },
  codeBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  codeText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
});