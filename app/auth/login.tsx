import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView, Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    // Ganti Alert dengan ini
    alert("Email dan password wajib diisi.");
    return;
  }
  setLoading(true);
  try {
    await login(email.trim(), password);
    router.replace("/(tabs)");
  } catch (err: any) {
    alert(getFirebaseErrorMessage(err.code));
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.brand}>
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.appName}>MovieVault - Sena Valent</Text>
          <Text style={styles.subtitle}>Simpan & temukan film favoritmu</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email@kamu.com"
            placeholderTextColor={Colors.textDim}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="••••••••"
              placeholderTextColor={Colors.textDim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPass ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Masuk</Text>}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Belum punya akun?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.registerLink}> Daftar sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found": return "Akun tidak ditemukan.";
    case "auth/wrong-password": return "Password salah.";
    case "auth/invalid-email": return "Format email tidak valid.";
    case "auth/invalid-credential": return "Email atau password salah.";
    case "auth/too-many-requests": return "Terlalu banyak percobaan. Coba lagi nanti.";
    default: return "Login gagal. Periksa email dan password kamu.";
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  brand: { alignItems: "center", marginBottom: 40 },
  logo: { fontSize: 56 },
  appName: { color: Colors.primary, fontSize: 32, fontWeight: "900", marginTop: 8 },
  subtitle: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
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
  registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  registerText: { color: Colors.textMuted, fontSize: 14 },
  registerLink: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
});