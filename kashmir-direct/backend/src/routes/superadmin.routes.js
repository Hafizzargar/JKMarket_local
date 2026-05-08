const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadmin.controller');

router.get('/', superadminController.example);

module.exports = router;