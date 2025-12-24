const express = require("express");

const app = express();

app.use(express.json());

// ✅ Health check (مهم جدًا)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Matbakh Alyoum Backend is running 🚀");
});

// Railway PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
