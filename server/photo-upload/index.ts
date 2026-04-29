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
// Configure CORS allowed origins here for GitHub Pages or custom domains.
// Example: PHOTO_UPLOAD_ALLOWED_ORIGINS=https://www.themcnears.com,https://photos.themcnears.com
const ALLOWED_ORIGINS = (process.env.PHOTO_UPLOAD_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
// Configure admin token here (and place behind Cloudflare/public hostname + tunnel policy).
const ADMIN_TOKEN = process.env.PHOTO_ADMIN_TOKEN || 'change-me';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    uploadedAt TEXT NOT NULL,
    guestName TEXT,
    message TEXT
  )`);
});

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => cb(null, UPLOADS_DIR),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image uploads are allowed'));
  },
});

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) return res.status(403).json({ message: 'Forbidden' });
  next();
}

export function registerPhotoUploadModule(app: Express) {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.use('/photo-upload/static', express.static(path.resolve(process.cwd(), 'photo-upload-app')));
  app.use('/uploads', express.static(UPLOADS_DIR));

  app.get('/photo-upload', (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'photo-upload-app/index.html'));
  });

  app.post('/api/upload', upload.single('photo'), (req: Request, res) => {
    if (!req.file) return res.status(400).json({ message: 'Photo is required' });
    const uploadedAt = new Date().toISOString();
    const guestName = typeof req.body.guestName === 'string' ? req.body.guestName : '';
    const message = typeof req.body.message === 'string' ? req.body.message : '';

    db.run(
      `INSERT INTO uploads (filename, originalName, uploadedAt, guestName, message) VALUES (?, ?, ?, ?, ?)`,
      [req.file.filename, req.file.originalname, uploadedAt, guestName, message],
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
    db.all('SELECT filename, originalName, uploadedAt, guestName, message FROM uploads ORDER BY id DESC LIMIT 200', (err: Error | null, rows: unknown[]) => {
      if (err) return res.status(500).json({ message: 'Query failed' });
      res.json(rows);
    });
  });
}
