import React from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Movie, getPosterUrl } from "@/services/tmdb";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const router = useRouter();
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/movie/${movie.id}`)}
      activeOpacity={0.8}
    >
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      ) : (
        <View style={styles.noPoster}>
          <Text style={styles.noPosterText}>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.year}>{movie.release_date?.slice(0, 4) || "—"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  poster: { width: "100%", height: CARD_WIDTH * 1.5, resizeMode: "cover" },
  noPoster: {
    width: "100%", height: CARD_WIDTH * 1.5,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center", alignItems: "center",
  },
  noPosterText: { color: Colors.textDim, fontSize: 12 },
  info: { padding: 8 },
  title: { color: Colors.text, fontSize: 13, fontWeight: "600", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  star: { fontSize: 11 },
  rating: { color: Colors.gold, fontSize: 12, fontWeight: "bold", flex: 1 },
  year: { color: Colors.textMuted, fontSize: 11 },
});