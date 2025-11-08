import { useEffect, useRef, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useAbortController() {
  const ref = useRef<AbortController | null>(null);
  function replaceController() {
    if (ref.current) ref.current.abort();
    const c = new AbortController();
    ref.current = c;
    return c;
  }
  return { replaceController };
}