import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import DuckDuckDebug from "./Debugger";
import LandingPage from "./LandingPage";
import "./LandingPage.css";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   transition={{ duration: 0.5 }}
            >
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/debug"
          element={
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "relative" }}
              >
                <DuckDuckDebug />
              </motion.div>
              <motion.img
                src="/duck_closed.png"
                layoutId="debug-duck"
                initial={{ opacity: 1, scale: 0.5, x: -15, y: -930 }}
                style={{ opacity: 1 }}
                layout
                className="landing-duck"
              />
            </div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <Router>
    <AnimatedRoutes />
  </Router>
);

export default App;
