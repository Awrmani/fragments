// src/routes/api/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.byteLength,
    });
    await fragment.save();
    await fragment.setData(req.body);

    res.setHeader(
      'Location',
      process.env.API_URL || req.headers.host + '/v1/fragments/' + fragment.id
    );
    //res.setHeader('content-type', fragment.type);

    return res.status(201).json(createSuccessResponse({ fragment }));
  } catch (err) {
    res
      .status(415)
      .json(createErrorResponse(415, logger.debug(err.message, 'Post Failed with 415'), err));
  }
};
