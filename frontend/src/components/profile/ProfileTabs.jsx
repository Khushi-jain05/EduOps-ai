import { useState } from "react";

export default function ProfileTabs() {

  const [activeTab, setActiveTab] = useState("overview");

  return (

    <div className="profile-tabs">

      <button
        className={
          activeTab === "overview"
            ? "tab-btn active"
            : "tab-btn"
        }
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>

      <button
        className={
          activeTab === "security"
            ? "tab-btn active"
            : "tab-btn"
        }
        onClick={() => setActiveTab("security")}
      >
        Security
      </button>

      <button
        className={
          activeTab === "preferences"
            ? "tab-btn active"
            : "tab-btn"
        }
        onClick={() => setActiveTab("preferences")}
      >
        Preferences
      </button>

    </div>

  );
}