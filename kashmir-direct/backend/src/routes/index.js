const express = require('express');
const router = express.Router();
const productRoutes = require('./product.routes');
const authRoutes = require('./auth.routes');
const sellerRoutes = require('./seller.routes');
const categoryRoutes = require('./category.routes');
const uploadRoutes = require('./upload.routes');
const adminRoutes = require('./admin.routes');
const superadminRoutes = require('./superadmin.routes');

router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/sellers', sellerRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/super-admin', superadminRoutes);

module.exports = router;
