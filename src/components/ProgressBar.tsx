import React from 'react';
import { View } from 'react-native';

interface Props {
  current: number;
  target: number;
  color: string;
  height?: number;
}

export function ProgressBar({ current, target, color, height = 8 }: Props) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <View
      style={{ height, borderRadius: height / 2 }}
      className="w-full bg-gray-100 overflow-hidden"
    >
      <View
        style={{ width: `${pct}%`, height, backgroundColor: color, borderRadius: height / 2 }}
      />
    </View>
  );
}
