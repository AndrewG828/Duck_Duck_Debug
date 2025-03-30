import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { marked } from "marked";
import VoicePanel from "./VoicePanel";
import Tabs from "./Tabs"; // might remove
import CodeViewer from "./CodeViewer";
import FileUploader from "./FileUploader";

const DuckDuckDebug = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [content, setContent] = useState({
    code: `// This is your CODE view\nfunction debug() {\n  console.log("Hello from Duck Debug!");\n}`,
    uml: `{\n  "file": "main.js",\n  "lines": 42,\n  "errors": []\n}`,
  });
  const [bubbleText, setBubbleText] = useState(
    "What are youyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyouyou having trouble with? "
  );
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    hljs.highlightAll();
  }, [activeTab, content]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.toLowerCase());
  };

  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.error("[AUDIO PLAY ERROR]", err);
    });
  };

  const handleRecord = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.onstart = () => {
        audioChunksRef.current = [];
      };

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const res = await fetch("http://localhost:5001/process_audio", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.transcription) {
            setInputText(data.transcription);
          } else {
            setInputText(
              "❌ Transcription error: " + (data.error || "Unknown error")
            );
          }
        } catch (err) {
          console.error("[FETCH ERROR]", err);
          setBubbleText("❌ Error sending audio");
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const question = inputText;
    setInputText(""); // Clear input field

    try {
      // === Step 1: Get top 2 retrieved code documents ===
      const retrievedRes = await fetch(
        "http://localhost:5001/get_retrieved_code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

      const codeMatches = await retrievedRes.json();

      const combinedCode = codeMatches
        .map(
          (doc, idx) =>
            `// [Match ${idx + 1}] from ${
              doc.metadata.file_name || "unknown"
            }\n${doc.content}`
        )
        .join("\n\n" + "=".repeat(40) + "\n\n");

      // Update content and tab with retrieved code
      setContent((prev) => ({
        ...prev,
        code: combinedCode,
      }));
      setActiveTab("code");

      // === Step 2: Get AI response (rubber duck) ===
      const res = await fetch("http://localhost:8000/api/rag/rag-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.text();
      if (data) {
        setBubbleText(data);

        // === Step 3: Text-to-Speech ===
        try {
          const ttsRes = await fetch("http://localhost:5001/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data }),
          });

          const ttsData = await ttsRes.json();

          if (ttsData.audio_url) {
            const audioRes = await fetch(
              `http://localhost:5001${ttsData.audio_url}`
            );
            if (!audioRes.ok) throw new Error("Failed to fetch audio file");

            const audioBlob = await audioRes.blob();
            const audioURL = URL.createObjectURL(audioBlob);
            playAudio(audioURL);
          } else {
            console.error("[TTS ERROR]", ttsData.error);
          }
        } catch (ttsErr) {
          console.error("[TTS FETCH ERROR]", ttsErr);
        }
      } else {
        setBubbleText((prev) => `${prev}\n\n❌ AI error`);
      }
    } catch (err) {
      console.error("[SEND ERROR]", err);
      setBubbleText("❌ Error contacting AI or retrieving code");
    }

    setInputText(""); // Ensure input field is reset
  };

  return (
    <div className="container">
      <div className="left-panel">
        <VoicePanel
          bubbleText={bubbleText}
          inputText={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onRecord={handleRecord}
          onSend={handleSend}
          isRecording={mediaRecorder?.state === "recording"}
          fileUploader={
            <FileUploader
              setContent={setContent}
              setActiveTab={setActiveTab}
              setBubbleText={setBubbleText}
            />
          }
        />
      </div>

      <div className="right-panel">
        <Tabs activeTab={activeTab} onTabClick={handleTabClick} />
        <CodeViewer content={content} activeTab={activeTab} />
      </div>
    </div>
  );
};

export default DuckDuckDebug;
