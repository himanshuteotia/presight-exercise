import { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { ProcessResult } from "../../../../shared/types/process";

export default function ProcessList() {
  const [items, setItems] = useState<ProcessResult[]>([]);

  useWebSocket((message) => {
    setItems((prev) =>
      prev.map((item) => (item.id === message.id ? message : item))
    );
  });

  useEffect(() => {
    async function createRequests() {
      const requests = await Promise.all(
        Array.from({ length: 20 }).map(() =>
          fetch("http://localhost:4000/api/process", {
            method: "POST",
          }).then((r) => r.json())
        )
      );

      setItems(requests);
    }

    createRequests();
  }, []);

  return (
    <div className="process-box">
      <h3>Async Processing</h3>

      {items.map((item) => (
        <div key={item.id} className="process-item">
          <span>{item.id.slice(0, 8)}</span>
          <span className={item.status}>
            {item.status === "pending" ? "Pending…" : item.result}
          </span>
        </div>
      ))}
    </div>
  );
}
