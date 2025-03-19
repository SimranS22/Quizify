const express = require('express');

const { 
    submitQuiz, 
    getTests,
    getUserAttempts
} = require('../controllers/test.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/submit', authMiddleware, submitQuiz);
router.get('/', authMiddleware, getTests);
router.get('/:id', authMiddleware, roleMiddleware('admin'), getUserAttempts);

module.exports = router;