import { useState, useCallback } from 'react';
import type { TimelineError, TimelineErrorHandler } from '../types';

/**
 * Хук для централизованной обработки ошибок в компоненте Timeline
 */
export const useErrorHandler = (): {
  error: TimelineError | null;
  handleError: TimelineErrorHandler;
  clearError: () => void;
  hasError: boolean;
} => {
  const [error, setError] = useState<TimelineError | null>(null);

  const handleError = useCallback<TimelineErrorHandler>(
    (error: TimelineError): void => {
      console.error('Timeline Error:', error);
      setError(error);
    },
    []
  );

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const hasError = error !== null;

  return {
    error,
    handleError,
    clearError,
    hasError,
  };
};
