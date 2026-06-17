import React from 'react';
import {
  View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/roleLabels';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className="bg-indigo-700 px-6 pb-10 pt-10 items-center">
          <View className="w-20 h-20 rounded-full bg-indigo-400 items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">{initials}</Text>
          </View>
          <Text className="text-white text-xl font-bold">{user?.name}</Text>
          <View className="mt-2 bg-indigo-500 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-semibold capitalize">
              {ROLE_LABELS[user?.role ?? 'telecaller']}
            </Text>
          </View>
        </View>

        <View className="px-4 mt-4">
          {/* Info card */}
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <Text className="font-bold text-gray-900 text-base mb-4">Account Details</Text>
            <View className="flex-row justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-500">Email</Text>
              <Text className="font-medium text-gray-900">{user?.email}</Text>
            </View>
            <View className="flex-row justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-500">Role</Text>
              <Text className="font-medium text-gray-900 capitalize">{user?.role}</Text>
            </View>
            <View className="flex-row justify-between py-3">
              <Text className="text-gray-500">Employee ID</Text>
              <Text className="font-medium text-gray-900 font-mono text-sm">
                {user?.id?.slice(0, 12)}…
              </Text>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity
            className="bg-rose-50 border border-rose-200 rounded-xl py-4 items-center mb-8"
            onPress={handleLogout}
          >
            <Text className="text-rose-600 font-bold text-base">🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
