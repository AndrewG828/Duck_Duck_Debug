import React, { useRef } from "react";
import { marked } from "marked";

const FileUploader = ({ setContent, setActiveTab, setBubbleText }) => {
  const fileInputRef = useRef(null);
  return (
    <div className="file-select">
      <input
        type="file"
        ref={fileInputRef}
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
