// Configure upload URL here (or point to Cloudflare Tunnel/public hostname).
// Example: window.PHOTO_UPLOAD_CONFIG = { uploadUrl: 'https://photos.yourdomain.com/api/upload' };
const UPLOAD_URL = window.PHOTO_UPLOAD_CONFIG?.uploadUrl || '/api/upload';

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
const captureBtn = document.getElementById('capture-btn');
const switchCameraBtn = document.getElementById('switch-camera');
const retakeBtn = document.getElementById('retake-btn');
const newPhotoBtn = document.getElementById('new-photo-btn');
const fallbackLink = document.getElementById('fallback-link');
const errorMessage = document.getElementById('error-message');

let stream;
let facingMode = 'environment';
let capturedBlob;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[name].classList.add('active');
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
    // Fallback only when browser camera access fails.
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

async function uploadPhoto(e) {
  e.preventDefault();
  if (!capturedBlob) return;
  const formData = new FormData(form);
  formData.append('photo', capturedBlob, `guest-${Date.now()}.jpg`);

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
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
  await startCamera();
});
form.addEventListener('submit', (e) => uploadPhoto(e).catch((err) => {
  errorMessage.textContent = err.message;
  showScreen('error');
}));

startCamera();
