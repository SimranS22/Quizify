const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username:{ 
        type: String, 
        required: true 
    },
    firstname:{ 
        type: String, 
        required: true 
    },
    lastname:{ 
        type: String, 
        required: true 
    },
    email:{ 
        type: String, 
        required: true 
    },
    phone:{ 
        type: Number,
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true 
    }
},
{ 
    versionKey: false 
})

var userModel = mongoose.model("user", userSchema);

module.exports = userModel;