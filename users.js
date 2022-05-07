const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to MongoDB server
mongoose.connect(process.env.MONGO_URI, {newUrlParser: true, useUnifiedTopology: true}, (err, db) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully connected to server!");
    }
});

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        required:true,
        default: 0
    },
    log: [
        {
            description: {
                type: String,
                required: true
            },
            duration: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ]
});

const Users = mongoose.model("users", usersSchema);

