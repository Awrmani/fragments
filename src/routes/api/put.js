// src/routes/api/put.js

const path = require('path');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * update an existing fragment
 */
module.exports = async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      throw new Error('empty buffer');
    }

    const id = path.parse(req.params.id).name;
    const fragment = await Fragment.byId(req.user, id);

    await fragment.setData(req.body);
    await fragment.save();

    res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.setHeader('Content-Type', fragment.mimeType);

    return res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    return res.status(400).json(createErrorResponse(400, 'Invalid request', err));
  }
};
