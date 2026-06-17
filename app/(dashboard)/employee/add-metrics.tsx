import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMetrics } from '@/hooks/useMetrics';
import { METRIC_COLORS } from '@/utils/constants';

const FIELDS = [
  { key: 'kyc' as const, label: 'KYC Accounts', color: METRIC_COLORS.kyc, placeholder: 'e.g. 3' },
  { key: 'demat' as const, label: 'Demat Accounts', color: METRIC_COLORS.demat, placeholder: 'e.g. 2' },
  { key: 'mf' as const, label: 'MF Orders', color: METRIC_COLORS.mf, placeholder: 'e.g. 1' },
  { key: 'insurance' as const, label: 'Insurance (₹)', color: METRIC_COLORS.insurance, placeholder: 'e.g. 25000' },
];

export default function AddMetricsScreen() {
  const [values, setValues] = useState({ kyc: '', demat: '', mf: '', insurance: '' });
  const [notes, setNotes] = useState('');
  const { addMetric, isAdding } = useMetrics();
  const router = useRouter();

  const handleSave = () => {
    const parsed = {
      kyc: parseInt(values.kyc) || 0,
      demat: parseInt(values.demat) || 0,
      mf: parseInt(values.mf) || 0,
      insurance: parseInt(values.insurance) || 0,
    };
    if (Object.values(parsed).every((v) => v === 0)) {
      Alert.alert('Required', 'Enter at least one metric value');
      return;
    }
    addMetric(
      { ...parsed, notes },
      {
        onSuccess: () => {
          Alert.alert('Saved!', 'Metrics logged for today', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (err) => Alert.alert('Error', err.message),
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Text className="text-indigo-600 text-base font-semibold">← Back</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">Add Today's Metrics</Text>
          </View>

          {FIELDS.map(({ key, label, color, placeholder }) => (
            <View key={key} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-2">
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 8 }} />
                <Text className="font-semibold text-gray-800">{label}</Text>
              </View>
              <TextInput
                className="border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900"
                placeholder={placeholder}
                value={values[key]}
                onChangeText={(v) => setValues((s) => ({ ...s, [key]: v }))}
                keyboardType="number-pad"
                editable={!isAdding}
                placeholderTextColor="#9ca3af"
              />
            </View>
          ))}

          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="font-semibold text-gray-800 mb-2">Notes (optional)</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900"
              placeholder="Any notes about today's work..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              editable={!isAdding}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity
            className="bg-indigo-600 rounded-xl py-4 items-center mb-3"
            onPress={handleSave}
            disabled={isAdding}
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">✅ Save Metrics</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-100 rounded-xl py-4 items-center mb-8"
            onPress={() => router.back()}
            disabled={isAdding}
          >
            <Text className="text-gray-600 font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
