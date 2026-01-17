import "./stream.css";
import { useRef, useState } from "react";
import { env } from "../../env";

export default function StreamTextViewer() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const bufferRef = useRef("");
  const rafIdRef = useRef<number | null>(null);

  async function startStreaming() {
    setText("");
    setIsStreaming(true);
    bufferRef.current = "";

    const response = await fetch(`${env.apiBaseUrl}/api/stream/text`);

    if (!response.body) {
      setIsStreaming(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const flushToUI = () => {
      setText(bufferRef.current);
      rafIdRef.current = null; // allow next frame
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      for (const char of chunk) {
        bufferRef.current += char;

        // Schedule one UI update per frame
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(flushToUI);
        }

        await sleep(15); // typing effect
      }
    }

    // Final flush
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    setText(bufferRef.current);
    setIsStreaming(false);
  }

  return (
    <div className="stream-box">
      <div className="stream-header">
        <span>Streaming response</span>
        <button onClick={startStreaming} disabled={isStreaming}>
          {isStreaming ? "Streaming…" : "Start"}
        </button>
      </div>

      <div className="stream-content">
        {text || <span className="muted">No data yet</span>}
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
