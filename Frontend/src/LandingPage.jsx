// src/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => {
  const navigate = useNavigate();
  // Update the duckVariants in LandingPage.jsx
  const duckVariants = {
    hidden: {
      x: -700,
      y: -300,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
    },
    visible: {
      x: 0,
      y: [
        -150, // Starting height
        0, // First bounce on ground (squish)
        -80, // Height after first bounce
        0, // Second bounce on ground (squish)
        -40, // Height after second bounce
        0, // Third bounce on ground (squish)
        -20, // Height after third bounce
        0, // Final position on ground
      ],
      // Squish effect - widen and flatten when hitting the ground
      scaleX: [
        1, // Normal
        1.15, // Wider on first bounce
        1, // Normal
        1.1, // Wider on second bounce
        1, // Normal
        1.1, // Wider on third bounce
        1, // Normal
        1,
        1,
        1.2,
        1, // Final normal scale
      ],
      scaleY: [
        1, // Normal
        0.85, // Flatter on first bounce
        1, // Normal
        0.9, // Flatter on second bounce
        1, // Normal
        0.9, // Flatter on third bounce
        1, // Normal
        1,
        1,
        0.8,
        1, // Final normal scale
      ],
      opacity: 1,
      transition: {
        x: {
          type: "tween",
          ease: "easeOut",
          duration: 1.95,
        },
        y: {
          duration: 3,
          // 0, 0.3, 0.5, 0.65, 0.8, 0.9, 0.95, 1
          //   0, 0.24, 0.4, 0.5, 0.56, 0.6, 0.63, 0.65
          times: [0, 0.24, 0.4, 0.5, 0.56, 0.6, 0.63, 0.65],
          ease: "easeInOut",
        },
        // Use the same timing for scale animations to match the bounces
        scaleX: {
          duration: 3,
          times: [0, 0.24, 0.4, 0.5, 0.56, 0.6, 0.63, 0.65, 0.87, 0.95, 1],
        },
        scaleY: {
          duration: 3,
          times: [0, 0.24, 0.4, 0.5, 0.56, 0.6, 0.63, 0.65, 0.87, 0.95, 1],
        },
      },
    },
  };
  return (
    <div className="landing-page">
      <div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 1, delay: 3.3 }}
        >
          Welcome to
        </motion.h1>
        <motion.img
          src="/title.png"
          alt=""
          className="landing-title"
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
            mass: 1,
            velocity: 2,
            delay: 2.6,
            duration: 0.2,
          }}
        />
        <motion.p
          class="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 1, delay: 3.3 }}
        >
          Your AI rubber duck coding companion
        </motion.p>
        <motion.button
          className="button"
          onClick={() => navigate("/debug")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 1, delay: 3.3 }}
        >
          Start Debugging
        </motion.button>
      </div>
      <motion.img
        src="/duck_closed.png"
        alt="Duck"
        className="landing-duck"
        layoutId="duck"
        variants={duckVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 1, scale: 0.5, x: -633, y: -300 }}
        layout="position"
        transition={{
          type: "spring",
          ease: "linear",
          duration: 1.75,
          delay: 0.2,
        }}
        // transition={{ delay: 0.2 }}
      />
    </div>
  );
};

export default LandingPage;
