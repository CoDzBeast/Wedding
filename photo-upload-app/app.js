const UPLOAD_URL = '/api/upload';

const screens = {
  camera: document.getElementById('camera-screen'),
  review: document.getElementById('review-screen'),
  success: document.getElementById('success-screen'),
  error: document.getElementById('error-screen'),
};

const video = document.getElementById('camera');
const canvas = document.getElementById('capture-canvas');
const overlayCanvas = document.getElementById('overlay-canvas');
const preview = document.getElementById('preview');
const form = document.getElementById('upload-form');
const mediaInput = document.getElementById('media-input');
const captureBtn = document.getElementById('capture-btn');
const switchCameraBtn = document.getElementById('switch-camera');
const galleryBtn = document.getElementById('gallery-btn');
const filtersToggle = document.getElementById('filters-toggle');
const filterSelector = document.getElementById('filter-selector');
const filterOptions = Array.from(document.querySelectorAll('.filter-option'));
const retakeBtn = document.getElementById('retake-btn');
const newPhotoBtn = document.getElementById('new-photo-btn');
const fallbackLink = document.getElementById('fallback-link');
const errorTitle = document.getElementById('error-title');
const errorGalleryBtn = document.getElementById('error-gallery-btn');
const errorMessage = document.getElementById('error-message');
const progressWrap = document.getElementById('upload-progress-wrap');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const progressLabel = document.getElementById('progress-label');
const usePhotoBtn = document.getElementById('use-photo-btn');

let stream;
let facingMode = 'environment';
let capturedBlob;
let previewUrl;
let filtersEnabled = false;
let activeFilter = 'classic';
let overlayAnimationFrame;

const overlayConfig = {
  names: 'Zach & Sam',
  date: '05.02.2026',
  shortDate: '05.02.26',
  hashtag: '#ZachAndSam',
  accentColor: '#D4AF37',
  textColor: '#FFFFFF',
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[name].classList.add('active');
  if (name === 'camera' && filtersEnabled) {
    startOverlayLoop();
  } else if (name !== 'camera') {
    stopOverlayLoop();
  }
}

function showError(title, message) {
  errorTitle.textContent = title;
  errorMessage.textContent = message;
  showScreen('error');
}

function setProgress(percent, label) {
  progressWrap.classList.remove('hidden');
  progressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  progressPercent.textContent = `${Math.round(percent)}%`;
  progressLabel.textContent = label;
}

function setPreviewUrl(url) {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = url;
  preview.src = url;
}

function showSelectedPreview() {
  const [file] = Array.from(mediaInput.files || []);
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    mediaInput.value = '';
    throw new Error('Please choose image files only.');
  }
  capturedBlob = null;
  setPreviewUrl(URL.createObjectURL(file));
  showScreen('review');
}

function getOverlayRenderer() {
  return window.WeddingOverlays && window.WeddingOverlays.renderWeddingOverlay;
}

function sizeOverlayCanvas() {
  const rect = overlayCanvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * scale));
  const height = Math.max(1, Math.round(rect.height * scale));
  if (overlayCanvas.width !== width || overlayCanvas.height !== height) {
    overlayCanvas.width = width;
    overlayCanvas.height = height;
  }
  return { width, height };
}

function drawOverlayFrame() {
  const ctx = overlayCanvas.getContext('2d');
  const { width, height } = sizeOverlayCanvas();
  ctx.clearRect(0, 0, width, height);

  if (filtersEnabled && screens.camera.classList.contains('active')) {
    const renderWeddingOverlay = getOverlayRenderer();
    if (renderWeddingOverlay) renderWeddingOverlay(ctx, width, height, activeFilter, overlayConfig);
    overlayAnimationFrame = requestAnimationFrame(drawOverlayFrame);
  }
}

function startOverlayLoop() {
  if (overlayAnimationFrame) return;
  overlayCanvas.classList.remove('hidden');
  drawOverlayFrame();
}

function stopOverlayLoop() {
  if (overlayAnimationFrame) cancelAnimationFrame(overlayAnimationFrame);
  overlayAnimationFrame = null;
  const ctx = overlayCanvas.getContext('2d');
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  if (!filtersEnabled) overlayCanvas.classList.add('hidden');
}

function updateFilterControls() {
  filtersToggle.setAttribute('aria-pressed', String(filtersEnabled));
  filtersToggle.classList.toggle('active', filtersEnabled);
  filterSelector.classList.toggle('hidden', !filtersEnabled);
  filterOptions.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === activeFilter);
  });
  if (filtersEnabled && screens.camera.classList.contains('active')) {
    startOverlayLoop();
  } else {
    stopOverlayLoop();
  }
}

async function startCamera() {
  try {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facingMode }, width: { ideal: 1080 }, height: { ideal: 1080 } },
      audio: false,
    });
    video.srcObject = stream;
    showScreen('camera');
    sizeOverlayCanvas();
    updateFilterControls();
  } catch (_error) {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    fallbackLink.href = '#';
    showError('Choose Photos', 'Camera access is blocked or unavailable. You can still upload photos from your gallery.');
    errorGalleryBtn.focus();
  }
}

function capturePhoto() {
  const size = Math.min(video.videoWidth, video.videoHeight);
  const sx = (video.videoWidth - size) / 2;
  const sy = (video.videoHeight - size) / 2;
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, sx, sy, size, size, 0, 0, 1080, 1080);
  if (filtersEnabled) {
    const renderWeddingOverlay = getOverlayRenderer();
    if (renderWeddingOverlay) renderWeddingOverlay(ctx, canvas.width, canvas.height, activeFilter, overlayConfig);
  }
  canvas.toBlob((blob) => {
    if (!blob) return;
    capturedBlob = blob;
    setPreviewUrl(URL.createObjectURL(blob));
    showScreen('review');
  }, 'image/jpeg', 0.92);
}

function uploadWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fallbackTimers = [
      setTimeout(() => onProgress(15), 400),
      setTimeout(() => onProgress(35), 1200),
      setTimeout(() => onProgress(65), 3000),
    ];
    const settle = () => fallbackTimers.forEach((timer) => clearTimeout(timer));

    xhr.open('POST', UPLOAD_URL);
    onProgress(5);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        onProgress(90);
        return;
      }
      const percent = (event.loaded / event.total) * 100;
      onProgress(Math.min(percent, 99));
    };
    xhr.onload = () => {
      settle();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
        return;
      }

      let message = `Upload failed (${xhr.status})`;
      try {
        const body = JSON.parse(xhr.responseText);
        message = body?.error?.message || body?.message || message;
      } catch (_error) {}
      reject(new Error(message));
    };
    xhr.onerror = () => {
      settle();
      reject(new Error('Network error while uploading'));
    };
    xhr.send(formData);
  });
}

async function uploadPhoto(e) {
  e.preventDefault();
  usePhotoBtn.disabled = true;
  const selectedFiles = Array.from(mediaInput.files || []);
  if (!capturedBlob && selectedFiles.length === 0) throw new Error('Capture or choose at least one file');
  if (selectedFiles.some((file) => !file.type.startsWith('image/'))) throw new Error('Please choose image files only.');

  const files = [...selectedFiles];
  if (capturedBlob) files.unshift(new File([capturedBlob], `guest-${Date.now()}.jpg`, { type: 'image/jpeg' }));

  progressWrap.classList.remove('hidden');
  setProgress(0, `Preparing ${files.length} file${files.length === 1 ? '' : 's'}...`);

  let completed = 0;
  for (const file of files) {
    const formData = new FormData(form);
    formData.delete('media');
    formData.append('files', file, file.name);
    await uploadWithProgress(formData, (percent) => {
      const totalPercent = Math.max(
        completed === 0 ? 0 : (completed / files.length) * 100,
        ((completed + percent / 100) / files.length) * 100
      );
      setProgress(totalPercent, `Uploading ${completed + 1} of ${files.length}`);
    });
    completed += 1;
    setProgress((completed / files.length) * 100, `Uploading ${completed} of ${files.length}`);
  }

  setProgress(100, 'Upload complete');
  showScreen('success');
}

captureBtn.addEventListener('click', capturePhoto);
filtersToggle.addEventListener('click', () => {
  filtersEnabled = !filtersEnabled;
  updateFilterControls();
});
filterOptions.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    updateFilterControls();
    if (filtersEnabled) drawOverlayFrame();
  });
});
switchCameraBtn.addEventListener('click', async () => {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startCamera();
});
retakeBtn.addEventListener('click', () => showScreen('camera'));
newPhotoBtn.addEventListener('click', async () => {
  capturedBlob = null;
  mediaInput.value = '';
  progressWrap.classList.add('hidden');
  progressFill.style.width = '0%';
  progressPercent.textContent = '0%';
  progressLabel.textContent = 'Uploading...';
  await startCamera();
});
galleryBtn.addEventListener('click', () => {
  mediaInput.click();
});
errorGalleryBtn.addEventListener('click', () => {
  mediaInput.click();
});
fallbackLink.addEventListener('click', (event) => {
  event.preventDefault();
  mediaInput.click();
});
mediaInput.addEventListener('change', () => {
  try {
    if ((mediaInput.files || []).length > 0) showSelectedPreview();
  } catch (err) {
    showError('Photo Selection Failed', err.message);
  }
});

window.addEventListener('resize', () => {
  sizeOverlayCanvas();
  if (filtersEnabled) drawOverlayFrame();
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    sizeOverlayCanvas();
    if (filtersEnabled) drawOverlayFrame();
  }, 250);
});

form.addEventListener('submit', (e) => uploadPhoto(e).catch((err) => {
  showError('Upload Failed', err.message);
}).finally(() => {
  usePhotoBtn.disabled = false;
}));

updateFilterControls();
startCamera();
