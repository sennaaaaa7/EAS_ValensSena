import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Perhatian", "Semua field wajib diisi.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Perhatian", "Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Perhatian", "Password tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password);
      Alert.alert("✅ Berhasil", "Akun berhasil dibuat!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (err: any) {
      Alert.alert("Registrasi Gagal", getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Kembali</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Daftar untuk menyimpan watchlist filmmu</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input} placeholder="email@kamu.com"
              placeholderTextColor={Colors.textDim} value={email}
              onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Minimal 6 karakter" placeholderTextColor={Colors.textDim}
                value={password} onChangeText={setPassword} secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPass ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Konfirmasi Password</Text>
            <TextInput
              style={styles.input} placeholder="Ulangi password"
              placeholderTextColor={Colors.textDim} value={confirmPassword}
              onChangeText={setConfirmPassword} secureTextEntry={!showPass}
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister} disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Daftar Sekarang</Text>}
            </TouchableOpacity>
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah punya akun?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}> Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use": return "Email sudah terdaftar.";
    case "auth/invalid-email": return "Format email tidak valid.";
    case "auth/weak-password": return "Password terlalu lemah.";
    default: return "Registrasi gagal. Coba lagi.";
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 32, marginTop: 8 },
  backBtn: { marginBottom: 20 },
  backText: { color: Colors.primary, fontSize: 14, fontWeight: "600" },
  title: { color: Colors.text, fontSize: 26, fontWeight: "900" },
  subtitle: { color: Colors.textMuted, fontSize: 14, marginTop: 6 },
  form: { gap: 6 },
  label: { color: Colors.textMuted, fontSize: 13, marginBottom: 2, marginTop: 10 },
  input: {
    backgroundColor: Colors.surfaceLight, color: Colors.text,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, borderWidth: 1, borderColor: Colors.border, marginBottom: 4,
  },
  passRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surfaceLight, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 4, paddingRight: 4,
  },
  eyeBtn: { padding: 10 },
  eyeText: { fontSize: 18 },
  btn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 10, alignItems: "center", marginTop: 16 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.text, fontWeight: "800", fontSize: 16 },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  loginText: { color: Colors.textMuted, fontSize: 14 },
  loginLink: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
});