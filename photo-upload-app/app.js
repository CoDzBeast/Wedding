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
const videoPreview = document.getElementById('video-preview');
const form = document.getElementById('upload-form');
const mediaInput = document.getElementById('media-input');
const captureBtn = document.getElementById('capture-btn');
const switchCameraBtn = document.getElementById('switch-camera');
const galleryBtn = document.getElementById('gallery-btn');
const filtersToggle = document.getElementById('filters-toggle');
const filterSelector = document.getElementById('filter-selector');
const filterOptions = Array.from(document.querySelectorAll('.filter-option'));
const fullscreenControls = document.getElementById('fullscreen-controls');
const photoModeBtn = document.getElementById('photo-mode-btn');
const videoModeBtn = document.getElementById('video-mode-btn');
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
let capturedFile;
let previewUrl;
let filtersEnabled = false;
let activeFilter = 'classic';
let overlayAnimationFrame;
let lastOverlayFrameAt = 0;
let captureMode = 'photo';
let mediaRecorder;
let recordingCanvasStream;
let recordingAnimationFrame;
let lastRecordingFrameAt = 0;
let recordedChunks = [];
let recordingStartedAt = 0;
let recordingTimer;
const FRAME_INTERVAL = 1000 / 30;

const overlayConfig = {
  names: 'Zach & Sam',
  date: '05.02.2026',
  shortDate: '05.02.26',
  hashtag: '#ZachAndSam',
  accentColor: '#D4AF37',
  textColor: '#FFFFFF',
};

const controlHomes = {
  modeSwitch: document.querySelector('.mode-switch'),
  controls: document.querySelector('.controls'),
  modeParent: document.querySelector('.mode-switch').parentElement,
  controlsParent: document.querySelector('.controls').parentElement,
};

function restoreCameraControls() {
  document.querySelectorAll('.camera-square.fullscreen').forEach((box) => {
    box.classList.remove('fullscreen');
  });
  fullscreenControls.setAttribute('aria-hidden', 'true');
  if (controlHomes.controls.parentElement !== controlHomes.controlsParent) {
    controlHomes.controlsParent.appendChild(controlHomes.controls);
  }
  if (controlHomes.modeSwitch.parentElement !== controlHomes.modeParent) {
    controlHomes.modeParent.insertBefore(controlHomes.modeSwitch, controlHomes.controls);
  }
}

function showScreen(name) {
  restoreCameraControls();
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
  videoPreview.src = "";
  preview.classList.remove('hidden');
  videoPreview.classList.add('hidden');
}

function setVideoPreviewUrl(url) {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = url;
  videoPreview.src = url;
  preview.removeAttribute('src');
  preview.classList.add('hidden');
  videoPreview.classList.remove('hidden');
}

function showSelectedPreview() {
  const [file] = Array.from(mediaInput.files || []);
  if (!file) return;
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    mediaInput.value = '';
    throw new Error('Please choose image or video files only.');
  }
  capturedBlob = null;
  capturedFile = null;
  if (file.type.startsWith('video/')) setVideoPreviewUrl(URL.createObjectURL(file));
  else setPreviewUrl(URL.createObjectURL(file));
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

function isSelfieMode() {
  return facingMode === 'user';
}

function getCoverCrop(source, width, height) {
  const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
  if (!sourceWidth || !sourceHeight || !width || !height) return null;

  const targetRatio = width / height;
  const sourceRatio = sourceWidth / sourceHeight;
  if (sourceRatio > targetRatio) {
    const cropWidth = sourceHeight * targetRatio;
    return {
      sx: (sourceWidth - cropWidth) / 2,
      sy: 0,
      sw: cropWidth,
      sh: sourceHeight,
    };
  }

  const cropHeight = sourceWidth / targetRatio;
  return {
    sx: 0,
    sy: (sourceHeight - cropHeight) / 2,
    sw: sourceWidth,
    sh: cropHeight,
  };
}

function drawVideoCover(ctx, source, width, height, mirror = false) {
  const crop = getCoverCrop(source, width, height);
  if (!crop) return false;

  ctx.save();
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);
  ctx.restore();

  return true;
}

function drawFilteredFrame(ctx, source, width, height, filterName) {
  ctx.clearRect(0, 0, width, height);
  if (!drawVideoCover(ctx, source, width, height, isSelfieMode())) return false;
  const renderWeddingOverlay = getOverlayRenderer();
  if (renderWeddingOverlay) renderWeddingOverlay(ctx, width, height, filterName, overlayConfig);
  return true;
}

function drawCurrentCameraFrame(ctx, width, height) {
  if (filtersEnabled) return drawFilteredFrame(ctx, video, width, height, activeFilter);
  ctx.clearRect(0, 0, width, height);
  return drawVideoCover(ctx, video, width, height, isSelfieMode());
}

function paintOverlayFrame(timestamp = performance.now(), force = false) {
  if (!filtersEnabled || !screens.camera.classList.contains('active')) {
    return false;
  }

  if (force || timestamp - lastOverlayFrameAt >= FRAME_INTERVAL) {
    const ctx = overlayCanvas.getContext('2d');
    const { width, height } = sizeOverlayCanvas();
    if (drawFilteredFrame(ctx, video, width, height, activeFilter)) {
      lastOverlayFrameAt = timestamp;
    }
  }

  return true;
}

function drawOverlayFrame(timestamp = performance.now()) {
  if (!paintOverlayFrame(timestamp)) {
    overlayAnimationFrame = null;
    return;
  }
  overlayAnimationFrame = requestAnimationFrame(drawOverlayFrame);
}

function startOverlayLoop() {
  if (overlayAnimationFrame) return;
  lastOverlayFrameAt = 0;
  overlayCanvas.classList.remove('hidden');
  paintOverlayFrame(performance.now(), true);
  overlayAnimationFrame = requestAnimationFrame(drawOverlayFrame);
}

function stopOverlayLoop() {
  if (overlayAnimationFrame) cancelAnimationFrame(overlayAnimationFrame);
  overlayAnimationFrame = null;
  lastOverlayFrameAt = 0;
  const ctx = overlayCanvas.getContext('2d');
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  overlayCanvas.classList.add('hidden');
}

function updateFilterControls() {
  const canUseFilters = true;
  if (!canUseFilters) filtersEnabled = false;
  filtersToggle.disabled = !canUseFilters;
  filtersToggle.setAttribute('aria-pressed', String(filtersEnabled));
  filtersToggle.classList.toggle('active', filtersEnabled);
  filtersToggle.classList.toggle('disabled', !canUseFilters);
  filterSelector.classList.toggle('hidden', !filtersEnabled);
  filterOptions.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === activeFilter);
  });
  if (filtersEnabled && screens.camera.classList.contains('active')) {
    startOverlayLoop();
    paintOverlayFrame(performance.now(), true);
  } else {
    stopOverlayLoop();
  }
  paintRecordingFrame(performance.now(), true);
}

function updateModeControls() {
  photoModeBtn.classList.toggle('active', captureMode === 'photo');
  videoModeBtn.classList.toggle('active', captureMode === 'video');
  captureBtn.classList.toggle('video-mode', captureMode === 'video');
  captureBtn.setAttribute('aria-label', captureMode === 'video' ? 'Record video' : 'Take photo');
  updateFilterControls();
}

function setCaptureMode(mode) {
  if (mediaRecorder && mediaRecorder.state === 'recording') return;
  captureMode = mode;
  updateModeControls();
}

function enterFullscreenCamera(box) {
  box.classList.add('fullscreen');
  if (box.contains(fullscreenControls)) {
    fullscreenControls.setAttribute('aria-hidden', 'false');
    fullscreenControls.appendChild(controlHomes.modeSwitch);
    fullscreenControls.appendChild(controlHomes.controls);
  }
  setTimeout(() => {
    sizeOverlayCanvas();
    if (filtersEnabled) paintOverlayFrame(performance.now(), true);
  }, 120);
}

function exitFullscreenCamera(box) {
  box.classList.remove('fullscreen');
  fullscreenControls.setAttribute('aria-hidden', 'true');
  restoreCameraControls();
  setTimeout(() => {
    sizeOverlayCanvas();
    if (filtersEnabled) paintOverlayFrame(performance.now(), true);
  }, 120);
}

function toggleFullscreenCamera(box) {
  if (box.classList.contains('fullscreen')) exitFullscreenCamera(box);
  else enterFullscreenCamera(box);
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
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  drawCurrentCameraFrame(ctx, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    if (!blob) return;
    capturedBlob = blob;
    capturedFile = new File([blob], `guest-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setPreviewUrl(URL.createObjectURL(blob));
    showScreen('review');
  }, 'image/jpeg', 0.92);
}

function getSupportedVideoMime() {
  const choices = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  return choices.find((type) => window.MediaRecorder && MediaRecorder.isTypeSupported(type)) || '';
}

function updateRecordingLabel() {
  if (!recordingStartedAt) return;
  const elapsed = Math.floor((Date.now() - recordingStartedAt) / 1000);
  captureBtn.setAttribute('aria-label', `Stop recording, ${elapsed} seconds`);
}

function stopRecordingLoop() {
  if (recordingAnimationFrame) cancelAnimationFrame(recordingAnimationFrame);
  recordingAnimationFrame = null;
  lastRecordingFrameAt = 0;
}

function paintRecordingFrame(timestamp = performance.now(), force = false) {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return false;
  if (force || timestamp - lastRecordingFrameAt >= FRAME_INTERVAL) {
    const ctx = canvas.getContext('2d');
    drawCurrentCameraFrame(ctx, canvas.width, canvas.height);
    lastRecordingFrameAt = timestamp;
  }
  return true;
}

function drawRecordingFrame(timestamp = performance.now()) {
  if (!paintRecordingFrame(timestamp)) {
    recordingAnimationFrame = null;
    return;
  }
  recordingAnimationFrame = requestAnimationFrame(drawRecordingFrame);
}

function startRecording() {
  if (!stream || !window.MediaRecorder) {
    showError('Video Unavailable', 'This browser does not support in-browser video recording. You can still choose videos from your gallery.');
    return;
  }

  const mimeType = getSupportedVideoMime();
  canvas.width = 1080;
  canvas.height = 1080;
  drawCurrentCameraFrame(canvas.getContext('2d'), canvas.width, canvas.height);
  recordingCanvasStream = canvas.captureStream(30);
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(recordingCanvasStream, mimeType ? { mimeType } : undefined);
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) recordedChunks.push(event.data);
  };
  mediaRecorder.onstop = () => {
    clearInterval(recordingTimer);
    recordingTimer = null;
    recordingStartedAt = 0;
    captureBtn.classList.remove('recording');
    stopRecordingLoop();
    if (recordingCanvasStream) recordingCanvasStream.getTracks().forEach((track) => track.stop());
    recordingCanvasStream = null;

    const type = mediaRecorder.mimeType || mimeType || 'video/webm';
    const extension = type.includes('mp4') ? 'mp4' : 'webm';
    const blob = new Blob(recordedChunks, { type });
    capturedBlob = blob;
    capturedFile = new File([blob], `guest-${Date.now()}.${extension}`, { type });
    setVideoPreviewUrl(URL.createObjectURL(blob));
    showScreen('review');
  };

  mediaRecorder.start(1000);
  recordingStartedAt = Date.now();
  captureBtn.classList.add('recording');
  updateRecordingLabel();
  recordingTimer = setInterval(updateRecordingLabel, 500);
  paintRecordingFrame(performance.now(), true);
  recordingAnimationFrame = requestAnimationFrame(drawRecordingFrame);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
}

function handleCapturePress() {
  if (captureMode === 'video') {
    if (mediaRecorder && mediaRecorder.state === 'recording') stopRecording();
    else startRecording();
    return;
  }
  capturePhoto();
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
  if (!capturedBlob && !capturedFile && selectedFiles.length === 0) throw new Error('Capture or choose at least one file');
  if (selectedFiles.some((file) => !file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
    throw new Error('Please choose image or video files only.');
  }

  const files = [...selectedFiles];
  if (capturedFile) files.unshift(capturedFile);
  else if (capturedBlob) files.unshift(new File([capturedBlob], `guest-${Date.now()}.jpg`, { type: capturedBlob.type || 'image/jpeg' }));

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

captureBtn.addEventListener('click', handleCapturePress);
photoModeBtn.addEventListener('click', () => setCaptureMode('photo'));
videoModeBtn.addEventListener('click', () => setCaptureMode('video'));
filtersToggle.addEventListener('click', () => {
  filtersEnabled = !filtersEnabled;
  updateFilterControls();
});
filterOptions.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    updateFilterControls();
    if (filtersEnabled) paintOverlayFrame(performance.now(), true);
  });
});
switchCameraBtn.addEventListener('click', async () => {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startCamera();
});
retakeBtn.addEventListener('click', () => showScreen('camera'));
newPhotoBtn.addEventListener('click', async () => {
  capturedBlob = null;
  capturedFile = null;
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
  if (filtersEnabled) paintOverlayFrame(performance.now(), true);
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    sizeOverlayCanvas();
    if (filtersEnabled) paintOverlayFrame(performance.now(), true);
  }, 250);
});

document.querySelectorAll('.camera-square').forEach((box) => {
  box.addEventListener('click', (event) => {
    if (event.target.closest('button') || event.target.closest('.filter-selector') || event.target.closest('.fullscreen-controls')) return;
    toggleFullscreenCamera(box);
  });
});

form.addEventListener('submit', (e) => uploadPhoto(e).catch((err) => {
  showError('Upload Failed', err.message);
}).finally(() => {
  usePhotoBtn.disabled = false;
}));

updateFilterControls();
updateModeControls();
startCamera();
