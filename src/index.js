const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Health check (for Railway + Dashboard)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ Root route (avoid 500 / blank)
app.get("/", (req, res) => {
  res.status(200).send("Matbakh Alyoum Backend is running.");
});

// ✅ Minimal API placeholders (so Dashboard doesn't break)
app.get("/api/orders", (req, res) => {
  res.json({ data: [], total: 0 });
});

app.get("/api/customers", (req, res) => {
  res.json({ data: [], total: 0 });
});

// Railway provides PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
