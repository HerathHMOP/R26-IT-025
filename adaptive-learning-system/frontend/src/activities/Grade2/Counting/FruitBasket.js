import React, { useState, useContext } from "react";
import { ProgressContext } from "../../../context/ProgressContext";

function FruitBasket({ setPage }) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const { completeActivity } = useContext(ProgressContext);

  const addFruit = () => {
    const newCount = count + 1;
    setCount(newCount);

    // When student reaches 5 fruits → complete activity
    if (newCount === 5) {
      setMessage("🎉 Great Job!");
      completeActivity("grade2", 1); // Unlock next activity
    }
  };

  return (
    <div style={{
      textAlign: "center",
      padding: "30px",
      backgroundColor: "#FFF8DC",
      height: "100vh"
    }}>
      <h1 style={{ color: "#FF5733" }}>🍎 Fruit Basket</h1>

      <h2>Click fruits to count!</h2>

      <h2 style={{ fontSize: "30px" }}>Count: {count}</h2>

      {/* Fruit buttons */}
      <div>
        <button onClick={addFruit} style={fruitStyle}>🍎</button>
        <button onClick={addFruit} style={fruitStyle}>🍌</button>
        <button onClick={addFruit} style={fruitStyle}>🍇</button>
      </div>

      <h2 style={{ marginTop: "20px", color: "green" }}>{message}</h2>

      <button
        onClick={() => setPage("grade2")}
        style={{
          marginTop: "20px",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: "#4D96FF",
          color: "white",
          border: "none"
        }}
      >
        ⬅ Back
      </button>
    </div>
  );
}

const fruitStyle = {
  fontSize: "40px",
  margin: "10px",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer"
};

export default FruitBasket;