// src/routes/api/getByIdInfo.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');

const logger = require('../../logger');

/**
 * Get a list of fragments metadata for the given Id
 */
module.exports = async (req, res) => {
  try {
    const id = path.parse(req.params.id).name;
    logger.debug({ id }, '---ID---');

    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, 'GET /:id/info metadata');
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
