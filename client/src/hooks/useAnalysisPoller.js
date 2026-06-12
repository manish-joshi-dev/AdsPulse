import { useEffect, useState } from 'react';
import { analysis } from '../services/api.js';

export const useAnalysisPoller = (jobId) => {
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    let intervalId = null;
    let retryCount = 0;
    const maxRetries = 10;
    let backoffMs = 2000;

    const pollStatus = async () => {
      try {
        const response = await analysis.getStatus(jobId);
        const { status: jobStatus, progress: jobProgress, errorMessage } = response;

        setStatus(jobStatus);
        setProgress(jobProgress);
        setError(errorMessage || null);
        retryCount = 0;
        backoffMs = 2000;

        if (['completed', 'failed', 'archived'].includes(jobStatus)) {
          setIsPolling(false);
          if (intervalId) clearInterval(intervalId);
        }
      } catch (err) {
        retryCount += 1;
        setError(err.message);

        if (retryCount > maxRetries) {
          setIsPolling(false);
          if (intervalId) clearInterval(intervalId);
        } else {
          // Exponential backoff: max 10s
          backoffMs = Math.min(backoffMs * 1.5, 10000);
        }
      }
    };

    const startPolling = async () => {
      setIsPolling(true);
      setError(null);
      
      // Poll immediately first
      await pollStatus();

      // Then set up interval
      intervalId = setInterval(pollStatus, 2000);
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId]);

  return { status, progress, error, isPolling };
};
