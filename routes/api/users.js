const express = require('express');
const router = express.Router();
const root = "../..";
const User = require(`${root}/model/User`);
// the middleware to ensure login
const eSession = require('easy-session');


router.post("/login", (req, res, next) => {
    if (req.body.user_name && req.body.password) {
        User.authenticate(req.body.user_name, req.body.password, function (error, user) {
            if (error || !user) {
                return res.json({
                    error: true,
                    status: 401,
                    msg: 'Wrong email or password.'
                });
            } else {
                //     // help of easy session
                req.session.login(user.role.toLowerCase(), {
                        // req.session.login('admin', {
                        userId: user._id
                        // userId: 1123
                    })
                    .then(() => {
                        return res.json({
                            redirect: `/${user.role}`
                            // redirect: `/Admin`
                        });
                    });
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});




// GET /logout
router.get('/isguest', function (req, res) {
    res.send(req.session.isGuest());
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    return res.json({
        redirect: '/'
    });
});


// PROTECT PATHS ==============================================
// MUST BE LOGGED IN
// MUST BE ADMIN AND MUST HAVE THE RIGHTS ------------------------ NOT IMPLEMENTED YET

router.get('/', eSession.isLoggedIn(), (req, res) => {
    // send users
    User.find({}).exec((err, users) => {
        if (err) res.send(err);
        res.json(users);
    });
});


// get single user
router.get('/:un', eSession.isLoggedIn(), (req, res) => {
    // send users
    User.findOne({
        user_name: req.params.un
    }).exec((err, users) => {
        if (err) res.send(err);
        res.json(users);
    });
});


// add new user
router.post('/add', eSession.isLoggedIn(), (req, res) => {
    new User(req.body).save(function (err) {
        if (err) res.status(422).json(err.errors);
        else res.send(req.body);
    });
});

router.post('/update', eSession.isLoggedIn(), (req, res) => {
    // console.log(req.body);
    // console.log('about to updated user');
    res.send('about to update');
    // new User(req.body).save(function (err) {
    //     if (err) res.status(422).json(err.errors);
    //     else res.send(req.body);
    // });
});

router.get("/delete/:un", eSession.isLoggedIn(), (req, res) => {
    // deleted the user_name
    User.deleteOne({
        user_name: req.params.un
    }, function (err) {
        if (err) console.log(err);
        else res.send('ok');
    });
});

module.exports = router;