import React, { createContext, useState } from "react";

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    grade2: 1,
    grade3: 1,
    grade4: 1,
  });

  const completeActivity = (grade, id) => {
    setProgress((prev) => {
      if (id >= prev[grade]) {
        return { ...prev, [grade]: id + 1 };
      }
      return prev;
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, completeActivity }}>
      {children}
    </ProgressContext.Provider>
  );
};