import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import type { LeaderboardRow } from '@/types';

interface TeamSummaryResponse {
  data: Record<string, { email?: string; metrics?: Record<string, number> }>;
  targets: Record<string, number>;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['mobile-leaderboard'],
    queryFn: () => apiFetch<TeamSummaryResponse>('/api/metrics/team-summary'),
    staleTime: 1000 * 60 * 2,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const targets = data?.targets ?? {};
  const METRICS = ['kyc', 'demat', 'mf', 'insurance'];
  const rows: LeaderboardRow[] = Object.entries(data?.data ?? {})
    .map(([userId, entry]) => {
      const avgScore = Math.round(
        METRICS.reduce((s, m) => s + ((entry.metrics?.[m] ?? 0) / (targets[m] || 1)) * 100, 0) / METRICS.length
      );
      return {
        rank: 0, userId,
        email: entry.email ?? userId,
        kyc: entry.metrics?.kyc ?? 0,
        demat: entry.metrics?.demat ?? 0,
        mf: entry.metrics?.mf ?? 0,
        insurance: entry.metrics?.insurance ?? 0,
        avgScore,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  const renderItem = ({ item, index }: { item: LeaderboardRow; index: number }) => (
    <View
      className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${index < 3 ? 'bg-amber-50' : 'bg-white'}`}
    >
      <Text className="w-10 text-xl text-center">{MEDAL[index] ?? `${index + 1}`}</Text>
      <View className="flex-1 ml-2">
        <Text className="font-semibold text-gray-900" numberOfLines={1}>{item.email}</Text>
        <Text className="text-xs text-gray-500">KYC: {item.kyc} · Demat: {item.demat}</Text>
      </View>
      <View className={`px-3 py-1 rounded-full ${item.avgScore >= 100 ? 'bg-emerald-100' : item.avgScore >= 70 ? 'bg-amber-100' : 'bg-rose-100'}`}>
        <Text className={`text-xs font-bold ${item.avgScore >= 100 ? 'text-emerald-700' : item.avgScore >= 70 ? 'text-amber-700' : 'text-rose-700'}`}>
          {item.avgScore}%
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-indigo-700 px-6 pb-6 pt-10">
        <Text className="text-white text-2xl font-bold">🏆 Leaderboard</Text>
        <Text className="text-indigo-200 mt-1">{rows.length} employees ranked</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-4xl mb-3">🏆</Text>
              <Text className="text-gray-500">No data yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
