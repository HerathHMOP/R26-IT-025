const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true
  })
);
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (_req, res) => {
  res.json({ service: "lms-backend", status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
