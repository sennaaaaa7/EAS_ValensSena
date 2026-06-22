import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = "Loading..." }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 12,
  },
  text: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});