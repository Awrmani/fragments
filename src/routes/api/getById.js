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
    var fragmentData = await fragment.getData();
    const data = Buffer.from(fragmentData).toString();
    logger.debug({ data }, 'Data from Buffer');

    extension += !extension ? '.txt' : '';
    if (extension === '.txt') {
      res.set('Content-Type', 'text/plain');
    } else if (extension === '.md') {
      var dataHTML = md.render(data);
      logger.debug({ dataHTML }, 'md Converted to html');
      dataHTML = Buffer.from(dataHTML);
      fragmentData = {
        type: 'Buffer',
        data: dataHTML.toJSON().data,
      };

      res.set('Content-Type', 'text/html');
    } else {
      const contentType = req.getHeader('Content-Type');
      res.set('Content-Type', contentType);
    }

    res.status(200).send(fragmentData);
    //res.status(200).json(createSuccessResponse({ fragmentData }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
