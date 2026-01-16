import { useRef, useState } from "react";

export default function StreamTextViewer() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const bufferRef = useRef("");
  const flushTimerRef = useRef<number | null>(null);

  async function startStreaming() {
    setText("");
    setIsStreaming(true);
    bufferRef.current = "";

    const response = await fetch("http://localhost:4000/api/stream/text");

    if (!response.body) {
      setIsStreaming(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const flushToUI = () => {
      setText(bufferRef.current);
      flushTimerRef.current = null;
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      for (const char of chunk) {
        bufferRef.current += char;

        // Limit React updates (~60fps)
        if (!flushTimerRef.current) {
          flushTimerRef.current = window.setTimeout(flushToUI, 16);
        }

        await sleep(15); // typing effect
      }
    }

    // final flush
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
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
  return new Promise(resolve => setTimeout(resolve, ms));
}
