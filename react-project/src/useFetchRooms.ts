import { useEffect, useState } from "react";
import type { Room } from "./types";

interface UseFetchRoomsResult {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

/**
 * ქასთომ ჰუკი: useEffect-ით წამოიღებს ოთახების მონაცემებს.
 * რეალურ პროექტში შეცვალე url შენი API-ით.
 */
export function useFetchRooms(url: string): UseFetchRoomsResult {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Room[] = await res.json();
        setRooms(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("ოთახების ჩატვირთვა ვერ მოხერხდა");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [url]);

  return { rooms, loading, error };
}
