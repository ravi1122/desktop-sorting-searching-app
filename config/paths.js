const path = require('path');

const CWD = process.cwd();
const SRC_DIR = path.join(CWD, 'src');
const BUILD_DIR = path.join(CWD, 'build');

const ENTRY_FILE = path.join(SRC_DIR, 'index.js');

module.exports = {
  CWD,
  SRC_DIR,
  BUILD_DIR,
  ENTRY_FILE
};
