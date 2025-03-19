const mongoose = require('mongoose');
const { Schema } = mongoose;

const testSchema = new mongoose.Schema({
  quizId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
  score: { 
    type: Number, 
    required: true 
  },
  answers: [
    {
        questionId: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        selectedAnswer: { 
            type: String, 
            required: true 
        }
    }
  ]
},
{ 
    versionKey: false,
    timestamps: true 
});

const test = mongoose.model('test', testSchema);
module.exports = test;