import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  actual: number;
  target: number;
  color: string;
}

export function MetricsCard({ title, actual, target, color }: Props) {
  const pct = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
  const done = pct >= 100;
  const onTrack = pct >= 70;

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-semibold text-gray-800">{title}</Text>
        <View
          className="px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: done ? '#dcfce7' : onTrack ? '#fef9c3' : '#fee2e2',
          }}
        >
          <Text
            className="text-xs font-bold"
            style={{
              color: done ? '#16a34a' : onTrack ? '#ca8a04' : '#dc2626',
            }}
          >
            {pct}%
          </Text>
        </View>
      </View>

      <View className="flex-row items-end gap-1 mb-2">
        <Text className="text-2xl font-bold text-gray-900">{actual}</Text>
        <Text className="text-sm text-gray-500 pb-0.5">/ {target}</Text>
      </View>

      {/* Progress bar */}
      <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}
