import { useCallback, useEffect, useState } from 'react';

const INITIAL_RESULT = { fetcher: null, version: 0, data: null, error: null };

export function useFetch(fetcher) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState(INITIAL_RESULT);

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setResult({ fetcher, version, data, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === 'AbortError') return;
        setResult({ fetcher, version, data: null, error });
      });

    return () => controller.abort();
  }, [fetcher, version]);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const setData = useCallback((valueOrUpdater) => {
    setResult((current) => ({
      ...current,
      data: typeof valueOrUpdater === 'function' ? valueOrUpdater(current.data) : valueOrUpdater,
    }));
  }, []);

  const isLoading = result.fetcher !== fetcher || result.version !== version;

  return {
    data: result.data,
    error: isLoading ? null : result.error,
    isLoading,
    reload,
    setData,
  };
}
