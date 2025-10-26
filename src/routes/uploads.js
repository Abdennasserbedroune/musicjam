'use strict';

const { Router } = require('express');
const multer = require('multer');
const path = require('path');

const auth = require('../middleware/auth');
const { badRequest } = require('../lib/http-errors');
const { uploadDir } = require('../lib/uploads');

const router = Router();

const createSafeFilename = (originalName) => {
  const timestamp = Date.now();
  const randomPart = Math.round(Math.random() * 1e9);
  const ext = path.extname(originalName || '');
  const baseName = path.basename(originalName || '', ext);

  const sanitizedBase = baseName
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();

  const fallback = 'file';

  return `${sanitizedBase || fallback}-${timestamp}-${randomPart}${ext}`;
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, createSafeFilename(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', auth, upload.single('file'), (req, res, next) => {
  if (!req.file) {
    return next(badRequest('File is required'));
  }

  const { filename, size, mimetype } = req.file;

  res.status(201).json({
    filename,
    size,
    mime: mimetype,
  });
});

module.exports = router;
