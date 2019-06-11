const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        validate: {
            validator: function (un) {
                return /^[a-zA-Z ]{3,18}$/.test(un);
            },
            message: props => `Invalid First Name`
        },
        required: [true, 'First Name is required'],
        trim: true,
    },
    last_name: {
        type: String,
        validate: {
            validator: function (un) {
                return /^[a-zA-Z ]{3,18}$/.test(un);
            },
            message: props => `Invalid Last Name`
        },
        required: [true, 'Last Name is required'],
        trim: true,
    },
    user_name: {
        type: String,
        unique: true,
        validate: {
            validator: function (un) {
                return /^[a-z0-9_-]{3,15}$/.test(un);
            },
            message: props => `Invalid UserName`
        },
        required: [true, 'UserName is required'],
        trim: true,
    },
    password: {
        type: String,
        validate: {
            validator: function (pass) {
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass);
            },
            message: props => `Password must contain minimum eight characters, at least one letter and one number`
        },
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        validate: {
            validator: function (mail) {
                return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(mail);
            },
            message: props => `${props.value} is not a valid Email!`
        },
        required: [true, 'Email is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['Lexicographer', 'Blogger', 'Admin'],
        required: [true, 'User Role is required']
    },
    meta: {
        added_by: String,
        creation_date: {
            type: Date,
            default: Date.now
        },
    },
});

//authenticate input against database
UserSchema.statics.authenticate = function (user_name, password, callback) {
    User.findOne({
            user_name
        })
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            if (user.password === password) return callback(null, user)
            else return callback();
            // bcrypt.compare(password, user.password, function (err, result) {
            //     if (result === true) {
            //         return callback(null, user);
            //     } else {
            //         return callback();
            //     }
            // });
        });
}

UserSchema.plugin(uniqueValidator, {
    message: 'User Name "{VALUE}" already exists'
});
// User is the collection name, where accounts will be saved
let User = mongoose.model('User', UserSchema, 'useraccounts');
module.exports = User;