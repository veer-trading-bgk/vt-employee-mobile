import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, FlatList, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface TeamSummaryResponse {
  data: Record<string, { email?: string; metrics?: Record<string, number> }>;
  targets: Record<string, number>;
}

export default function ManagerDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['manager-team'],
    queryFn: () => apiFetch<TeamSummaryResponse>('/api/metrics/team-summary'),
    refetchInterval: 30_000,
  });

  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  const targets = data?.targets ?? {};
  const KEYS = ['kyc', 'demat', 'mf', 'insurance'];

  const rows = Object.entries(data?.data ?? {})
    .map(([uid, entry]) => {
      const avg = Math.round(KEYS.reduce((s, k) => s + ((entry.metrics?.[k] ?? 0) / (targets[k] || 1)) * 100, 0) / KEYS.length);
      return { uid, email: entry.email ?? uid, avg, metrics: entry.metrics ?? {} };
    })
    .sort((a, b) => b.avg - a.avg);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-indigo-700 px-6 pb-6 pt-10">
        <Text className="text-white text-2xl font-bold">My Team</Text>
        <Text className="text-indigo-200 mt-1">{rows.length} members</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#6366f1" /></View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.uid}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <View className={`flex-row items-center px-4 py-3.5 border-b border-gray-100 ${index < 3 ? 'bg-amber-50' : 'bg-white'}`}>
              <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
                <Text className="text-indigo-700 font-bold">{(item.email[0] ?? '?').toUpperCase()}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900" numberOfLines={1}>{item.email}</Text>
                <Text className="text-xs text-gray-500">KYC: {item.metrics.kyc ?? 0} · Demat: {item.metrics.demat ?? 0}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${item.avg >= 80 ? 'bg-emerald-100' : item.avg >= 50 ? 'bg-amber-100' : 'bg-rose-100'}`}>
                <Text className={`text-xs font-bold ${item.avg >= 80 ? 'text-emerald-700' : item.avg >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>{item.avg}%</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<View className="items-center py-12"><Text className="text-gray-400">No team data yet</Text></View>}
        />
      )}
    </SafeAreaView>
  );
}
