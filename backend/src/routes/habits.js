const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getHabits,
    createHabit,
    deleteHabit,
    toggleLog,
    getLogs,
    getStats,
} = require('../controllers/habitController');

router.get('/', authMiddleware, getHabits);
router.post('/', authMiddleware, createHabit);
router.delete('/:id', authMiddleware, deleteHabit);
router.post('/:id/toggle', authMiddleware, toggleLog);
router.get('/:id/logs', authMiddleware, getLogs);
router.get('/:id/stats', authMiddleware, getStats);

module.exports = router;