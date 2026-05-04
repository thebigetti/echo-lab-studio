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
  const symbols = ["0101", "VPN", "AI", "NET", "SYS", "RENDER", "ROUTE", "1010", "IO"];
  let columns = [];
  let fontSize = 14;
  let frame = 0;

  function resizeMatrix() {
    const rect = hero.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const columnCount = Math.max(8, Math.min(14, Math.round(rect.width / 110)));

    matrixCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
    matrixCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
    matrixCanvas.style.width = `${rect.width}px`;
    matrixCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    fontSize = window.innerWidth < 560 ? 12 : 14;
    columns = Array.from({ length: columnCount }, (_, index) => {
      const gap = 34 + Math.random() * 34;

      return {
        x: Math.max(8, Math.min(rect.width - 72, ((index + 0.5) / columnCount) * rect.width + (Math.random() - 0.5) * 36)),
        y: -Math.random() * gap,
        speed: 0.18 + Math.random() * 0.24,
        gap,
        alpha: 0.28 + Math.random() * 0.32
      };
    });
  }

  function drawMatrix() {
    frame += 1;

    if (frame % 5 === 0) {
      const width = matrixCanvas.width / (window.devicePixelRatio || 1);
      const height = matrixCanvas.height / (window.devicePixelRatio || 1);

      ctx.fillStyle = "rgba(3, 7, 17, 0.11)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";

      columns.forEach((column) => {
        ctx.fillStyle = `rgba(32, 226, 138, ${column.alpha})`;

        for (let y = column.y; y < height; y += column.gap) {
          if (Math.random() > 0.66) {
            continue;
          }

          const text = symbols[Math.floor(Math.random() * symbols.length)];
          ctx.fillText(text, column.x, y);
        }

        column.y += fontSize * column.speed;

        if (column.y > column.gap) {
          column.y = -column.gap;
        }
      });
    }

    requestAnimationFrame(drawMatrix);
  }

  resizeMatrix();
  drawMatrix();
  window.addEventListener("resize", resizeMatrix);

  if ("ResizeObserver" in window) {
    const matrixResizeObserver = new ResizeObserver(resizeMatrix);
    matrixResizeObserver.observe(hero);
  }
}
