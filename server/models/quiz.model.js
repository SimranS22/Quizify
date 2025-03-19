const mongoose = require("mongoose");
const { Schema } = mongoose;

var questionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    options: { 
        type: [String], 
        required: true 
    },
    correctAnswer: { 
        type: String, 
        required: true 
    },  
},
{ 
    versionKey: false 
});

var quizSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    questions: { 
        type: [questionSchema]
    },  
},
{ 
    versionKey: false,
    timestamps: true  
});

var quizModel = mongoose.model("quiz", quizSchema);

module.exports = quizModel;