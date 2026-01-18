import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type FetchPage<T> = (page: number, signal: AbortSignal) => Promise<T[]>;

type Options<T> = {
  fetchPage: FetchPage<T>;
  estimateSize: number;
  deps: unknown[];
};

export function useInfiniteVirtualList<T>({
  fetchPage,
  estimateSize,
  deps
}: Options<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fetchingRef = useRef(false);

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Reset list when external dependencies change (filters, search, etc.)
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    fetchingRef.current = false;
    setIsLoading(false);
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, deps);

  useEffect(() => {
    if (!hasMore || fetchingRef.current) return;

    // Cancel any in-flight request
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    fetchingRef.current = true;
    setIsLoading(true);

    fetchPage(page, controller.signal)
      .then(newItems => {
        setItems(prev => [...prev, ...newItems]);

        if (newItems.length === 0) {
          setHasMore(false);
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      })
      .finally(() => {
        // Ignore if this request was aborted
        if (controller.signal.aborted) return;

        fetchingRef.current = false;
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [page, hasMore]);


  const rowVirtualizer = useVirtualizer({
    count: hasMore ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5
  });

  // Trigger next page when scrolled near bottom
  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= items.length - 1 &&
      hasMore &&
      !fetchingRef.current
    ) {
      setPage(p => p + 1);
    }
  }, [rowVirtualizer.getVirtualItems(), items.length, hasMore]);

  return {
    parentRef,
    rowVirtualizer,
    items,
    isLoading
  };
}
