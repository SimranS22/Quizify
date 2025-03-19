const Test = require('../models/test.model');
const Quiz = require('../models/quiz.model');

const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return res.status(404).send('Quiz not found.');

  let score = 0;
  answers.forEach(answer => {
    const question = quiz.questions.id(answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      score++;
    }
  });

  const test = new Test({
    quizId,
    userId: req.user.userId,
    score,
    answers
  });

  await test.save();
  res.send({ score });
};

const getTests = async (req, res) => {
  // const results = await Test.find({ userId: req.user.userId }).populate('quizId', 'title');
  const results = await Test.find({ userId: req.user.userId })
  res.send(results);
};

const getUserAttempts = async (req, res) => {
  const quizId = req.params.id;
  const results = await Test.find({ quizId: quizId });
  // console.log(results);
  res.send(results);
};

module.exports = { 
  submitQuiz, 
  getTests,
  getUserAttempts
};