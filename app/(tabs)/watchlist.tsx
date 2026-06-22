import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { getPosterUrl } from "@/services/tmdb";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Colors } from "@/constants/Colors";

interface WatchlistItem {
  docId: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  rating: number;
  releaseDate: string;
  addedAt: number;
}

export default function WatchlistScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "watchlists"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: WatchlistItem[] = snapshot.docs.map((d) => ({ docId: d.id, ...(d.data() as Omit<WatchlistItem, "docId">) }));
      data.sort((a, b) => b.addedAt - a.addedAt);
      setItems(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, [user]);

  const handleRemove = (docId: string, title: string) => {
    Alert.alert("Hapus dari Watchlist", `Hapus "${title}"?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: async () => {
        try { await deleteDoc(doc(db, "watchlists", docId)); }
        catch { Alert.alert("Error", "Gagal menghapus."); }
      }},
    ]);
  };

  if (loading) return <LoadingSpinner message="Memuat watchlist..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>🔖 Watchlist Saya</Text>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Watchlist kosong</Text>
            <Text style={styles.emptySubtitle}>Buka detail film dan tekan + untuk menambahkan.</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => router.push("/(tabs)")}>
              <Text style={styles.browseBtnText}>Jelajahi Film</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items} keyExtractor={(item) => item.docId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListHeaderComponent={<Text style={styles.count}>{items.length} film tersimpan</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/movie/${item.movieId}`)} activeOpacity={0.8}>
                {getPosterUrl(item.posterPath) ? (
                  <Image source={{ uri: getPosterUrl(item.posterPath)! }} style={styles.poster} />
                ) : (
                  <View style={[styles.poster, styles.noPoster]} />
                )}
                <View style={styles.info}>
                  <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.meta}>⭐ {item.rating.toFixed(1)} · {item.releaseDate?.slice(0, 4)}</Text>
                  <Text style={styles.addedAt}>Ditambahkan: {new Date(item.addedAt).toLocaleDateString("id-ID")}</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.docId, item.title)}>
                  <Text style={styles.removeText}>🗑</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  title: { color: Colors.text, fontSize: 22, fontWeight: "800", marginBottom: 16 },
  count: { color: Colors.textMuted, fontSize: 13, marginBottom: 12 },
  card: { flexDirection: "row", backgroundColor: Colors.surface, borderRadius: 10, marginBottom: 12, overflow: "hidden", alignItems: "center" },
  poster: { width: 70, height: 100, resizeMode: "cover" },
  noPoster: { backgroundColor: Colors.surfaceLight },
  info: { flex: 1, padding: 12, gap: 4 },
  movieTitle: { color: Colors.text, fontSize: 14, fontWeight: "700" },
  meta: { color: Colors.gold, fontSize: 12 },
  addedAt: { color: Colors.textDim, fontSize: 11, marginTop: 4 },
  removeBtn: { paddingRight: 14, paddingLeft: 8 },
  removeText: { fontSize: 20 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, paddingBottom: 80 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: "700" },
  emptySubtitle: { color: Colors.textMuted, fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  browseBtn: { marginTop: 8, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseBtnText: { color: Colors.text, fontWeight: "700", fontSize: 14 },
});