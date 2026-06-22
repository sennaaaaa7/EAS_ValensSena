import LoadingSpinner from "@/components/LoadingSpinner";
import MovieCard from "@/components/MovieCard";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { fetchPopularMovies, fetchTrendingMovies, Movie } from "@/services/tmdb";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [popular, setPopular] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    try {
      setError(null);
      const [popularData, trendingData] = await Promise.all([
        fetchPopularMovies(1),
        fetchTrendingMovies(),
      ]);
      setPopular(popularData);
      setTrending(trendingData.slice(0, 6));
    } catch {
      setError("Gagal memuat film. Periksa koneksi internet kamu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadMovies(); }, [loadMovies]);

  const handleLogout = async () => {
    if (window.confirm("Yakin ingin keluar?")) {
      await logout();
      router.replace("/auth/login");
    }
  };

  if (loading) return <LoadingSpinner message="Memuat film..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadMovies(); }}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>🎬 MovieVault</Text>
            <Text style={styles.greeting}>Halo, {user?.email?.split("@")[0]} 👋</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadMovies}>
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Hari Ini</Text>
          <FlatList
            data={trending}
            horizontal
            keyExtractor={(item) => `trend-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => <MovieCard movie={item} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Film Populer</Text>
          <View style={styles.grid}>
            {popular.map((movie) => <MovieCard key={`pop-${movie.id}`} movie={movie} />)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16, paddingVertical: 16,
  },
  appName: { fontSize: 22, fontWeight: "800", color: Colors.primary },
  greeting: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  logoutBtn: {
    backgroundColor: Colors.surface, paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
  },
  logoutText: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: Colors.text, fontSize: 17, fontWeight: "700",
    marginBottom: 12, paddingHorizontal: 16,
  },
  horizontalList: { paddingHorizontal: 16, gap: 12 },
  grid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 16, gap: 16, justifyContent: "space-between",
  },
  errorBox: {
    margin: 16, backgroundColor: "#3B1111",
    padding: 14, borderRadius: 8, alignItems: "center", gap: 8,
  },
  errorText: { color: Colors.error, fontSize: 14, textAlign: "center" },
  retryText: { color: Colors.primary, fontWeight: "700" },
});