import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '@/utils/constants';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Required', 'Please fill all fields');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(err.message);
      }
      Alert.alert('Success', 'Account created! Please log in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          <View className="bg-white rounded-3xl p-8 shadow-xl">
            <Text className="text-2xl font-bold text-gray-900 mb-1">Create Account</Text>
            <Text className="text-gray-500 mb-6">Register for VT Trading Employee Hub</Text>

            <TextInput className="border border-gray-200 rounded-xl px-4 py-3.5 text-base mb-3 text-gray-900" placeholder="Full name" value={name} onChangeText={setName} editable={!loading} placeholderTextColor="#9ca3af" />
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3.5 text-base mb-3 text-gray-900" placeholder="Work email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" editable={!loading} placeholderTextColor="#9ca3af" />
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3.5 text-base mb-6 text-gray-900" placeholder="Password (min 8 chars)" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} placeholderTextColor="#9ca3af" />

            <TouchableOpacity className="bg-indigo-600 rounded-xl py-4 items-center mb-4" onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Create Account</Text>}
            </TouchableOpacity>

            <Text className="text-center text-gray-500 text-sm">
              Already registered?{' '}
              <Text className="text-indigo-600 font-semibold" onPress={() => router.back()}>Sign in</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
