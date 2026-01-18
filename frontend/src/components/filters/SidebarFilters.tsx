import "./filters.css";
import { useEffect, useState } from "react";
import type { Filters } from "../../state/filters";
import { env } from "../../env";

type MetaResponse = {
  topHobbies: string[];
  topNationalities: string[];
};

export default function SidebarFilters({
  onChange,
}: {
  onChange?: (filters: Filters) => void;
}) {
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/api/meta`)
      .then((r) => r.json())
      .then(setMeta);
  }, []);

  function applyFilter(next: Filters) {
    setFilters(next);
    onChange?.(next);
  }

  if (!meta) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title">Hobbies</div>
        {meta.topHobbies.map((hobby) => (
          <div
            key={hobby}
            className={`filter-item ${filters.hobby === hobby ? "active" : ""}`}
            onClick={() =>
              applyFilter({
                ...filters,
                hobby: filters.hobby === hobby ? undefined : hobby,
              })
            }
          >
            {hobby}
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title">Nationalities</div>
        {meta.topNationalities.map((n) => (
          <div
            key={n}
            className={`filter-item ${
              filters.nationality === n ? "active" : ""
            }`}
            onClick={() =>
              applyFilter({
                ...filters,
                nationality: filters.nationality === n ? undefined : n,
              })
            }
          >
            {n}
          </div>
        ))}
      </div>
    </aside>
  );
}
