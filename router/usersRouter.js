// external imports
const express = require('express');

// internal imports
const {getUser} = require('../controller/userController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');

const router = express.Router();

router.get("/", decorateHtmlResponse("Users"), getUser);

module.exports = router;