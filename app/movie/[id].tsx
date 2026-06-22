import React, { useEffect, useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/hooks/useAuth";
import { fetchMovieDetail, getPosterUrl, MovieDetail } from "@/services/tmdb";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistDocId, setWatchlistDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovieDetail(Number(id))
      .then(setMovie)
      .catch(() => setError("Gagal memuat detail film."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    const check = async () => {
      const q = query(collection(db, "watchlists"), where("userId", "==", user.uid), where("movieId", "==", Number(id)));
      const snap = await getDocs(q);
      if (!snap.empty) { setInWatchlist(true); setWatchlistDocId(snap.docs[0].id); }
    };
    check();
  }, [user, id]);

  const handleToggleWatchlist = async () => {
    if (!user || !movie) return;
    setSaving(true);
    try {
      if (inWatchlist && watchlistDocId) {
        await deleteDoc(doc(db, "watchlists", watchlistDocId));
        setInWatchlist(false); setWatchlistDocId(null);
        Alert.alert("✅", `"${movie.title}" dihapus dari watchlist.`);
      } else {
        const newDoc = await addDoc(collection(db, "watchlists"), {
          userId: user.uid, movieId: movie.id, title: movie.title,
          posterPath: movie.poster_path, rating: movie.vote_average,
          releaseDate: movie.release_date, addedAt: Date.now(),
        });
        setInWatchlist(true); setWatchlistDocId(newDoc.id);
        Alert.alert("✅", `"${movie.title}" ditambahkan ke watchlist!`);
      }
    } catch { Alert.alert("Error", "Gagal memperbarui watchlist."); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner message="Memuat detail film..." />;
  if (error || !movie) return (
    <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
  );

  const posterUrl = getPosterUrl(movie.poster_path, "w780");
  const backdropUrl = getPosterUrl(movie.backdrop_path, "w780");
  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {backdropUrl
        ? <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
        : <View style={styles.backdropPlaceholder} />
      }
      <View style={styles.body}>
        <View style={styles.topRow}>
          {posterUrl
            ? <Image source={{ uri: posterUrl }} style={styles.poster} />
            : <View style={[styles.poster, styles.noPoster]} />
          }
          <View style={styles.basicInfo}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            {movie.tagline ? <Text style={styles.tagline}>"{movie.tagline}"</Text> : null}
            <Text style={styles.metaText}>⭐ {movie.vote_average.toFixed(1)} / 10</Text>
            <Text style={styles.metaText}>📅 {movie.release_date?.slice(0, 4) || "—"}</Text>
            {movie.runtime > 0 && <Text style={styles.metaText}>⏱ {hours > 0 ? `${hours}j ` : ""}{minutes}m</Text>}
            <View style={styles.genres}>
              {movie.genres?.map((g) => (
                <View key={g.id} style={styles.genreChip}>
                  <Text style={styles.genreText}>{g.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.watchlistBtn, inWatchlist && styles.watchlistBtnActive]}
          onPress={handleToggleWatchlist} disabled={saving}
        >
          <Text style={styles.watchlistBtnText}>
            {saving ? "Menyimpan..." : inWatchlist ? "✓ Ada di Watchlist" : "+ Tambah ke Watchlist"}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.overview}>{movie.overview || "Sinopsis tidak tersedia."}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Info Lainnya</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{movie.status || "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Runtime</Text>
            <Text style={styles.infoValue}>{movie.runtime ? `${hours}j ${minutes}m` : "—"}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backdrop: { width, height: 220, resizeMode: "cover" },
  backdropPlaceholder: { width, height: 220, backgroundColor: Colors.surface },
  body: { padding: 16 },
  topRow: { flexDirection: "row", gap: 14, marginTop: -40 },
  poster: { width: 110, height: 165, borderRadius: 8, resizeMode: "cover", borderWidth: 2, borderColor: Colors.surface },
  noPoster: { backgroundColor: Colors.surfaceLight },
  basicInfo: { flex: 1, paddingTop: 44, gap: 6 },
  movieTitle: { color: Colors.text, fontSize: 17, fontWeight: "800", lineHeight: 22 },
  tagline: { color: Colors.textMuted, fontSize: 12, fontStyle: "italic" },
  metaText: { color: Colors.textMuted, fontSize: 13 },
  genres: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  genreChip: { backgroundColor: Colors.surfaceLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  genreText: { color: Colors.textMuted, fontSize: 11 },
  watchlistBtn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 10, alignItems: "center", marginTop: 16, marginBottom: 8 },
  watchlistBtnActive: { backgroundColor: "#2D6A35" },
  watchlistBtnText: { color: Colors.text, fontWeight: "700", fontSize: 15 },
  section: { marginTop: 20 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginBottom: 8 },
  overview: { color: Colors.textMuted, fontSize: 14, lineHeight: 22 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { color: Colors.textMuted, fontSize: 13 },
  infoValue: { color: Colors.text, fontSize: 13, fontWeight: "600" },
  errorBox: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  errorText: { color: Colors.error, fontSize: 14 },
});