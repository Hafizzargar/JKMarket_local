const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', sellerController.getAllSellers);
router.get('/:id', sellerController.getSellerById);
router.post('/', authenticate, sellerController.createSellerProfile);
router.put('/:id', authenticate, sellerController.updateSellerProfile);

module.exports = router;