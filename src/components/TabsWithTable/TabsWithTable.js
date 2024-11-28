/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Table from "../Table/Table";

const TabsWithTable = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = Object.keys(data);

  const formatLabels = (label) => {
    if (label === "habilitao") {
      return "habilitação";
    } else return label;
  };
  return (
    <div style={styles.container}>
      <div style={styles.tabHeader}>
        {tabLabels.map((label, index) => (
          <button
            key={index}
            aria-selected={index === activeTab}
            style={{
              ...styles.tabButton,
              ...(index === activeTab ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab(index)}
          >
            {formatLabels(label).charAt(0).toUpperCase() +
              formatLabels(label).slice(1)}
          </button>
        ))}
      </div>
      <div style={styles.tabContent}>
        <Table dados={data[tabLabels[activeTab]]} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Roboto, Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  tabHeader: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
    borderBottom: "2px solid #1d4a5d",
  },
  tabButton: {
    flex: 1,
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#f5f5f5",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#1d4a5d",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  activeTabButton: {
    backgroundColor: "#ffffff",
    borderBottom: "2px solid #1d4a5d",
    color: "#1d4a5d",
  },
  tabContent: {
    padding: "20px",
  },
};

export default TabsWithTable;
