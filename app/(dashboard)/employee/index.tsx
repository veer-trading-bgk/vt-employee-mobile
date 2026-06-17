import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useMetrics } from '@/hooks/useMetrics';
import { MetricsCard } from '@/components/MetricsCard';
import { ProgressBar } from '@/components/ProgressBar';
import { MONTHLY_TARGETS, METRIC_COLORS } from '@/utils/constants';
import { todayStr } from '@/utils/formatters';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { metrics, targets, isLoading, refetch } = useMetrics();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const today = metrics.find((m) => m.date === todayStr()) ?? {
    kyc: 0, demat: 0, mf: 0, insurance: 0,
  };

  const monthly = metrics.reduce(
    (s, m) => ({ kyc: s.kyc + m.kyc, demat: s.demat + m.demat, mf: s.mf + m.mf, insurance: s.insurance + m.insurance }),
    { kyc: 0, demat: 0, mf: 0, insurance: 0 }
  );

  const dailyTarget = (k: keyof typeof MONTHLY_TARGETS) =>
    Math.round((targets[k] ?? MONTHLY_TARGETS[k]) / 25);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Header */}
        <View className="bg-indigo-700 px-6 pb-8 pt-10">
          <Text className="text-white text-2xl font-bold">{user?.name ?? 'Employee'}</Text>
          <Text className="text-indigo-200 mt-1 capitalize">{user?.role} · Performance Dashboard</Text>
        </View>

        {/* Today */}
        <View className="px-4 -mt-4">
          <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Today's Progress</Text>
            <MetricsCard title="KYC" actual={today.kyc} target={dailyTarget('kyc')} color={METRIC_COLORS.kyc} />
            <MetricsCard title="Demat" actual={today.demat} target={dailyTarget('demat')} color={METRIC_COLORS.demat} />
            <MetricsCard title="MF Orders" actual={today.mf} target={dailyTarget('mf')} color={METRIC_COLORS.mf} />
            <MetricsCard title="Insurance" actual={today.insurance} target={dailyTarget('insurance')} color={METRIC_COLORS.insurance} />
          </View>

          {/* Monthly */}
          <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Monthly Totals</Text>
            {(['kyc', 'demat', 'mf', 'insurance'] as const).map((key) => (
              <View key={key} className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="font-semibold text-gray-700 capitalize">{key}</Text>
                  <Text className="font-bold" style={{ color: METRIC_COLORS[key] }}>
                    {monthly[key]} / {targets[key] ?? MONTHLY_TARGETS[key]}
                  </Text>
                </View>
                <ProgressBar current={monthly[key]} target={targets[key] ?? MONTHLY_TARGETS[key]} color={METRIC_COLORS[key]} />
              </View>
            ))}
          </View>

          {/* Actions */}
          <TouchableOpacity
            className="bg-indigo-600 rounded-xl py-4 items-center mb-3"
            onPress={() => router.push('/(dashboard)/employee/add-metrics')}
          >
            <Text className="text-white font-bold text-base">+ Add Today's Metrics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white border border-indigo-200 rounded-xl py-4 items-center mb-8"
            onPress={() => router.push('/(dashboard)/leaderboard/index')}
          >
            <Text className="text-indigo-600 font-bold text-base">🏆 View Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
