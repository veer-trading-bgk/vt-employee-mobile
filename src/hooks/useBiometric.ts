import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';

export function useBiometric() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (compatible && enrolled) {
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          const label = types
            .map((t) =>
              t === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
                ? 'Face ID'
                : 'Touch ID'
            )
            .join('/');
          setBiometricType(label);
          setIsBiometricAvailable(true);
        }
      } catch {
        // hardware unavailable — silently skip
      }
    })();
  }, []);

  const authenticate = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        promptMessage: 'Authenticate to access VT Trading Employee Hub',
      });
      return result.success;
    } catch {
      return false;
    }
  };

  return { isBiometricAvailable, biometricType, authenticate };
}
