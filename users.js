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

const createUser = function(name, done) {
    const newUser = new Users({"username": name, "count": 0});
    newUser.save((err, res) => {
        if (err) {
            console.log(err);
            return done(err, null);
        } else {
            return done(null, res);
        }
    });
}

exports.usersModel = Users;
exports.createUser = createUser;