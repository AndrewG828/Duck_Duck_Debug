import React, { useRef } from "react";
import { marked } from "marked";

const FileUploader = ({ setContent, setActiveTab, setBubbleText }) => {
  const fileInputRef = useRef(null);

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
