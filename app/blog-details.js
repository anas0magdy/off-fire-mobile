import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Calendar, Clock } from 'lucide-react-native';
import { COLORS, BLOG_POSTS } from '../constants/data';

export default function BlogDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const post = BLOG_POSTS.find(p => p.id == id);
  if (!post) return <View style={styles.container}><Text style={{color:'white', margin:20}}>المقال غير موجود</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.imageHeader}>
        <Image source={post.image} style={styles.image} />
        <View style={styles.overlay} />
        {/* زر الرجوع يمين */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowRight size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metaRow}>
            <View style={styles.metaItem}>
                <Calendar size={16} color={COLORS.primary} />
                <Text style={styles.metaText}>{post.date}</Text>
            </View>
            <View style={styles.metaItem}>
                <Clock size={16} color={COLORS.cta} />
                <Text style={styles.metaText}>3 دقائق قراءة</Text>
            </View>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.divider} />
        <Text style={styles.body}>{post.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  imageHeader: { height: 300, position: 'relative', width: '100%' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  // زر الرجوع يمين
  backBtn: { position: 'absolute', top: 50, right: 20, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  // Padding زيادة للتاريخ
  content: { flexGrow: 1, padding: 25, paddingTop: 40, marginTop: -40, backgroundColor: COLORS.dark, borderTopLeftRadius: 35, borderTopRightRadius: 35, minHeight: 500 },
  metaRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { color: COLORS.subText, fontSize: 13, fontWeight: '500' },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'left', lineHeight: 36 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 25 },
  body: { color: COLORS.text, fontSize: 16, lineHeight: 30, textAlign: 'left' },
});