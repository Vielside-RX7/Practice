const express = require('express');
const { getBuses, addBus, updateBus, deleteBus } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/buses', protect, isAdmin, getBuses);
router.post('/buses', protect, isAdmin, addBus);
router.put('/buses/:id', protect, isAdmin, updateBus);
router.delete('/buses/:id', protect, isAdmin, deleteBus);

module.exports = router;
