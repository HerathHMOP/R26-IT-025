import React, { useContext } from "react";
import activities from "../data/activities";
import { ProgressContext } from "../context/ProgressContext";

function Grade4({ setPage }) {
  const { progress } = useContext(ProgressContext);

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFF3E0", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#FFD93D", marginBottom: "30px" }}>🧠 Grade 4 Activities</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", maxWidth: "1000px", margin: "0 auto" }}>
        {activities.grade4.map((item) => {
          const unlocked = item.id <= progress.grade4;

          return (
            <div key={item.id} style={{
              padding: "15px",
              borderRadius: "10px",
              backgroundColor: unlocked ? "#FFD93D" : "#e0e0e0",
              textAlign: "center",
              cursor: unlocked ? "pointer" : "not-allowed",
              color: unlocked ? "#333" : "#999",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: unlocked ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}>
              {item.title}
              {!unlocked && " 🔒"}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => setPage("home")} style={{
          padding: "15px 30px",
          fontSize: "18px",
          backgroundColor: "#FF5733",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>⬅ Back to Home</button>
      </div>
    </div>
  );
}

export default Grade4;
