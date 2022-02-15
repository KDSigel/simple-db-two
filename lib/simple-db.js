const fs = require('fs/promises');
const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  get(id) {
    const newFile = `${id}.json`;
    this.file = path.join(this.dirPath, newFile);
    const parsedFile = fs
      .readFile(this.file, 'utf-8')
      .then((file) => JSON.parse(file));
    return parsedFile.catch((error) => {
      if (error.code === 'ENOENT') {
        return new Error('Not found');
      }
      throw error;
    });
  }

  save(object) {
    const shortId = shortid.generate();
    const fileName = `${shortId}.json`;
    object.id = shortId;
    this.newLocation = path.join(this.dirPath, fileName);
    const stringyObject = JSON.stringify(object);
    return writeFile(this.newLocation, stringyObject).catch((error) => {
      if (error.code === 'ENOENT') {
        return new Error('Not found');
      }
      throw error;
    });
  }

  getAll() {
    return readdir(this.dirPath)
      .then(allFiles => Promise.all(allFiles.map((file) => this.get(file.split('.')[0]))));
  }
}

module.exports = SimpleDb;
