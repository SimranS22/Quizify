const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
    registerUser,
    loginUser,
    userData
} = require("../controllers/auth.controller")

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Fetch User Data
router.get('/data', userData);

module.exports = router;
