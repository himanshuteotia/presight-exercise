import { useState } from "react";
import "./App.css";
import SidebarFilters from "./components/SidebarFilters";
import PeopleList from "./components/PeopleList";
import SearchBox from "./components/SearchBox";
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
              setFilters(f => ({ ...f, search: value || undefined }))
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
