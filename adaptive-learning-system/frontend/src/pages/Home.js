import React from "react";

function Home({ setPage }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "50px 20px",
      backgroundColor: "#FFF8DC",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1 style={{ 
        color: "#FF5733", 
        fontSize: "48px",
        marginBottom: "20px",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
      }}>
        🎮 Math Learning Game
      </h1>
      
      <p style={{
        fontSize: "18px",
        color: "#666",
        marginBottom: "40px",
        maxWidth: "600px"
      }}>
        Choose your grade level to start your math adventure!
      </p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setPage("grade2")} style={btnStyle("#6BCB77")}>
          Grade 2
        </button>

        <button onClick={() => setPage("grade3")} style={btnStyle("#4D96FF")}>
          Grade 3
        </button>

        <button onClick={() => setPage("grade4")} style={btnStyle("#FFD93D")}>
          Grade 4
        </button>
      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  padding: "20px 40px",
  fontSize: "24px",
  margin: "10px",
  backgroundColor: color,
  color: color === "#FFD93D" ? "#333" : "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  transition: "transform 0.2s, box-shadow 0.2s",
  minWidth: "150px"
});

export default Home;