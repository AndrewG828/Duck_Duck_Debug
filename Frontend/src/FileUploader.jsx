import React, { useRef } from "react";
import { marked } from "marked";

const FileUploader = ({ setContent, setActiveTab, setBubbleText }) => {
  const fileInputRef = useRef(null);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     const text = event.target.result;
  //     const isMarkdown = file.name.endsWith(".md");
  //     const isJSON = file.name.endsWith(".json");
  //     const lang = isJSON ? "json" : isMarkdown ? "markdown" : "javascript";

  //     if (isMarkdown) {
  //       setContent((prev) => ({ ...prev, code: marked.parse(text) }));
  //     } else {
  //       setContent((prev) => ({ ...prev, code: text }));
  //     }

  //     setActiveTab("code");
  //   };

  //   reader.readAsText(file);
  // };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files
      .filter((file) => file.name.endsWith(".java"))
      .forEach((file) => {
        formData.append("files", file, file.webkitRelativePath);
      });

    console.log(formData);

    try {
      const res = await fetch("http://localhost:8000/api/code/scrape-java", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setBubbleText(`✅ ${data.message}`);
    } catch (err) {
      console.error("Scrape failed", err);
      setBubbleText("❌ Upload failed.");
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files
      .filter((file) => file.name.endsWith(".java"))
      .forEach((file) => {
        formData.append("files", file, file.webkitRelativePath);
      });

    console.log(formData);

    try {
      const res = await fetch("http://localhost:8000/api/code/scrape-java", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setBubbleText(`✅ ${data.message}`);
    } catch (err) {
      console.error("Scrape failed", err);
      setBubbleText("❌ Upload failed.");
    }
  };

  return (
    <div className="file-select">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        webkitdirectory="true"
        directory=""
        multiple
        style={{ display: "none" }}
      />
      <button className="button" onClick={() => fileInputRef.current?.click()}>
        Select File
      </button>
    </div>
  );
};

export default FileUploader;
