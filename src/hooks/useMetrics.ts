import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiPost } from '@/services/api';
import type { MetricEntry } from '@/types';

interface MyMetricsResponse {
  data: Record<string, Record<string, number>>;
  targets: Record<string, number>;
}

export function useMetrics() {
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-metrics'],
    queryFn: () => apiFetch<MyMetricsResponse>('/api/metrics/my'),
    staleTime: 1000 * 60 * 2,
  });

  const addMutation = useMutation({
    mutationFn: (entry: Omit<MetricEntry, 'date'> & { date?: string }) => {
      const metricsToPost = [
        { metric_type: 'kyc', value: entry.kyc },
        { metric_type: 'demat', value: entry.demat },
        { metric_type: 'mf', value: entry.mf },
        { metric_type: 'insurance', value: entry.insurance },
      ].filter((m) => m.value > 0);
      return Promise.all(
        metricsToPost.map((m) =>
          apiPost('/api/metrics/add', { ...m, date: entry.date })
        )
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-metrics'] }),
  });

  // Flatten response into daily array
  const metrics: MetricEntry[] = Object.entries(data?.data ?? {}).map(
    ([date, vals]) => ({
      date,
      kyc: vals.kyc ?? 0,
      demat: vals.demat ?? 0,
      mf: vals.mf ?? 0,
      insurance: vals.insurance ?? 0,
    })
  );

  return {
    metrics,
    targets: data?.targets ?? {},
    isLoading,
    refetch,
    addMetric: addMutation.mutate,
    isAdding: addMutation.isPending,
    addError: addMutation.error,
  };
}
