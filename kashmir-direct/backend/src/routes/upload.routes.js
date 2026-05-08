const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

router.get('/', uploadController.example);

module.exports = router;