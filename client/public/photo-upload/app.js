const UPLOAD_URL = '/api/upload';

const screens = {
  camera: document.getElementById('camera-screen'),
  review: document.getElementById('review-screen'),
  success: document.getElementById('success-screen'),
  error: document.getElementById('error-screen'),
};

const video = document.getElementById('camera');
const canvas = document.getElementById('capture-canvas');
const preview = document.getElementById('preview');
const form = document.getElementById('upload-form');
const mediaInput = document.getElementById('media-input');
const captureBtn = document.getElementById('capture-btn');
const switchCameraBtn = document.getElementById('switch-camera');
const galleryBtn = document.getElementById('gallery-btn');
const retakeBtn = document.getElementById('retake-btn');
const newPhotoBtn = document.getElementById('new-photo-btn');
const fallbackLink = document.getElementById('fallback-link');
const errorMessage = document.getElementById('error-message');
const progressWrap = document.getElementById('upload-progress-wrap');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const progressLabel = document.getElementById('progress-label');

let stream;
let facingMode = 'environment';
let capturedBlob;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[name].classList.add('active');
}

function setProgress(percent, label) {
  progressWrap.classList.remove('hidden');
  progressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  progressPercent.textContent = `${Math.round(percent)}%`;
  progressLabel.textContent = label;
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
  } catch (_error) {
    errorMessage.textContent = 'Camera permission blocked or unavailable in this browser.';
    fallbackLink.href = 'intent://camera#Intent;scheme=android-app;end';
    showScreen('error');
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
  canvas.toBlob((blob) => {
    if (!blob) return;
    capturedBlob = blob;
    preview.src = URL.createObjectURL(blob);
    showScreen('review');
  }, 'image/jpeg', 0.92);
}

function uploadWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_URL);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        onProgress(90);
        return;
      }
      const percent = (event.loaded / event.total) * 100;
      onProgress(Math.min(percent, 99));
    };
    xhr.onload = () => {
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
    xhr.onerror = () => reject(new Error('Network error while uploading'));
    xhr.send(formData);
  });
}

async function uploadPhoto(e) {
  e.preventDefault();
  const selectedFiles = Array.from(mediaInput.files || []);
  if (!capturedBlob && selectedFiles.length === 0) throw new Error('Capture or choose at least one file');

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
      const totalPercent = ((completed + percent / 100) / files.length) * 100;
      setProgress(totalPercent, `Uploading ${completed + 1} of ${files.length}`);
    });
    completed += 1;
    setProgress((completed / files.length) * 100, `Uploading ${completed} of ${files.length}`);
  }

  setProgress(100, 'Upload complete');
  showScreen('success');
}

captureBtn.addEventListener('click', capturePhoto);
switchCameraBtn.addEventListener('click', async () => {
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startCamera();
});
retakeBtn.addEventListener('click', () => showScreen('camera'));
newPhotoBtn.addEventListener('click', async () => {
  capturedBlob = null;
  mediaInput.value = '';
  progressWrap.classList.add('hidden');
  setProgress(0, 'Uploading...');
  await startCamera();
});
galleryBtn.addEventListener('click', () => {
  mediaInput.click();
});
mediaInput.addEventListener('change', () => {
  if ((mediaInput.files || []).length > 0 && !capturedBlob) {
    showScreen('review');
  }
});

form.addEventListener('submit', (e) => uploadPhoto(e).catch((err) => {
  errorMessage.textContent = err.message;
  showScreen('error');
}));

startCamera();
