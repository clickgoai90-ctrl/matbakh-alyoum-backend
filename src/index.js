const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* =========================
   Health Check (Railway)
========================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   Root (avoid 502 / 500)
========================= */
app.get("/", (req, res) => {
  res.status(200).send("Matbakh Alyoum Backend is running 🚀");
});

/* =========================
   WhatsApp Webhook Verification (GET)
========================= */
app.get("/webhooks/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully");
    return res.status(200).send(challenge);
  }

  console.warn("❌ Webhook verification failed");
  return res.sendStatus(403);
});

/* =========================
   WhatsApp Webhook Receiver (POST)
========================= */
app.post("/webhooks/whatsapp", (req, res) => {
  try {
    const entry = req.body.entry || [];

    entry.forEach((item) => {
      item.changes.forEach((change) => {
        const value = change.value;

        if (value.messages) {
          value.messages.forEach((message) => {
            console.log("📩 Incoming WhatsApp Message:");
            console.log(JSON.stringify(message, null, 2));
          });
        }
      });
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    res.sendStatus(500);
  }
});

/* =========================
   API placeholders (Dashboard-safe)
========================= */
app.get("/api/orders", (req, res) => {
  res.json({ data: [], total: 0 });
});

app.get("/api/customers", (req, res) => {
  res.json({ data: [], total: 0 });
});

/* =========================
   Start Server (Railway PORT)
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
