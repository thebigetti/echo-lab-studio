const form = document.querySelector("#requestForm");
const statusEl = document.querySelector("#formStatus");
const hero = document.querySelector(".hero");
const matrixCanvas = document.querySelector("#matrix-canvas");
const pageMatrixCanvas = document.createElement("canvas");

pageMatrixCanvas.className = "matrix-layer";
pageMatrixCanvas.setAttribute("aria-hidden", "true");
document.body.prepend(pageMatrixCanvas);

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

const projectMenuTriggers = document.querySelectorAll(".project-menu-trigger");
const projectMenus = document.querySelectorAll(".project-menu");

function closeProjectMenus() {
  projectMenus.forEach((menu) => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menu.closest(".work-card")?.classList.remove("menu-open");
  });

  projectMenuTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
}

projectMenuTriggers.forEach((trigger) => {
  trigger.setAttribute("aria-expanded", "false");

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const menuName = trigger.dataset.projectMenu;
    const menu = document.querySelector(`[data-project-menu-panel="${menuName}"]`);
    const isOpen = menu?.classList.contains("is-open");

    closeProjectMenus();

    if (!menu || isOpen) {
      return;
    }

    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    trigger.closest(".work-card")?.classList.add("menu-open");
  });
});

projectMenus.forEach((menu) => {
  menu.addEventListener("click", (event) => {
    event.stopPropagation();

    if (event.target.closest('a[href="#"]')) {
      event.preventDefault();
    }
  });
});

document.addEventListener("click", closeProjectMenus);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectMenus();
  }
});

const videoModal = document.querySelector("#videoModal");
const videoModalTitle = document.querySelector("#videoModalTitle");
const videoPlayer = document.querySelector(".video-modal-player");
const videoGalleryModal = document.querySelector("#videoGalleryModal");
const videoGalleryTrigger = document.querySelector(".video-gallery-trigger");
const panelTriggers = document.querySelectorAll(".panel-trigger");
const casePanelModals = document.querySelectorAll(".case-panel-modal");

function closeCasePanels() {
  casePanelModals.forEach((panel) => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  });

  if (!videoModal?.classList.contains("is-open") && !videoGalleryModal?.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function openCasePanel(panelName) {
  const panel = document.querySelector(`[data-panel-modal="${panelName}"]`);

  if (!panel) {
    return;
  }

  closeProjectMenus();
  closeVideoGallery();
  closeVideoModal();
  closeCasePanels();
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openVideoModal(src, title) {
  if (!videoModal || !videoPlayer) {
    return;
  }

  closeProjectMenus();
  closeVideoGallery();
  closeCasePanels();

  if (videoModalTitle) {
    videoModalTitle.textContent = title || "Видео";
  }

  videoPlayer.src = src;
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeVideoModal() {
  if (!videoModal || !videoPlayer) {
    return;
  }

  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");

  if (!videoGalleryModal?.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function openVideoGallery() {
  if (!videoGalleryModal) {
    return;
  }

  closeProjectMenus();
  closeCasePanels();
  videoGalleryModal.classList.add("is-open");
  videoGalleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeVideoGallery() {
  if (!videoGalleryModal) {
    return;
  }

  videoGalleryModal.classList.remove("is-open");
  videoGalleryModal.setAttribute("aria-hidden", "true");

  if (!videoModal?.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }
}

document.querySelectorAll(".video-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openVideoModal(trigger.dataset.videoSrc, trigger.dataset.videoTitle);
  });
});

if (videoGalleryTrigger) {
  videoGalleryTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openVideoGallery();
  });
}

document.querySelectorAll("[data-video-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeVideoModal);
});

document.querySelectorAll("[data-gallery-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeVideoGallery);
});

panelTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openCasePanel(trigger.dataset.panel);
  });
});

document.querySelectorAll("[data-panel-close]").forEach((trigger) => {
  trigger.addEventListener("click", closeCasePanels);
});

casePanelModals.forEach((panel) => {
  panel.addEventListener("click", (event) => {
    if (event.target.closest('a[href="#"]')) {
      event.preventDefault();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideoModal();
    closeVideoGallery();
    closeCasePanels();
  }
});

function initHeroMatrix() {
  const container = document.querySelector(".hero-matrix");

  if (!container) {
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];

  container.appendChild(canvas);

  function resize() {
    const rect = container.getBoundingClientRect();

    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = width;
    canvas.height = height;
    columns = Math.ceil(width / 22);
    drops = Array.from({ length: columns }, () => 0);
  }

  function draw() {
    ctx.fillStyle = "rgba(5, 10, 20, 0.035)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 255, 136, 0.55)";
    ctx.font = "16px monospace";

    for (let i = 0; i < columns; i += 1) {
      const symbol = Math.random() > 0.5 ? "0" : "1";
      const x = i * 22;
      const y = drops[i] * 22;

      ctx.fillText(symbol, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += 0.75;
      }
    }
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  loop();
  window.addEventListener("resize", resize);
}

initHeroMatrix();

if (hero && matrixCanvas && !document.querySelector(".hero-matrix")) {
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

if (pageMatrixCanvas) {
  const pageCtx = pageMatrixCanvas.getContext("2d");
  const pageSymbols = ["0", "1", "SYS", "VPN", "AI", "ROUTE", "RENDER", "NET", "ACCESS", "MEDIA"];
  const brickLabels = ["0101", "VPN", "SYS", "ROUTE", "AI", "RENDER", "NET", "MEDIA"];
  let pageColumns = [];
  let digitalBricks = [];
  let pageFrame = 0;

  function getPageHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    );
  }

  function getColumnCount(width) {
    if (width < 560) {
      return Math.max(4, Math.min(6, Math.round(width / 86)));
    }

    return Math.max(10, Math.min(16, Math.round(width / 104)));
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    const corner = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + corner, y);
    ctx.lineTo(x + width - corner, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + corner);
    ctx.lineTo(x + width, y + height - corner);
    ctx.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
    ctx.lineTo(x + corner, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - corner);
    ctx.lineTo(x, y + corner);
    ctx.quadraticCurveTo(x, y, x + corner, y);
    ctx.closePath();
  }

  function resizePageMatrix() {
    const width = window.innerWidth;
    const height = getPageHeight();
    const ratio = window.devicePixelRatio || 1;
    const columnCount = getColumnCount(width);

    pageMatrixCanvas.width = Math.max(1, Math.floor(width * ratio));
    pageMatrixCanvas.height = Math.max(1, Math.floor(height * ratio));
    pageMatrixCanvas.style.width = `${width}px`;
    pageMatrixCanvas.style.height = `${height}px`;
    pageCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

    pageColumns = Array.from({ length: columnCount }, (_, index) => {
      const gap = 150 + Math.random() * 120;

      return {
        x: ((index + 0.5) / columnCount) * width + (Math.random() - 0.5) * 42,
        y: Math.random() * height,
        gap,
        speed: 0.18 + Math.random() * 0.22,
        alpha: 0.06 + Math.random() * 0.08,
        cyan: Math.random() > 0.76
      };
    });

    digitalBricks = Array.from({ length: width < 560 ? 5 : 9 }, () => ({
      x: Math.random() * Math.max(1, width - 112),
      y: 180 + Math.random() * Math.max(1, height - 360),
      label: brickLabels[Math.floor(Math.random() * brickLabels.length)],
      alpha: 0.045 + Math.random() * 0.045
    }));
  }

  function drawPageMatrix() {
    pageFrame += 1;

    if (pageFrame % 4 === 0) {
      const width = pageMatrixCanvas.width / (window.devicePixelRatio || 1);
      const height = pageMatrixCanvas.height / (window.devicePixelRatio || 1);

      pageCtx.clearRect(0, 0, width, height);
      pageCtx.font = "13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      pageCtx.textBaseline = "top";

      pageColumns.forEach((column) => {
        const color = column.cyan ? "106, 215, 255" : "0, 255, 136";
        pageCtx.fillStyle = `rgba(${color}, ${column.alpha})`;

        for (let y = column.y - height; y < height; y += column.gap) {
          if (y < -24) {
            continue;
          }

          const text = pageSymbols[Math.floor(Math.random() * pageSymbols.length)];
          pageCtx.fillText(text, column.x, y);
        }

        column.y += column.speed;

        if (column.y > height + column.gap) {
          column.y = 0;
        }
      });

      digitalBricks.forEach((brick) => {
        const textWidth = pageCtx.measureText(brick.label).width;
        const brickWidth = textWidth + 24;

        drawRoundedRect(pageCtx, brick.x, brick.y, brickWidth, 26, 10);
        pageCtx.fillStyle = `rgba(106, 215, 255, ${brick.alpha})`;
        pageCtx.fill();
        pageCtx.strokeStyle = `rgba(0, 255, 136, ${brick.alpha + 0.025})`;
        pageCtx.stroke();
        pageCtx.fillStyle = `rgba(0, 255, 136, ${Math.min(0.14, brick.alpha + 0.05)})`;
        pageCtx.fillText(brick.label, brick.x + 12, brick.y + 7);
      });
    }

    requestAnimationFrame(drawPageMatrix);
  }

  resizePageMatrix();
  drawPageMatrix();
  window.addEventListener("resize", resizePageMatrix);
  window.addEventListener("load", resizePageMatrix);

  if ("ResizeObserver" in window) {
    const pageResizeObserver = new ResizeObserver(resizePageMatrix);
    pageResizeObserver.observe(document.body);
  }
}
