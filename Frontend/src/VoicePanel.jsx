import React, { useState, useEffect } from "react";

const VoicePanel = ({ bubbleText, inputText, fileUploader }) => {
  return (
    <div className="voice-section">
      <div className="chat-section">
        <div className="duck-bubble-container">
          <img src="/duck_closed.png" alt="Duck" className="duck" />
          <img src="/title.png" alt="Duck" className="title" />
          <div className="bubble">{bubbleText}</div>
        </div>
      </div>
      <div className="input-area">
        <textarea
          placeholder="Type your message..."
          value={inputText}
          className="input-textarea"
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="button"></button>
        <button className="button"></button>
        {fileUploader}
      </div>
    </div>
  );
};

export default VoicePanel;
