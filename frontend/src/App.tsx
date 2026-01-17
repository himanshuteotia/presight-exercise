import "./styles/base.css";
import "./styles/layout.css";

import { useState } from "react";
import SidebarFilters from "./components/filters/SidebarFilters";
import PeopleList from "./components/people/PeopleList";
import SearchBox from "./components/ui/SearchBox";
import StreamTextViewer from "./components/stream/StreamTextViewer";
import type { Filters } from "./state/filters";
import ProcessList from "./components/process/ProcessList";

export default function App() {
  const [filters, setFilters] = useState<Filters>({});

  return (
    <div className="page">
      <div className="layout">
        <SidebarFilters onChange={setFilters} />

        <div className="list-container">
          <SearchBox
            value={filters.search ?? ""}
            onChange={(value) =>
              setFilters((f) => ({ ...f, search: value || undefined }))
            }
          />

          <PeopleList filters={filters} />

          <StreamTextViewer />
          <ProcessList />
        </div>
      </div>
    </div>
  );
}
