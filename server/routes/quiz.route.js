// routes/quizRoutes.js
const express = require('express');

const { 
    createQuiz, 
    displayAllQuizzes, 
    displayAdminQuizzes, 
    takeQuiz, 
    updateQuizTitle, 
    insertQuestions, 
    updateQuestion, 
    deleteQuestion, 
    deleteQuiz 
} = require('../controllers/quiz.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// ADMIN
router.get('/admin', authMiddleware, roleMiddleware('admin'), displayAdminQuizzes);
router.post('/create', authMiddleware, roleMiddleware('admin'), createQuiz);
router.put('/:id/title', authMiddleware, roleMiddleware('admin'), updateQuizTitle);
router.put('/:id/questions', authMiddleware, roleMiddleware('admin'), insertQuestions);
router.put('/:quizId/questions/:questionId', authMiddleware, roleMiddleware('admin'), updateQuestion);
router.delete('/:quizId/questions/:questionId', authMiddleware, roleMiddleware('admin'), deleteQuestion);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteQuiz);

// USER
router.get('/', authMiddleware, roleMiddleware('user'), displayAllQuizzes);

// BOTH
router.get('/:id', authMiddleware, takeQuiz);

module.exports = router;