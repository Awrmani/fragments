// src/routes/api/getById.js

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');
const md = require('markdown-it')();
const sharp = require('sharp');
const mime = require('mime-types');

const logger = require('../../logger');

const validConversions = {
  'text/plain': ['.txt'],
  'text/markdown': ['.md', '.html', '.txt'],
  'text/html': ['.html', '.txt'],
  'application/json': ['.json', '.txt'],
  'image/png': ['.png', '.jpg', '.webp', '.gif'],
  'image/jpeg': ['.png', '.jpg', '.webp', '.gif'],
  'image/webp': ['.png', '.jpg', '.webp', '.gif'],
  'image/gif': ['.png', '.jpg', '.webp', '.gif'],
};

function convertType(contentType, targetExtension, data) {
  if (validConversions[contentType] && validConversions[contentType].includes(targetExtension)) {
    switch (contentType) {
      case 'text/plain':
        if (targetExtension === '.txt') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data.toString('utf8');
        }
        break;
      case 'text/markdown':
        if (targetExtension === '.md') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data.toString('utf8');
        } else if (targetExtension === '.html' || targetExtension === '.txt') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return md.render(data.toString('utf8'));
        }

        break;
      case 'text/html':
        if (targetExtension === '.html' || targetExtension === '.txt') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data.toString('utf8');
        }
        break;
      case 'application/json':
        if (targetExtension === '.json' || targetExtension === '.txt') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data.toString('utf8');
        }
        break;
      case 'image/png':
        if (targetExtension === '.png') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data;
        } else if (targetExtension === '.jpg') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('jpg').toBuffer();
        } else if (targetExtension === '.webp') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('webp').toBuffer();
        } else if (targetExtension === '.gif') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('gif').toBuffer();
        }

        break;
      case 'image/jpeg':
        if (targetExtension === '.png') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('png').toBuffer();
        } else if (targetExtension === '.jpg') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data;
        } else if (targetExtension === '.webp') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('webp').toBuffer();
        } else if (targetExtension === '.gif') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('gif').toBuffer();
        }

        break;
      case 'image/webp':
        if (targetExtension === '.png') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('png').toBuffer();
        } else if (targetExtension === '.jpg') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('jpg').toBuffer();
        } else if (targetExtension === '.webp') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data;
        } else if (targetExtension === '.gif') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('gif').toBuffer();
        }

        break;
      case 'image/gif':
        if (targetExtension === '.png') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('gif').toBuffer();
        } else if (targetExtension === '.jpg') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('jpg').toBuffer();
        } else if (targetExtension === '.webp') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return sharp(data).toFormat('webp').toBuffer();
        } else if (targetExtension === '.gif') {
          logger.debug(`Converting ${contentType} to ${targetExtension}`);
          return data;
        }

        break;
      default:
        logger.error(`Invalid content type: ${contentType}`);
    }
  } else {
    logger.error(`Invalid conversion: ${contentType} to ${targetExtension}`);
  }
}

/**
 * Get a list of fragments for the given Id
 */
module.exports = async (req, res) => {
  try {
    const idExt = req.params.id;
    const id = path.parse(idExt).name;
    logger.debug({ id }, '---ID---');

    var extension = path.extname(req.url);
    logger.debug({ extension }, 'GET /:id Extension');

    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, 'getById fragment');
    logger.debug('AWS_REGION: ' + process.env.AWS_REGION);
    const contentType = fragment.type;

    const index = contentType.indexOf(';');
    const charset = index !== -1 ? contentType.slice(index) : '';

    var fragmentData = await fragment.getData();
    const data = Buffer.from(fragmentData).toString();
    logger.debug({ data }, 'Data from Buffer');

    var resData;
    if (extension) {
      if (!Fragment.isSupportedConversion(fragment.mimeType, extension)) {
        throw new Error('Unsupported type conversion');
      }
      resData = convertType(fragment.mimeType, extension, fragmentData);
      logger.debug({ resData }, 'resData');
    } else {
      resData = fragmentData;
    }

    const resType = extension ? mime.lookup(extension) : fragment.mimeType;
    res.setHeader('Content-Type', resType + charset);

    res.status(200).send(resData);
  } catch (err) {
    logger.debug({ err }, '--err');
    if (err.message === 'unable to read fragment data') {
      return res.status(404).json(createErrorResponse(404, 'Invalid request', err));
    }
    return res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
