import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type FetchPage<T> = (page: number) => Promise<T[]>;

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
  const fetchingRef = useRef(false);

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Reset when dependencies change (filters/search)
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, deps);

  // Fetch page
 useEffect(() => {
  if (!hasMore || fetchingRef.current) return;

  fetchingRef.current = true;
  setIsLoading(true);

  fetchPage(page)
    .then(newItems => {
      setItems(prev => [...prev, ...newItems]);
      if (newItems.length === 0) {
        setHasMore(false);
      }
    })
    .finally(() => {
      fetchingRef.current = false;
      setIsLoading(false);
    });
}, [page, hasMore]);

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: hasMore ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5
  });

  // Trigger next page
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
