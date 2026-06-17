import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function DashboardIndex() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;

  if (user.role === 'admin') return <Redirect href="/(dashboard)/admin/index" />;
  if (user.role === 'manager') return <Redirect href="/(dashboard)/manager/index" />;
  return <Redirect href="/(dashboard)/employee/index" />;
}
