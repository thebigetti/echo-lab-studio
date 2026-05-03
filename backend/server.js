const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/request", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const contact = String(req.body.contact || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !contact || !message) {
    return res.status(400).json({ ok: false, error: "Заполните все поля." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: "Telegram token or chat id is not configured."
    });
  }

  const telegramMessage = [
    "Новая заявка Echo Lab Studio",
    "",
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    `Сообщение: ${message}`
  ].join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage
      })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return res.status(502).json({
        ok: false,
        error: data.description || "Telegram request failed."
      });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(502).json({ ok: false, error: "Telegram request failed." });
  }
});

app.listen(port, () => {
  console.log(`Echo Lab Studio backend listening on port ${port}`);
});
