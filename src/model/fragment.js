// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
  `text/plain`,
  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) {
      throw new Error(`missing fragment ownerId`);
    }
    if (!type) {
      throw new Error(`missing fragment type`);
    }
    if (typeof size != 'number') {
      throw new Error(`size must be a number`);
    }
    if (size < 0) {
      throw new Error(`size cannot be negative`);
    }
    if (!Fragment.isSupportedType(type)) {
      throw new Error(`${type} is not a supported type`);
    }
    if (!id) {
      this.id = randomUUID();
    } else {
      this.id = id;
    }
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static byUser(ownerId, expand = false) {
    logger.debug({ ownerId }, 'Owner ID');
    logger.debug({ expand }, 'Expand');
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const frag = await readFragment(ownerId, id);
    if (!frag) {
      throw new Error(`fragment not found`);
    }

    return new Fragment(frag);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data) {
      throw new Error(`data buffer cannot be empty`);
    }
    this.updated = new Date().toISOString();
    this.size = Buffer.byteLength(data);
    this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const mime = this.mimeType.split('/')[0];
    if (mime == 'text') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    var format = [];
    if (this.mimeType == 'text/plain') {
      format.push('text/plain');
    }
    return format;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type: parsedType } = contentType.parse(value);
    return validTypes.some((validTypes) => validTypes === parsedType);
  }

  static isSupportedConversion(input, output) {
    logger.debug({ input }, 'conversion: input');
    logger.debug({ output }, 'conversion: output');
    switch (input) {
      case 'text/plain':
        if (output == '.txt') {
          return true;
        } else {
          return false;
        }
      case 'text/markdown':
        if (output == '.md' || output == '.html' || output == '.txt') {
          return true;
        } else {
          return false;
        }

      case 'text/html':
        if (output == '.html' || output == '.txt') {
          return true;
        } else {
          return false;
        }
      case 'application/json':
        if (output == '.json' || output == '.txt') {
          return true;
        } else {
          return false;
        }
      case 'image/png':
        if (output == '.png' || output == '.jpg' || output == '.webp' || output == '.gif') {
          return true;
        } else {
          return false;
        }
      case 'image/jpeg':
        if (output == '.png' || output == '.jpg' || output == '.webp' || output == '.gif') {
          return true;
        } else {
          return false;
        }
      case 'image/webp':
        if (output == '.png' || output == '.jpg' || output == '.webp' || output == '.gif') {
          return true;
        } else {
          return false;
        }
      case 'image/gif':
        if (output == '.png' || output == '.jpg' || output == '.webp' || output == '.gif') {
          return true;
        } else {
          return false;
        }
    }
  }
}

module.exports.Fragment = Fragment;
