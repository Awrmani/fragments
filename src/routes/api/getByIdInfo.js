// src/routes/api/getByIdInfo.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const logger = require('../../logger');

/**
 * Get a list of fragments metadata for the given Id
 */
module.exports = async (req, res) => {
  try {
    logger.debug(req.params.id, '---ID---');
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, 'By ID');
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
