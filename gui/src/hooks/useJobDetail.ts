import { useApi } from '@/api';
import { useFetch, type FetchOptionsT } from './useFetch';
import { useReportingStore } from '@/stores/Reporting';
import type { TemplateMatchingJobOut } from '@/api/resources/TemplateMatchingJob';

export function useJobDetail(
  jobId: number,
  options?: FetchOptionsT<TemplateMatchingJobOut>,
) {
  const api = useApi();
  const reportingStore = useReportingStore();

  const { data, isLoading, fetchData } = useFetch({
    fetchFn: () => {
      if (typeof jobId !== 'number') throw new Error('Invalid job id');
      return api.templateMatchingJob.detail(jobId);
    },
    initialValue: {} as TemplateMatchingJobOut,
    onError: (e) => {
      options?.onError?.(e);
      reportingStore.reportError('Failed to fetch job detail');
    },
    ...options,
  });

  return {
    jobDetail: data,
    loadingJobDetail: isLoading,
    fetchJobDetail: fetchData,
  };
}
