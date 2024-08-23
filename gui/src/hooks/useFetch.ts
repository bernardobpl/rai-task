import { onMounted, ref, watch, type Ref } from 'vue';

type UseFetchOptionsT<T> = {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  initialValue?: T;
  enabled?: Ref<boolean>;
};

export type FetchOptionsT<T> = Omit<UseFetchOptionsT<T>, 'fetchFn'>;

export function useFetch<T>(options: UseFetchOptionsT<T>) {
  const { fetchFn, onSuccess, onError, initialValue, enabled = ref(true) } = options;
  const isLoading = ref(false);
  // @ts-expect-error
  const data = ref<T>(initialValue);

  async function fetchData() {
    try {
      console.log('fetching');
      isLoading.value = true;
      // @ts-expect-error
      data.value = await fetchFn();
      // @ts-expect-error
      onSuccess?.(data.value);
    } catch (e) {
      console.error(e);
      onError?.(e);
    } finally {
      isLoading.value = false;
    }
  }

  watch(enabled, () => {
    if (enabled.value) {
      fetchData();
    }
  });

  onMounted(() => {
    if (enabled.value) {
      fetchData();
    }
  });

  return {
    isLoading,
    data,
    fetchData,
  };
}
