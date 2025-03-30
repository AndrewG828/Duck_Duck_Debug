import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const VoicePanel = ({
  bubbleText,
  inputText,
  onChange,
  onRecord,
  onSend,
  isRecording,
  isTalking,
  fileUploader,
}) => {
  const [showDuck, setShowDuck] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  useEffect(() => {
    let interval;

    if (isTalking) {
      interval = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 200);
    } else {
      setMouthOpen(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTalking]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowDuck(true);
    }, 600); // match transition duration

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="voice-section">
      <div className="chat-section">
        <div className="duck-bubble-container">
          <motion.img
            src={mouthOpen ? "/duck_open.png" : "/duck_closed.png"}
            alt="Duck"
            className="debug-duck"
            transition={{ type: "tween", ease: "linear", duration: 0.3 }}
            layoutId="duck"
            layout="position"
          />
          <div className="bubble">{bubbleText}</div>
        </div>
      </div>
      <div className="input-area">
        <textarea
          placeholder="Type your message..."
          value={inputText}
          onChange={onChange}
          className="input-textarea"
        />
        <button className="button" onClick={onRecord}>
          {isRecording ? "Stop" : "Record"}
        </button>
        <button className="button" onClick={onSend}>
          Send
        </button>
        {fileUploader}
      </div>
    </div>
  );
};

export default VoicePanel;
