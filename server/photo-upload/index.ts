import fs from 'fs';
import path from 'path';
import type { Express, Request } from 'express';
import express from 'express';
import multer, { type FileFilterCallback } from 'multer';
import sqlite3 from 'sqlite3';

// Configure DB path here.
const DB_PATH = process.env.PHOTO_UPLOAD_DB_PATH || path.resolve(process.cwd(), 'server/photo-upload/photo_upload.sqlite');
// Configure uploads folder here.
const UPLOADS_DIR = process.env.PHOTO_UPLOADS_DIR || path.resolve(process.cwd(), 'uploads');
// Configure admin token here (and place behind Cloudflare/public hostname + tunnel policy).
const ADMIN_TOKEN = process.env.PHOTO_ADMIN_TOKEN || 'change-me';
const UPLOAD_TOKEN = process.env.PHOTO_UPLOAD_TOKEN || '';
const MAX_UPLOAD_MB = Number.parseInt(process.env.PHOTO_UPLOAD_MAX_MB || '20', 10);
const ENABLE_UNTIL = process.env.PHOTO_UPLOAD_ENABLE_UNTIL || '';

function parseEnableUntil(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const enableUntilDate = parseEnableUntil(ENABLE_UNTIL);

function isUploadFeatureEnabled() {
  if (!enableUntilDate) return true;
  return Date.now() <= enableUntilDate.getTime();
}

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    mimeType TEXT,
    sizeBytes INTEGER,
    uploadedAt TEXT NOT NULL,
    guestName TEXT,
    message TEXT
  )`);
});

db.serialize(() => {
  db.run(`ALTER TABLE uploads ADD COLUMN mimeType TEXT`, () => undefined);
  db.run(`ALTER TABLE uploads ADD COLUMN sizeBytes INTEGER`, () => undefined);
});

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => cb(null, UPLOADS_DIR),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`),
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});

function requireUploadToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!UPLOAD_TOKEN) return next();
  if (req.headers['x-upload-token'] !== UPLOAD_TOKEN) return res.status(403).json({ message: 'Forbidden' });
  next();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) return res.status(403).json({ message: 'Forbidden' });
  next();
}

export function registerPhotoUploadModule(app: Express) {
  app.use('/photo-upload/static', express.static(path.resolve(process.cwd(), 'photo-upload-app')));

  app.use('/uploads', requireAdmin, express.static(UPLOADS_DIR));

  app.use(['/photo-upload', '/api/upload', '/api/upload/status'], (req, res, next) => {
    if (isUploadFeatureEnabled()) return next();

    return res.status(410).json({
      message: 'Photo upload feature is disabled',
      disabledAt: enableUntilDate?.toISOString() || null,
      path: req.path,
    });
  });

  app.get('/photo-upload', (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'photo-upload-app/index.html'));
  });

  app.get('/api/upload/status', (_req, res) => {
    res.json({
      ok: true,
      maxUploadMb: MAX_UPLOAD_MB,
      uploadsDir: UPLOADS_DIR,
      enabled: isUploadFeatureEnabled(),
      enabledUntil: enableUntilDate?.toISOString() || null,
    });
  });

  app.post('/api/upload', requireUploadToken, upload.single('photo'), (req: Request, res) => {
    if (!req.file) return res.status(400).json({ message: 'Photo is required' });
    const uploadedAt = new Date().toISOString();
    const guestName = typeof req.body.guestName === 'string' ? req.body.guestName : '';
    const message = typeof req.body.message === 'string' ? req.body.message : '';

    db.run(
      `INSERT INTO uploads (filename, originalName, mimeType, sizeBytes, uploadedAt, guestName, message) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, uploadedAt, guestName, message],
      (err: Error | null) => {
        if (err) return res.status(500).json({ message: 'Failed to save metadata' });
        res.status(201).json({ ok: true, filename: req.file?.filename });
      }
    );
  });

  app.get('/photo-admin', requireAdmin, (_req, res) => {
    res.type('html').send('<h1>Photo Admin</h1><p>Protected placeholder. Build UI later.</p>');
  });

  app.get('/api/photo-admin/uploads', requireAdmin, (_req, res) => {
    db.all('SELECT filename, originalName, mimeType, sizeBytes, uploadedAt, guestName, message FROM uploads ORDER BY id DESC LIMIT 200', (err: Error | null, rows: unknown[]) => {
      if (err) return res.status(500).json({ message: 'Query failed' });
      res.json(rows);
    });
  });
}
