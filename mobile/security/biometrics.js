import * as LocalAuthentication from "expo-local-authentication";

export async function canUseBiometrics() {
  const [hasHardware, enrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hasHardware && enrolled;
}

export async function authenticateWithBiometrics() {
  if (!(await canUseBiometrics())) {
    return { success: false, error: "not_available" };
  }

  return LocalAuthentication.authenticateAsync({
    promptMessage: "Unlock Astra AI",
    promptDescription: "Authenticate to unlock this conversation.",
    cancelLabel: "Use PIN",
    disableDeviceFallback: true,
  });
}
