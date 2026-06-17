import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { MetricsCard } from '@/components/MetricsCard';

interface TeamSummaryResponse {
  data: Record<string, { email?: string; metrics?: Record<string, number> }>;
  targets: Record<string, number>;
}

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-team'],
    queryFn: () => apiFetch<TeamSummaryResponse>('/api/metrics/team-summary'),
    refetchInterval: 30_000,
  });

  const onRefresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false); };

  const entries = Object.entries(data?.data ?? {});
  const targets = data?.targets ?? {};
  const KEYS = ['kyc', 'demat', 'mf', 'insurance'] as const;
  const COLORS: Record<string, string> = { kyc: '#6366f1', demat: '#22c55e', mf: '#f59e0b', insurance: '#ec4899' };

  const teamTotals = KEYS.reduce((acc, k) => {
    acc[k] = entries.reduce((s, [, e]) => s + (e.metrics?.[k] ?? 0), 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="bg-indigo-700 px-6 pb-8 pt-10">
          <Text className="text-white text-2xl font-bold">Admin Overview</Text>
          <Text className="text-indigo-200 mt-1">{entries.length} active employees</Text>
        </View>

        <View className="px-4 -mt-4">
          <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <Text className="font-bold text-gray-900 text-lg mb-3">Team Totals Today</Text>
            {isLoading ? (
              <ActivityIndicator color="#6366f1" />
            ) : (
              KEYS.map((k) => (
                <MetricsCard
                  key={k}
                  title={k.toUpperCase()}
                  actual={teamTotals[k]}
                  target={(targets[k] ?? 0) * entries.length}
                  color={COLORS[k]}
                />
              ))
            )}
          </View>

          {/* Quick stats */}
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-white rounded-xl shadow-sm p-4 items-center">
              <Text className="text-3xl font-bold text-indigo-600">{entries.length}</Text>
              <Text className="text-gray-500 text-sm mt-1">Employees</Text>
            </View>
            <View className="flex-1 bg-white rounded-xl shadow-sm p-4 items-center">
              <Text className="text-3xl font-bold text-emerald-600">
                {Math.round(KEYS.reduce((s, k) => s + (targets[k] ? (teamTotals[k] / (targets[k] * entries.length)) * 100 : 0), 0) / KEYS.length)}%
              </Text>
              <Text className="text-gray-500 text-sm mt-1">Avg Target</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
