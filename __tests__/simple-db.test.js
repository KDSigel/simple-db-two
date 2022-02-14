const fs = require('fs/promises');
const path = require('path');
const SimpleDb = require('../lib/simple-db');
const shortid = require('shortid');


const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('Returns an object deserialized (JSON.parse) from the contents of the file with that id in the directory', async () => {

    const firstDb = new SimpleDb(TEST_DIR);
    const shortId = shortid.generate();
    const newObject = {
      name: 'test name',
      text: 'I do not follow',
      id: shortId,
    };
    fs.writeFile(TEST_DIR + '/' + shortId + '.txt', JSON.stringify(newObject));

    const result = await firstDb.get(newObject.id);
    expect(result).toEqual({ name: 'test name', text: 'I do not follow', id: shortId });

  });

});
