
import "./people.css";
import { env } from "../../env";
import PersonCard from "./PersonCard";
import { Filters } from "../../state/filters";
import { useDebounce } from "../../hooks/useDebounce";
import type { Person } from "../../../../shared/types/person";
import { useInfiniteVirtualList } from "../../hooks/useInfiniteVirtualList";

const PAGE_SIZE = 30;

export default function PeopleList({
  filters
}: {
  filters?: Filters;
}) {
  const debouncedSearch = useDebounce(filters?.search, 400);

  const {
    parentRef,
    rowVirtualizer,
    items,
    isLoading
  } = useInfiniteVirtualList<Person>({
    estimateSize: 96,

    deps: [
      filters?.hobby,
      filters?.nationality,
      debouncedSearch
    ],

    fetchPage: async (page, signal) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(filters?.hobby && { hobby: filters.hobby }),
        ...(filters?.nationality && { nationality: filters.nationality }),
        ...(debouncedSearch && { search: debouncedSearch })
      });

      try {
        const res = await fetch(
          `${env.apiBaseUrl}/api/people?${params}`,
          { signal }
        );

        const json = await res.json();

        return json.data as Person[];
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("aborted", { page, search: debouncedSearch });
          return [];
        }
        throw err;
      }
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