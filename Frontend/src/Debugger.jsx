import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import "highlight.js/styles/github-dark.css";
import VoicePanel from "./VoicePanel";
import Tabs from "./Tabs";
import CodeViewer from "./CodeViewer";
import FileUploader from "./FileUploader";

const DuckDuckDebug = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [content, setContent] = useState({
    code: `// This is your CODE view\nfunction debug() {\n  console.log("Hello from Duck Debug!");\n}`,
    uml: `{\n  "file": "main.js",\n  "lines": 42,\n  "errors": []\n}`,
  });
  const [bubbleText, setBubbleText] = useState(
    "What are you having trouble with? "
  );
  const [inputText, setInputText] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab.toLowerCase());
  };

  return (
    <div className="container">
      <div className="left-panel">
        <VoicePanel
          bubbleText={bubbleText}
          inputText={inputText}
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
