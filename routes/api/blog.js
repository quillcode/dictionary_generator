const express = require('express');
const router = express.Router();
const root = "../..";
const Post = require(`${root}/model/Post`);

// the middleware to ensure login
const eSession = require('easy-session');

// return posts
router.get('/', (req, res) => {
    Post.find({}).exec((err, post) => {
        if (err) res.send(err);
        res.json(post);
    });
});

router.get('/post/:id', (req, res) => {
    
    Post.findOne({_id: req.params.id}).exec((err, post) => {
        if (err) res.send(err);
        res.json(post);
    });
});


// PROTECTED PATHS ===========================================

// delete
router.get("/delete/:id", eSession.isLoggedIn(), (req, res) => {
    // deleted the user_name
    Post.deleteOne({
        _id: req.params.id
    }, function (err) {
        if (err) console.log(err);
        else res.send('ok');
    });
});


// add word
router.post('/publish', eSession.isLoggedIn(), (req, res) => {
    new Post(req.body).save(function (err) {
        if (err) {
            console.log(err);
            res.status(422).json(err.errors)
        } else res.send(req.body);
    });
});

router.post('/adraft', eSession.isLoggedIn(), (req, res) => {
    console.log(req.body);
    res.send('you are drafting a post');
});

module.exports = router;