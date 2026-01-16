import type { Person } from "../../../shared/types/person";
import { useInfiniteVirtualList } from "../hooks/useInfiniteVirtualList";
import { Filters } from "../state/filters";

const PAGE_SIZE = 30;

export default function PeopleList({
  filters
}: {
  filters?: Filters;
}) {
  const {
    parentRef,
    rowVirtualizer,
    items,
    isLoading
  } = useInfiniteVirtualList<Person>({
    estimateSize: 96,
    deps: [filters?.hobby, filters?.nationality, filters?.search],
    fetchPage: async (page) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(filters?.hobby && { hobby: filters.hobby }),
        ...(filters?.nationality && { nationality: filters.nationality }),
        ...(filters?.search && { search: filters.search })
      });

      const res = await fetch(
        `http://localhost:4000/api/people?${params}`
      );
      const json = await res.json();
      return json.data as Person[];
    }
  });

  return (
    <div className="list-container">
      <div ref={parentRef} className="virtual-container">
        <div
          className="virtual-inner"
          style={{ height: rowVirtualizer.getTotalSize() }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const isLoader = virtualRow.index >= items.length;
            const person = items[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                className="virtual-row"
                style={{
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {isLoader ? (
                  <div className="loader">
                    {isLoading ? "Loading…" : null}
                  </div>
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
        className="avatar"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/avatar-placeholder.png";
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
            <span className="more">
              {" "}
              (+{person.hobbies.length - 2})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
