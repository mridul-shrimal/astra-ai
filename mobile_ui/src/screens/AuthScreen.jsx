import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeProvider";

export default function AuthScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const { auth } = useAppContext();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password) return;

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await auth.signUp(email.trim(), password);

        if (error) {
          Alert.alert("Sign Up Failed", error.message);
        } else {
          Alert.alert(
            "Check Your Email",
            "A confirmation email has been sent. Please check your inbox."
          );
        }
      } else {
        const { error } = await auth.signIn(email.trim(), password);

        if (error) {
          Alert.alert("Sign In Failed", error.message);
        }
      }
    } catch (err) {
      Alert.alert("Error", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name="sparkles" size={48} color={colors.primary} />
        <Text
          style={[
            typography.display,
            { color: colors.text, marginTop: spacing.xl, fontSize: 32 },
          ]}
        >
          Astra AI
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textMuted, marginTop: 8 },
          ]}
        >
          Your thoughtful AI workspace.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.textDim}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                borderRadius: radius.md,
              },
            ]}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.textDim}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
                borderRadius: radius.md,
              },
            ]}
            secureTextEntry
            textContentType={isSignUp ? "newPassword" : "password"}
          />
        </View>

        <TouchableOpacity
          onPress={handleAuth}
          disabled={loading || !email.trim() || !password}
          activeOpacity={0.8}
          style={[
            styles.authButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              opacity: loading || !email.trim() || !password ? 0.5 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Text
              style={{
                color: colors.background,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          activeOpacity={0.7}
          style={styles.toggleButton}
        >
          <Text
            style={{
              color: colors.primary,
              fontSize: 15,
              fontWeight: "500",
            }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Need an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 32,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
  },
  authButton: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  toggleButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 8,
  },
});
