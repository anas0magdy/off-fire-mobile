import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SERVICES, SERVICES_INTRO } from '../../constants/data';

export default function ServicesScreen() {
  const router = useRouter();

  const renderServiceItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/service-details', params: { id: item.id } })}
      >
        <Image source={item.image} style={styles.cardImage} />
        <LinearGradient colors={['transparent', COLORS.darker]} style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={1}>{item.desc}</Text>
            <View style={styles.linkRow}>
                <Text style={styles.linkText}>التفاصيل</Text>
                <ArrowLeft size={14} color={COLORS.primary} />
            </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      
      {/* Header Updated with Full Content */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{SERVICES_INTRO.title}</Text>
        <Text style={styles.headerSubtitle}>{SERVICES_INTRO.subtitle}</Text>
        <Text style={styles.headerDesc}>{SERVICES_INTRO.desc}</Text>
      </View>

      <FlatList
        data={SERVICES}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2} 
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  
  header: { padding: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { color: COLORS.white, fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'left' },
  headerSubtitle: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginBottom: 15 },
  headerDesc: { color: COLORS.subText, fontSize: 14, textAlign: 'left', lineHeight: 24 },
  
  listContent: { padding: 15, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  
  card: { 
    width: '48%', 
    height: 240,
    marginBottom: 16, 
    borderRadius: 24, 
    overflow: 'hidden', 
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, paddingTop: 50 },
  
  cardTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', marginBottom: 4, textAlign: 'left' },
  cardDesc: { color: COLORS.subText, fontSize: 11, marginBottom: 10, textAlign: 'left' },
  
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  linkText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
});