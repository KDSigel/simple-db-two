const fs = require('fs/promises');
const { writeFile, readdir } = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  async get(id) {
    try {
      const newFile = `${id}.json`;
      this.file = path.join(this.dirPath, newFile);
      const parsedFile = await fs.readFile(this.file, 'utf-8');
      return JSON.parse(parsedFile);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return new Error('Not found');
      }
      throw error;
    }
  }

  save(object) {
    try {
      const shortId = shortid.generate();
      const fileName = `${shortId}.json`;
      object.id = shortId;
      this.newLocation = path.join(this.dirPath, fileName);
      const stringyObject = JSON.stringify(object);
      return writeFile(this.newLocation, stringyObject);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return new Error('Not found');
      }
      throw error;
    }
  }

  async getAll() {
    const allFiles = await readdir(this.dirPath);
    return Promise.all(allFiles.map((file) => this.get(file.split('.')[0])));
  }
}

module.exports = SimpleDb;
