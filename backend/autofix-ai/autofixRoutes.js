const express = require('express');
const router = express.Router();
const { autofix } = require('./autofixController');

router.post('/fix', autofix);

module.exports = router;
