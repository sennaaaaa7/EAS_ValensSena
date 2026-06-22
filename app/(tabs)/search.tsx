import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchMovies, Movie } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Colors } from "@/constants/Colors";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setLoading(true); setError(null);
      try {
        const data = await searchMovies(query);
        setResults(data); setSearched(true);
      } catch {
        setError("Gagal mencari film.");
      } finally { setLoading(false); }
    }, 500);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Cari Film</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input} placeholder="Ketik judul film..."
            placeholderTextColor={Colors.textDim} value={query}
            onChangeText={setQuery} autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(""); setResults([]); Keyboard.dismiss(); }} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && <LoadingSpinner message="Mencari..." />}
        {error && !loading && <View style={styles.centerBox}><Text style={styles.errorText}>{error}</Text></View>}
        {!loading && searched && results.length === 0 && (
          <View style={styles.centerBox}>
            <Text style={styles.emptyEmoji}>🎭</Text>
            <Text style={styles.emptyText}>Film "{query}" tidak ditemukan.</Text>
          </View>
        )}
        {!loading && !searched && !query && (
          <View style={styles.centerBox}>
            <Text style={styles.hintEmoji}>🎬</Text>
            <Text style={styles.hintText}>Cari film favoritmu di sini!</Text>
          </View>
        )}
        {!loading && results.length > 0 && (
          <FlatList
            data={results} keyExtractor={(item) => `search-${item.id}`}
            numColumns={2} columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text style={styles.resultCount}>{results.length} film ditemukan</Text>}
            renderItem={({ item }) => <MovieCard movie={item} />}
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
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surfaceLight, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, paddingRight: 12 },
  input: { flex: 1, color: Colors.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 12 },
  clearBtn: { padding: 4 },
  clearText: { color: Colors.textMuted, fontSize: 16 },
  list: { paddingBottom: 24 },
  row: { justifyContent: "space-between" },
  resultCount: { color: Colors.textMuted, fontSize: 13, marginBottom: 12 },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  hintEmoji: { fontSize: 48 },
  hintText: { color: Colors.textMuted, fontSize: 15, textAlign: "center" },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: Colors.textMuted, fontSize: 15, textAlign: "center" },
  errorText: { color: Colors.error, fontSize: 14 },
});