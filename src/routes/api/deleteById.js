// src/routes/api/getById.js

const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');

const logger = require('../../logger');

/**
 * Delete a fragment data for the given Id
 */
module.exports = async (req, res) => {
  try {
    const id = path.parse(req.params.id).name;
    logger.debug({ id }, '---DeleteID---');

    await Fragment.delete(req.user, id);
    logger.debug('Data from Buffer');

    return res.status(200).json(createSuccessResponse(id + ' data deleted'));
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
