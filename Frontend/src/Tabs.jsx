import React from "react";

const Tabs = ({ activeTab, onTabClick }) => {
  return (
    <div className="tabs">
      <div
        className={`tab ${activeTab === "code" ? "active" : ""}`}
        onClick={() => onTabClick("code")}
      >
        CODE
      </div>
      <div
        className={`tab ${activeTab === "uml" ? "active" : ""}`}
        onClick={() => onTabClick("uml")}
      >
        UML
      </div>
    </div>
  );
};

export default Tabs;
