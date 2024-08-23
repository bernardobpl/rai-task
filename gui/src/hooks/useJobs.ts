import { useApi } from '@/api';
import { useFetch } from './useFetch';
import { useReportingStore } from '@/stores/Reporting';

export function useJobs() {
  const api = useApi();
  const reportingStore = useReportingStore();

  const { data, isLoading, fetchData } = useFetch({
    fetchFn: () => api.templateMatchingJob.list(),
    initialValue: [],
    onError: () => {
      reportingStore.reportError('Failed to fetch template matching jobs');
    },
  });

  return {
    jobs: data,
    loadingJobs: isLoading,
    fetchJobs: fetchData,
  };
}
