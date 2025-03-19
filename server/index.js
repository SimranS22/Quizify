const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.route');
const quizRoutes = require('./routes/quiz.route');
const TestRoutes = require('./routes/test.route');
require('dotenv').config();
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000" // local client URL
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', TestRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

