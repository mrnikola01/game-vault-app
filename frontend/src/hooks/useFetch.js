import { useState, useEffect } from "react";

function useFetch(fetchFunction, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err.message || err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, deps);

  return { data, isLoading, error };
}

export default useFetch;
