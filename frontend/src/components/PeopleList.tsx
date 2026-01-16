import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Person } from "../../../shared/types/person";
import { useDebounce } from "../hooks/useDebounce";
import { Filters } from "../state/filters";

const PAGE_SIZE = 30;

export default function PeopleList({ filters }: { filters?: Filters }) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(filters?.search, 300);

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [filters?.hobby, filters?.nationality, debouncedSearch]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      ...(filters?.hobby && { hobby: filters.hobby }),
      ...(filters?.nationality && { nationality: filters.nationality }),
      ...(debouncedSearch && { search: debouncedSearch }),
    });

    fetch(`http://localhost:4000/api/people?${params.toString()}`)
      .then((r) => r.json())
      .then((r) => {
        setData((prev) => [...prev, ...r.data]);
        setHasMore(r.data.length === PAGE_SIZE);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  const rowVirtualizer = useVirtualizer({
    count: hasMore ? data.length + 1 : data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 96,
    overscan: 5,
  });

  useEffect(() => {
    const items = rowVirtualizer.getVirtualItems();
    const lastItem = items[items.length - 1];

    if (!lastItem) return;

    if (lastItem.index >= data.length - 1 && hasMore && !isLoading) {
      setPage((p) => p + 1);
    }
  }, [rowVirtualizer.getVirtualItems(), data.length, hasMore, isLoading]);

  return (
    <div className="list-container">
      <div ref={parentRef} className="virtual-container">
        <div
          className="virtual-inner"
          style={{ height: rowVirtualizer.getTotalSize() }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= data.length;
            const person = data[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                className="virtual-row"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className="loader">Loading…</div>
                ) : (
                  <PersonCard person={person} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="card">
      <img
        src={person.avatar}
        alt={`${person.first_name} avatar`}
        className="avatar"
        onError={(e) => {
          const img = e.currentTarget;
          img.onerror = null;
          img.src = "/avatar-placeholder.png";
        }}
      />

      <div className="card-content">
        <div className="name">
          {person.first_name} {person.last_name}
        </div>

        <div className="meta">
          {person.nationality} • {person.age} yrs
        </div>

        <div className="hobbies">
          {person.hobbies.slice(0, 2).join(", ")}
          {person.hobbies.length > 2 && (
            <span className="more"> (+{person.hobbies.length - 2})</span>
          )}
        </div>
      </div>
    </div>
  );
}
