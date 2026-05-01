import { useState, useEffect, useRef } from "react";
import { getGames } from "../api/games";

// debounce, 400 ms
export default function useDebouncedSearch() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleSearch = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = value.trim();
    if (!query) {
      setOptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await getGames(query);
        setOptions(data || []);
      } catch (error) {
        console.error("Error:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };
  
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { options, loading, handleSearch };
}
