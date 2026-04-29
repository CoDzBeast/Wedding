(function () {
  const DEFAULT_OVERLAY_CONFIG = {
    names: "Zach & Sam",
    date: "05.02.2026",
    shortDate: "05.02.26",
    hashtag: "#ZachAndSam",
    accentColor: "#D4AF37",
    textColor: "#FFFFFF",
  };

  function withShadow(ctx, blur, color, offsetY = 2) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = offsetY;
  }

  function clearShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  function drawCenteredText(ctx, text, x, y, size, font, color) {
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function drawText(ctx, text, x, y, size, font, color, align = "left") {
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 32, size / 32);
    ctx.beginPath();
    ctx.moveTo(0, 9);
    ctx.bezierCurveTo(-16, -6, -28, 10, 0, 27);
    ctx.bezierCurveTo(28, 10, 16, -6, 0, 9);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawLine(ctx, x1, y1, x2, y2, color, width) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function renderClassicStamp(ctx, w, h, options = {}) {
    const cfg = { ...DEFAULT_OVERLAY_CONFIG, ...options };
    const bottom = h - h * 0.07;
    const titleSize = w * 0.065;
    const smallSize = w * 0.032;
    const centerX = w / 2;

    ctx.save();
    withShadow(ctx, w * 0.018, "rgba(0,0,0,0.72)", h * 0.002);
    drawCenteredText(ctx, cfg.names, centerX, bottom - h * 0.115, titleSize, '"Great Vibes", "Brush Script MT", cursive', cfg.textColor);
    clearShadow(ctx);
    drawHeart(ctx, centerX, bottom - h * 0.067, w * 0.026, cfg.accentColor);
    withShadow(ctx, w * 0.014, "rgba(0,0,0,0.7)", h * 0.002);
    drawCenteredText(ctx, cfg.date, centerX, bottom - h * 0.025, smallSize, '"Lora", Georgia, serif', cfg.textColor);
    ctx.restore();
  }

  function renderPOVStamp(ctx, w, h, options = {}) {
    const cfg = { ...DEFAULT_OVERLAY_CONFIG, ...options };
    const top = h * 0.06;
    const medium = w * 0.042;
    const small = w * 0.032;
    const centerX = w / 2;

    ctx.save();
    withShadow(ctx, w * 0.018, "rgba(0,0,0,0.78)", h * 0.002);
    drawCenteredText(ctx, "POV: you're at", centerX, top + h * 0.035, small, '"Lora", Georgia, serif', cfg.textColor);
    drawCenteredText(ctx, "ZACH & SAM'S WEDDING", centerX, top + h * 0.085, medium, '"Playfair Display", Georgia, serif', cfg.textColor);
    clearShadow(ctx);
    drawLine(ctx, centerX - w * 0.14, top + h * 0.125, centerX + w * 0.14, top + h * 0.125, cfg.accentColor, Math.max(2, w * 0.005));
    withShadow(ctx, w * 0.014, "rgba(0,0,0,0.7)", h * 0.002);
    drawText(ctx, cfg.shortDate, w - w * 0.06, h - h * 0.07, small, '"Lora", Georgia, serif', cfg.textColor, "right");
    ctx.restore();
  }

  function renderFilmDateStamp(ctx, w, h, options = {}) {
    const cfg = { ...DEFAULT_OVERLAY_CONFIG, ...options };
    const padX = w * 0.06;
    const padTop = h * 0.06;
    const bottom = h - h * 0.07;
    const small = w * 0.032;
    const bracket = w * 0.075;
    const red = "#ff3b30";

    ctx.save();
    withShadow(ctx, w * 0.012, "rgba(0,0,0,0.72)", h * 0.0015);
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.arc(padX + small * 0.4, padTop + small * 0.15, small * 0.24, 0, Math.PI * 2);
    ctx.fill();
    drawText(ctx, cfg.shortDate, padX + small, padTop + small * 0.15, small, '"Lora", Georgia, serif', cfg.textColor);
    drawText(ctx, "Z + S", w - padX, bottom, small, '"Playfair Display", Georgia, serif', cfg.textColor, "right");
    clearShadow(ctx);

    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = Math.max(2, w * 0.004);
    ctx.beginPath();
    ctx.moveTo(padX, padTop + bracket);
    ctx.lineTo(padX, padTop);
    ctx.lineTo(padX + bracket, padTop);
    ctx.moveTo(w - padX - bracket, padTop);
    ctx.lineTo(w - padX, padTop);
    ctx.lineTo(w - padX, padTop + bracket);
    ctx.moveTo(padX, bottom - bracket);
    ctx.lineTo(padX, bottom);
    ctx.lineTo(padX + bracket, bottom);
    ctx.moveTo(w - padX - bracket, bottom);
    ctx.lineTo(w - padX, bottom);
    ctx.lineTo(w - padX, bottom - bracket);
    ctx.stroke();
    ctx.restore();
  }

  function renderPartyStamp(ctx, w, h, options = {}) {
    const cfg = { ...DEFAULT_OVERLAY_CONFIG, ...options };
    const centerX = w / 2;
    const bottom = h - h * 0.07;
    const large = w * 0.065;
    const medium = w * 0.042;
    const small = w * 0.032;
    const pink = "#FF9FB7";

    ctx.save();
    withShadow(ctx, w * 0.025, "rgba(255,159,183,0.5)", 0);
    drawCenteredText(ctx, "THE", centerX, bottom - h * 0.165, small, '"Lora", Georgia, serif', cfg.textColor);
    drawCenteredText(ctx, "After-I-Do", centerX, bottom - h * 0.105, large, '"Great Vibes", "Brush Script MT", cursive', pink);
    drawCenteredText(ctx, "PARTY", centerX, bottom - h * 0.055, medium, '"Playfair Display", Georgia, serif', cfg.textColor);
    clearShadow(ctx);
    withShadow(ctx, w * 0.014, "rgba(0,0,0,0.72)", h * 0.002);
    drawCenteredText(ctx, `ZACH & SAM • ${cfg.shortDate}`, centerX, bottom - h * 0.012, small, '"Lora", Georgia, serif', cfg.accentColor);
    ctx.restore();
  }

  // Add new filter cases here and keep each renderer percentage-based.
  function renderWeddingOverlay(ctx, width, height, filterName = "classic", options = {}) {
    if (!ctx || !width || !height) return;
    const normalized = String(filterName || "classic").toLowerCase();
    if (normalized === "pov") return renderPOVStamp(ctx, width, height, options);
    if (normalized === "film-date") return renderFilmDateStamp(ctx, width, height, options);
    if (normalized === "party") return renderPartyStamp(ctx, width, height, options);
    return renderClassicStamp(ctx, width, height, options);
  }

  window.WeddingOverlays = {
    DEFAULT_OVERLAY_CONFIG,
    renderWeddingOverlay,
    renderClassicStamp,
    renderPOVStamp,
    renderFilmDateStamp,
    renderPartyStamp,
  };
})();
