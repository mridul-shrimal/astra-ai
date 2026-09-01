import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function AuthScreen({
  styles,
  email,
  password,
  authLoading,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onSignup,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.authContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          contentContainerStyle={styles.authContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios"
              ? "interactive"
              : "on-drag"
          }
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.authBrand}>
            <View
              style={styles.authLogo}
              accessibilityElementsHidden
            >
              <Text style={styles.authLogoText}>
                ✦
              </Text>
            </View>

            <Text style={styles.appTitle}>
              Astra AI
            </Text>

            <Text style={styles.authSubtitle}>
              Your personal AI assistant
            </Text>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.authHeading}>
              Welcome back
            </Text>

            <Text style={styles.authDescription}>
              Sign in to continue to Astra AI.
            </Text>

            <View style={styles.authField}>
              <Text style={styles.authFieldLabel}>
                Email
              </Text>

              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={onEmailChange}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                editable={!authLoading}
                returnKeyType="next"
                blurOnSubmit={false}
                accessibilityLabel="Email address"
              />
            </View>

            <View style={styles.authField}>
              <Text style={styles.authFieldLabel}>
                Password
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
                textContentType="password"
                autoComplete="password"
                editable={!authLoading}
                returnKeyType="done"
                onSubmitEditing={
                  authLoading
                    ? undefined
                    : onLogin
                }
                accessibilityLabel="Password"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.authButton,
                authLoading &&
                  styles.authButtonDisabled,
              ]}
              onPress={onLogin}
              disabled={authLoading}
              accessibilityRole="button"
              accessibilityLabel={
                authLoading
                  ? "Signing in"
                  : "Log in"
              }
            >
              {authLoading ? (
                <View style={styles.authButtonContent}>
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                  />

                  <Text style={styles.authButtonText}>
                    Signing in...
                  </Text>
                </View>
              ) : (
                <Text style={styles.authButtonText}>
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.authDivider}>
              <View style={styles.authDividerLine} />

              <Text style={styles.authDividerText}>
                OR
              </Text>

              <View style={styles.authDividerLine} />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.secondaryAuthButton,
                authLoading &&
                  styles.authButtonDisabled,
              ]}
              onPress={onSignup}
              disabled={authLoading}
              accessibilityRole="button"
              accessibilityLabel={
                authLoading
                  ? "Creating account"
                  : "Create account"
              }
            >
              {authLoading ? (
                <View style={styles.authButtonContent}>
                  <ActivityIndicator
                    size="small"
                    color="#22d3ee"
                  />

                  <Text style={styles.secondaryAuthButtonText}>
                    Creating account...
                  </Text>
                </View>
              ) : (
                <Text style={styles.secondaryAuthButtonText}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.authFooter}>
            Secure access to your personal AI assistant
          </Text>

          <Text style={styles.authVersion}>
            Astra AI
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AuthScreen;
