import { useCallback, useRef, useState, useEffect } from "react";

export const useHttpClient = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const abortController = new AbortController();
      activeRequests.current.push(abortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: abortController.signal,
        });
        const responseData = await response.json();

        activeRequests.current = activeRequests.current.filter(
          (reqCtrl) => reqCtrl !== abortController
        );

        if (!response.ok) {
          setError(responseData.message);
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw new Error(error.message);
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeRequests.current.forEach((abortController) =>
        abortController.abort()
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
