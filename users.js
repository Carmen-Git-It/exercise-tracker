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
        required: true
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
                type: Date
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
};

const addExercise = function(id, description, duration, date, done) {
    Users.findById(id, (err, user) => {
        if (err) {
            console.log(err);
            return done(err, null);
        } else if(user) {
            user.count++;
            if (!date) {
                date = Date.now();
            }
            user.log.push({'description': description, 'duration': duration, 'date': date});
            user.save((err, updated) => {
                if (err) {
                    console.log(err);
                    return done(err, null);
                } else {
                    return done(null, updated);
                }
            });
        } else {
            console.log('User not found!');
            return ('User not found!', null);
        }
    });
};

const getUserById = function(id, done) {
    Users.findById(id, (err, user) => {
        if (err) {
            return done(err, null);
        } 
        else {
            return done(null, user);
        }
    });
}

const getAllUsers = function(done) {
    Users.find({}, (err, users) => {
        if (err) {
            console.log(err);
            return done(err, null);
        } else {
            return done(null, users);
        }
    });
}

exports.usersModel = Users;
exports.createUser = createUser;
exports.addExercise = addExercise;
exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;