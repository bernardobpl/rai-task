import { useApi } from '@/api';
import { useFetch, type FetchOptionsT } from './useFetch';
import { useReportingStore } from '@/stores/Reporting';
import type { DocumentTemplateOut } from '@/api/resources/DocumentTemplate';

export function useTemplates(options?: FetchOptionsT<DocumentTemplateOut[]>) {
  const api = useApi();
  const reportingStore = useReportingStore();

  const { data, isLoading, fetchData } = useFetch({
    fetchFn: () => api.documentTemplate.list(),
    initialValue: [],
    onError: (e) => {
      options?.onError?.(e);
      reportingStore.reportError('Failed to fetch document templates');
    },
    ...options,
  });

  return {
    templates: data,
    loadingTemplates: isLoading,
    fetchTemplates: fetchData,
  };
}
