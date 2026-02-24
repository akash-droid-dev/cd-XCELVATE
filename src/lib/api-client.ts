const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const ROWS_ENDPOINT = import.meta.env.VITE_API_ROWS_ENDPOINT || '/v1/funding-event/participants';
const METRICS_ENDPOINT = import.meta.env.VITE_API_METRICS_ENDPOINT || '';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJsonWithTimeout = async <T>(url: string, timeoutMs = 4000): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchEventRows = async <T>(retry = 2): Promise<T> => {
  let attempt = 0;
  let delay = 600;

  while (attempt <= retry) {
    try {
      return await fetchJsonWithTimeout<T>(`${API_BASE}${ROWS_ENDPOINT}`);
    } catch (error) {
      if (attempt === retry) throw error;
      await sleep(delay);
      delay *= 2;
      attempt += 1;
    }
  }

  throw new Error('Unreachable');
};

export const fetchMetrics = async <T>(): Promise<T | null> => {
  if (!METRICS_ENDPOINT) return null;
  try {
    return await fetchJsonWithTimeout<T>(`${API_BASE}${METRICS_ENDPOINT}`);
  } catch {
    return null;
  }
};
