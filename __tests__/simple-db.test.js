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
    fs.writeFile(TEST_DIR + '/' + shortId + '.json', JSON.stringify(newObject));

    const result = await firstDb.get(newObject.id);
    expect(result).toEqual({ name: 'test name', text: 'I do not follow', id: shortId });

  });

  it('checks for ENOENT in the implementation, to check it returns a Not found error', async () => {

    const firstDb = new SimpleDb(TEST_DIR);
    const shortId = shortid.generate();
    const newObject = {
      name: 'test name',
      text: 'I do not follow',
      id: shortId
    };
    fs.writeFile(TEST_DIR + '/' + shortId + '.json', JSON.stringify(newObject));

    const result = await firstDb.get(7);
    expect(result.message).toEqual('Not found');

  });

  it('Takes an object, assigns a random id (sets an id property) and the serializes (JSON.stringify) the object into a file of name [id].json.', async () => {
    const firstDb = new SimpleDb(TEST_DIR);
    const newObject = {
      name: 'test name',
      text: 'I do not follow'
    };
    await firstDb.save(newObject);
    expect(await firstDb.get(newObject.id)).toEqual(newObject);

  });

  it('Get all the objects in the directory.', async () => {
    const firstDb = new SimpleDb(TEST_DIR);
    const newObject1 = {
      name: 'test name',
      text: 'I do not follow'
    };
    const newObject2 = {
      name: 'Erich',
      text: 'I love my cohort'
    };
    await firstDb.save(newObject2);
    await firstDb.save(newObject1);
    
    const allObjects = await firstDb.getAll();

    expect(allObjects).toEqual(expect.arrayContaining([{
      id: expect.any(String),
      name: 'test name',
      text: 'I do not follow'
    }, {
      id: expect.any(String),
      name: 'Erich',
      text: 'I love my cohort'
    }]));
  });

});
