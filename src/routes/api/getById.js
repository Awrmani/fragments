// src/routes/api/getById.js

const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');

const logger = require('../../logger');

/**
 * Get a list of fragments for the given Id
 */
module.exports = async (req, res) => {
  try {
    var id = req.params.id;
    logger.debug(id, '---ID---');
    //const fragment = await Fragment.byId(req.user, req.params.id);
    var extension = path.extname(id);
    //const contentType = req.getHeader('Content-Type');
    extension += !extension ? '.txt' : '';

    if (extension === '.txt') {
      // logic to convert to text/plain
      res.set('Content-Type', 'text/plain');
      //res.send(`Text data for ID ${id}`);
    } else if (extension === '.md') {
      // logic to convert to image/png
      res.set('Content-Type', 'text/html');
      //res.send(`PNG image data for ID ${id}`);
    } else {
      // raw data using original Content-Type
      // logic to retrieve data by id
      const contentType = req.getHeader('Content-Type');
      res.set('Content-Type', contentType);
      //res.send(`Data for ID ${id}`);
    }

    const fragment = await Fragment.byId(req.user, req.params.id);

    res.status(200).send(await fragment.getData());
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
