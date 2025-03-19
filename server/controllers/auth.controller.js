const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

registerUser = async (req, res) => {
    try {
        const { username, firstname, lastname, email, phone, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ username, firstname, lastname, email, phone, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ 
            message: 'User Registered Successfully!' 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Registration Failed!' 
        });
    }
    // const { username, email, phone, password, role } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new userModel({ username, email, phone, password: hashedPassword, role });
    // await user.save().then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
}

loginUser = async (req, res) => {
    try {
        const { phone, password, role } = req.body;

        const user = await userModel.findOne({ phone, role });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed: User not found!' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed: Incorrect Password!' });
        }

        const token = jwt.sign({ 
            userId: user._id,
            phone: user.phone, 
            role: user.role 
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: '1h', 
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login Failed!' });
    } 
}

userData = async (req, res) => {
    try {
        const user = await userModel.find();
        res.send(user);
    } catch (err) {
        res.send(err);
    }
}

module.exports = {
    registerUser,
    loginUser,
    userData
}