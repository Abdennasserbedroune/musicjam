'use strict';

const fs = require('fs');
const path = require('path');

const uploadDir = path.join(process.cwd(), 'uploads');

const ensureUploadDir = () => {
  fs.mkdirSync(uploadDir, { recursive: true });
};

module.exports = {
  uploadDir,
  ensureUploadDir,
};
