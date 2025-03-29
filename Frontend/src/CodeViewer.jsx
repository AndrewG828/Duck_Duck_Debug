import React, { useEffect } from "react";
import hljs from "highlight.js";

const CodeViewer = ({ content, activeTab }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, [content, activeTab]);

  const language = activeTab === "uml" ? "json" : "javascript";

  return (
    <div className="content-box" id="tab-content">
      <pre>
        <code className={`language-${language}`}>{content[activeTab]}</code>
      </pre>
    </div>
  );
};

export default CodeViewer;
