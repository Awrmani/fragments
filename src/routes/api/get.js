// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user, Boolean(req.query.expand));
    logger.debug('list by user: ' + fragments);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
