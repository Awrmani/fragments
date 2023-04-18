// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

const logger = require('../../logger');

const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
router.get('/fragments/:id', require('./getById'));
router.get('/fragments/:id/info', require('./getByIdInfo'));
// Delete
router.delete('/fragments/:id', require('./deleteById'));

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      logger.debug({ type }, 'Content-Type Parse Middleware');
      return Fragment.isSupportedType(type);
    },
  });

//logger.debug('Parsed by the raw body parser: ' + Buffer.isBuffer(rawBody.req.Body));
// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.

router.post('/fragments', rawBody(), require('./post'));
router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;
