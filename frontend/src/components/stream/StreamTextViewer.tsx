import { useState } from "react";

export default function StreamTextViewer() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function startStreaming() {
    setText("");
    setIsStreaming(true);

    const response = await fetch("http://localhost:4000/api/stream/text");

    if (!response.body) {
      setIsStreaming(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      // Append one character at a time
      for (const char of chunk) {
        setText(prev => prev + char);
        await sleep(15); // controls typing speed
      }
    }

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
