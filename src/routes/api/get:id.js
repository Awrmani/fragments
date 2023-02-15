// src/routes/api/get:id.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const logger = require('../../logger');

/**
 * Get a list of fragments for the given Id
 */
module.exports = async (req, res) => {
  console.log('----HERE----');
  try {
    logger.debug(req.params.id, '---ID---');
    console.log('___ID___' + req.params.id);
    const fragment = await Fragment.byId(req.user, req.params.id);
    console.log('___ID___2' + req.params.id);
    logger.debug({ fragment }, 'By ID');
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
