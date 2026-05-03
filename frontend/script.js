const form = document.querySelector("#requestForm");
const statusEl = document.querySelector("#formStatus");
const hero = document.querySelector(".hero");
const matrixCanvas = document.querySelector("#matrix-canvas");

function getApiUrl() {
  if (window.location.protocol === "file:") {
    return "http://localhost:3000/api/request";
  }

  return "/api/request";
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status ${type || ""}`.trim();
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name").trim(),
      contact: formData.get("contact").trim(),
      message: formData.get("message").trim()
    };

    setStatus("Отправляю заявку...", "");

    try {
      const response = await fetch(getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Не удалось отправить заявку. Проверьте контакт и попробуйте еще раз.");
      }

      form.reset();
      setStatus("Заявка отправлена в Telegram. Спасибо!", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
}

if (hero && matrixCanvas) {
  const ctx = matrixCanvas.getContext("2d");
  const symbols = "01 VPN DNS AI ROUTE BOT";
  let columns = [];
  let fontSize = 18;
  let frame = 0;

  function resizeMatrix() {
    const rect = hero.getBoundingClientRect();
    const density = window.innerWidth < 560 ? 34 : 26;
    const ratio = window.devicePixelRatio || 1;

    matrixCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
    matrixCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
    matrixCanvas.style.width = `${rect.width}px`;
    matrixCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    fontSize = density;
    const count = Math.ceil(rect.width / fontSize);
    columns = Array.from({ length: count }, () => Math.random() * rect.height);
  }

  function drawMatrix() {
    frame += 1;

    if (frame % 3 === 0) {
      const width = matrixCanvas.width / (window.devicePixelRatio || 1);
      const height = matrixCanvas.height / (window.devicePixelRatio || 1);

      ctx.fillStyle = "rgba(7, 10, 16, 0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0, 255, 136, 0.55)";
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

      columns.forEach((y, index) => {
        if (Math.random() > 0.38) {
          return;
        }

        const text = symbols[Math.floor(Math.random() * symbols.length)];
        const x = index * fontSize;
        ctx.fillText(text, x, y);
        columns[index] = y > height + Math.random() * 220 ? 0 : y + fontSize * 0.72;
      });
    }

    requestAnimationFrame(drawMatrix);
  }

  resizeMatrix();
  drawMatrix();
  window.addEventListener("resize", resizeMatrix);
}
