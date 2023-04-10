// src/routes/api/getById.js

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');
const md = require('markdown-it')();

const logger = require('../../logger');

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

    var fragmentData = await fragment.getData();
    const data = Buffer.from(fragmentData).toString();
    logger.debug({ data }, 'Data from Buffer');

    //extension += !extension ? '.txt' : '';
    if (extension === '.txt') {
      res.setHeader('Content-Type', 'text/plain');
    } else if (extension === '.md') {
      var dataHTML = md.render(data);
      logger.debug({ dataHTML }, 'md Converted to html');
      dataHTML = Buffer.from(dataHTML);
      fragmentData = {
        type: 'Buffer',
        data: dataHTML.toJSON().data,
      };

      res.setHeader('Content-Type', 'text/html');
    } else {
      const contentType = fragment.type;
      res.setHeader('Content-Type', contentType);
    }

    res.status(200).send(fragmentData);
  } catch (err) {
    // logger.debug({ err }, '--err');
    if (err.message === 'unable to read fragment data') {
      return res.status(404).json(createErrorResponse(404, 'Invalid request', err));
    }
    return res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
