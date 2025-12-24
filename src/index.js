const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ✅ Webhook verification (Meta needs this)
app.get("/webhooks/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ✅ Webhook receiver (later for messages)
app.post("/webhooks/whatsapp", async (req, res) => {
  try {
    const entry = req.body.entry || [];
    for (const e of entry) {
      for (const change of e.changes || []) {
        const value = change.value;
        const messages = value?.messages || [];
        const phoneId = value?.metadata?.phone_number_id;

        for (const msg of messages) {
          const from = msg.from;
          const text = msg.text?.body;

          // 👋 رسالة ترحيب بسيطة
          await axios.post(
            `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
            {
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: { body: "أهلاً وسهلاً بك 🌟\nتم استلام رسالتك وسنخدمك فورًا." }
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
              }
            }
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Send error:", err?.response?.data || err.message);
    res.sendStatus(200);
  }
});

// Root
app.get("/", (req, res) => {
  res.send("Matbakh Alyoum Backend is running 🚀");
});

// Railway PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
