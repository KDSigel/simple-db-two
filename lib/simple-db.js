const fs = require('fs/promises');
const path = require('path');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  get(id) {
    const newFile = `${id}.txt`;
    this.file = path.join(this.dirPath, newFile);
    const parsedFile = fs.readFile(this.file, 'utf-8').then((file) =>
      JSON.parse(file)
    );
    return parsedFile;
  }
}

module.exports = SimpleDb;
