const dbCall = require('../../src/model/data/memory/index');
//const MemoryDB = require('../../src/model/data/memory/memory-db');

describe('fragment database calls test', () => {
  let fragment = {
    id: '30a84843-0cd4-4975-95ba-b96112aea189',
    ownerId: '11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a',
    created: '2021-11-02T15:09:50.403Z',
    updated: '2021-11-02T15:09:50.403Z',
    type: 'text/plain',
    size: 256,
  };

  test('writeFragment() returns undefined', async () => {
    const write = await dbCall.writeFragment(fragment);
    expect(write).toBe(undefined);
  });

  test('writeFragment() and read the metadata, readFragment()', async () => {
    await dbCall.writeFragment(fragment);
    const read = await dbCall.readFragment(fragment.ownerId, fragment.id);
    expect(read).toEqual(fragment);
  });

  test('writeFragmentData() data returns undefined', async () => {
    const data = { value: 123 };
    const write = await dbCall.writeFragmentData(fragment.ownerId, fragment.id, data);
    expect(write).toBe(undefined);
  });

  test('writeFragmentData() and read the data readFragmentData()', async () => {
    const data = { value: 123 };
    await dbCall.writeFragmentData(fragment.ownerId, fragment.id, data);
    const read = await dbCall.readFragmentData(fragment.ownerId, fragment.id);
    expect(read).toEqual(data);
  });

  test('readFragment() without writing the fragment', async () => {
    const data = { value: 123 };
    const read = await dbCall.readFragmentData(fragment.ownerId, fragment.id);
    expect(read).toEqual(data);
  });

  test('listFragments() expanded', async () => {
    await dbCall.writeFragment(fragment);
    const list = await dbCall.listFragments(fragment.ownerId, true);
    expect(list).toEqual(expect.arrayContaining([expect.objectContaining(fragment)]));
  });

  test('listFragments() not expanded', async () => {
    const id = [fragment.id];
    await dbCall.writeFragment(fragment);
    const list = await dbCall.listFragments(fragment.ownerId);
    expect(list).toEqual(expect.arrayContaining(id));
  });

  test('deleteFragment()', async () => {
    await dbCall.writeFragment(fragment);
    await dbCall.deleteFragment(fragment.ownerId, fragment.id);
    const read = await dbCall.readFragment(fragment.ownerId, fragment.id);
    expect(read).toBe(undefined);
  });

  test('call deleteFragment() with non-existant key', async () => {
    const primaryKey = fragment.ownerId,
      secondaryKey = fragment.id;
    expect(async () => {
      await dbCall.deleteFragment(fragment.ownerId, fragment.id);
    }).rejects.toThrow(
      new Error(`missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`)
    );
  });

  test('call deleteFragment() with invalid key value', async () => {
    expect(await dbCall.deleteFragment).rejects.toThrow(
      new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${undefined}, secondaryKey=${undefined}`
      )
    );
  });
});
