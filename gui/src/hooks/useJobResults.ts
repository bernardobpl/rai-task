import { useApi } from '@/api';
import { useFetch, type FetchOptionsT } from './useFetch';
import { useReportingStore } from '@/stores/Reporting';
import type { TemplateMatchingJobResults } from '@/api/resources/TemplateMatchingJob';

export function useJobResults(
  jobId: number,
  options?: FetchOptionsT<TemplateMatchingJobResults>,
) {
  const api = useApi();
  const reportingStore = useReportingStore();

  const { data, isLoading, fetchData } = useFetch({
    fetchFn: () => {
      if (typeof jobId !== 'number') throw new Error('Invalid job id');
      return api.templateMatchingJob.results(jobId);
    },
    initialValue: {} as TemplateMatchingJobResults,
    onError: (e) => {
      options?.onError?.(e);
      reportingStore.reportError('Failed to fetch job results');
    },
    ...options,
  });

  return {
    jobResults: data,
    loadingJobResults: isLoading,
    fetchJobResults: fetchData,
  };
}
