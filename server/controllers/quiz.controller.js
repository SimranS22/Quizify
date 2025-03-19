const Quiz = require('../models/quiz.model');

// Create a quiz
const createQuiz = async (req, res) => {
  const { title, questions } = req.body;
  const quiz = new Quiz({ title, questions, createdBy: req.user.userId });
  try {
    const result = await quiz.save();
    res.send({
      message: "Quiz created successfully.",
      data: result
    });
  } catch (err) {
    res.send({
      message: "Quiz creation failed.",
      data: err
    });
  }
};

// Display all quizzes
const displayAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.send(quizzes);
  } catch (err) {
    res.send(err);
  }
};

// Display all quizzes created by the admin
const displayAdminQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.userId });
    res.send(quizzes);
  } catch (err) {
    res.send(err);
  }
};

// Display a single quiz by ID
const takeQuiz = async (req, res) => {
  const id = req.params.id;
  try {
    const quiz = await Quiz.findById(id);
    res.send(quiz);
  } catch (err) {
    res.send(err);
  }
};

// Update a quiz title by ID
const updateQuizTitle = async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, { title }, { new: true });
    res.send({
      message: "Quiz title updated successfully.",
      data: quiz
    });
  } catch (err) {
    res.send({
      message: "Quiz title update failed.",
      data: err
    });
  }
};

// Insert questions into a quiz
const insertQuestions = async (req, res) => {
  const id = req.params.id;
  const { questions } = req.body;
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, { $push: { questions: { $each: questions } } }, { new: true });
    res.send({
      message: "Questions inserted successfully.",
      data: quiz
    });
  } catch (err) {
    res.send({
      message: "Questions insertion failed.",
      data: err
    });
  }
};

// Update a question by ID
const updateQuestion = async (req, res) => {
  const quizId = req.params.quizId;
  const questionId = req.params.questionId;
  const { question, options, correctAnswer } = req.body;
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, "questions._id": questionId },
      { $set: { 
        "questions.$.question": question, 
        "questions.$.options": options, 
        "questions.$.correctAnswer": correctAnswer
    } },
      { new: true }
    );
    res.send({
      message: "Question updated successfully.",
      data: quiz
    });
  } catch (err) {
    res.send({
      message: "Question update failed.",
      data: err
    });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  const quizId = req.params.quizId;
  const questionId = req.params.questionId;
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );
    res.send({
      message: "Question deleted successfully.",
      data: quiz
    });
  } catch (err) {
    res.send({
      message: "Question deletion failed.",
      data: err
    });
  }
};

// Delete a quiz by ID
const deleteQuiz = async (req, res) => {
  const id = req.params.id;
  try {
    const quiz = await Quiz.findByIdAndDelete(id);
    res.send({
      message: "Quiz deleted successfully.",
      data: quiz
    });
  } catch (err) {
    res.send({
      message: "Quiz deletion failed.",
      data: err
    });
  }
};

module.exports = {
  createQuiz,
  displayAllQuizzes,
  displayAdminQuizzes,
  takeQuiz,
  updateQuizTitle,
  insertQuestions,
  updateQuestion,
  deleteQuestion,
  deleteQuiz
};