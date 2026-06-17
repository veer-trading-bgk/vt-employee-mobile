import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBiometric } from '@/hooks/useBiometric';
import { secureGet, secureSet } from '@/services/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isBiometricAvailable, biometricType, authenticate } = useBiometric();
  const router = useRouter();

  useEffect(() => {
    secureGet('email').then((saved) => { if (saved) setEmail(saved); });
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Required', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      await secureSet('email', email.trim().toLowerCase());
      router.replace('/(dashboard)');
    } catch (err: unknown) {
      Alert.alert('Login Failed', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const ok = await authenticate();
    if (!ok) { Alert.alert('Failed', 'Biometric authentication failed'); return; }
    const savedEmail = await secureGet('email');
    const savedToken = await secureGet('token');
    if (!savedToken || !savedEmail) {
      Alert.alert('Not set up', 'Please log in with email first');
      return;
    }
    router.replace('/(dashboard)');
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-3xl p-8 shadow-xl">
            {/* Logo area */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-indigo-600 rounded-2xl items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">VT</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">VT Trading</Text>
              <Text className="text-gray-500 mt-1">Employee Hub</Text>
            </View>

            {/* Email */}
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3.5 text-base mb-3 text-gray-900"
              placeholder="Work email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              placeholderTextColor="#9ca3af"
            />

            {/* Password */}
            <View className="border border-gray-200 rounded-xl flex-row items-center mb-5 px-4">
              <TextInput
                className="flex-1 py-3.5 text-base text-gray-900"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-indigo-600 font-semibold text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login button */}
            <TouchableOpacity
              className="bg-indigo-600 rounded-xl py-4 items-center mb-3"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Biometric */}
            {isBiometricAvailable && (
              <TouchableOpacity
                className="border border-indigo-200 rounded-xl py-4 items-center mb-5"
                onPress={handleBiometric}
              >
                <Text className="text-indigo-600 font-semibold text-base">
                  🔐 Sign in with {biometricType || 'Biometrics'}
                </Text>
              </TouchableOpacity>
            )}

            <Text className="text-center text-gray-500 text-sm">
              New here?{' '}
              <Text
                className="text-indigo-600 font-semibold"
                onPress={() => router.push('/(auth)/register')}
              >
                Register
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
