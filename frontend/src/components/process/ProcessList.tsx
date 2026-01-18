import "./process.css";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { ProcessStatus, type ProcessResult } from "../../../../shared/types/process";
import { env } from "../../env";

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
          fetch(`${env.apiBaseUrl}/api/process`, {
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
          <span className={item.status.toLowerCase()}>
            {item.status === ProcessStatus.PENDING ? "Pending…" : item.result}
          </span>
        </div>
      ))}
    </div>
  );
}
