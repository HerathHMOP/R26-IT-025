import React, { useContext } from "react";
import activities from "../data/activities";
import { ProgressContext } from "../context/ProgressContext";

function Grade2({ setPage }) {
  const { progress } = useContext(ProgressContext);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#FFF8DC",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#FF5733" }}>
        🎈 Grade 2 Activities
      </h2>

      {/* Activities List */}
      {activities.grade2.map((item) => {
        const unlocked = item.id <= progress.grade2;

        return (
          <div
            key={item.id}
            onClick={() => {
              if (!unlocked) return;

              // Navigate based on activity ID
              if (item.id === 1) setPage("fruitBasket");
              // Later we will add more:
              // if (item.id === 2) setPage("balloonGame");
            }}
            style={{
              padding: "15px",
              margin: "10px",
              borderRadius: "15px",
              backgroundColor: unlocked ? "#6BCB77" : "#ccc",
              textAlign: "center",
              cursor: unlocked ? "pointer" : "not-allowed",
              fontSize: "18px",
              fontWeight: "bold",
              boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {item.title}
            {!unlocked && <span> 🔒</span>}
          </div>
        );
      })}

      {/* Back Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => setPage("home")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "10px",
            backgroundColor: "#4D96FF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

export default Grade2;