const express = require('express');
const router = express.Router();
const root = "../..";
const db = require(`${root}/db/db`);
const Word = require(`${root}/model/Word`);
const eSession = require('easy-session');
const path = require('path');
const mp3Dir = path.resolve(__dirname, '../../db/mp3/')
const fs = require('fs');
router.get('/', (req, res) => {
    // send trending words
    res.send('top words');
});
router.get('/headwords', (req, res) => {
    Word.find({}, {
        headword: 1
    }).exec((err, word) => {
        if (err) res.send(err);
        res.json(word);
    });
});

router.get('/wordofday', (req, res) => {
    Word.findOne({}, {
        _id: 0,
        meta: 0
    }).exec((err, word) => {
        if (err) res.send(err);
        res.json(word);
    });
});

// search word
router.get('/s=:headword', (req, res) => {

    Word.findOne({
        headword: req.params.headword
    }, {
        _id: 0,
        meta: 0
    }).exec((err, word) => {
        if (err) res.send(err);

        // if now word was found
        if (!word)
            res.sendStatus(404);
        else
            res.json(word);
    });
});

// send pronunciation file
router.get('/mp3/f=:filename', (req, res) => {
    res.sendFile(`${mp3Dir}/${req.params.filename}`);
});

router.get('/suggestion/s=:headword', (req, res) => {
    Word.find({
        headword: {
            $regex: "^" + req.params.headword
        }
    }, {
        _id: 0,
        headword: 1
    }).exec((err, words) => {
        if (err) res.send(err);
        // if now word was found


        // if no word found , or just the same word was found send 404
        if (words.length <= 0 || (words.length == 1 && words[0] == req.params.headword))
            res.sendStatus(404);
        else
            res.json(words);
    });
});


// PROTECTED PATHS ===========================================

// upload pronunciation
router.post('/mp3/upload', eSession.isLoggedIn(), (req, res) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let mp3File = req.files.attachment;
    console.log(mp3File);
    if(!mp3File) return res.status(500).send(err);
    mp3File.mv(`${mp3Dir}/${mp3File.name}`, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});


// add word
router.post('/save', eSession.isLoggedIn(), (req, res) => {
    new Word(req.body).save(function (err) {
        if (err) {
            console.log(err);
            res.status(422).json(err.errors)
        } else res.send('ok');
    });
});

// update word
router.post('/update', eSession.isLoggedIn(), (req, res) => {
    res.send('updating a word');
});


// delete word
router.get("/delete/:id", eSession.isLoggedIn(), (req, res) => {
    // deleted the user_name
    Word.deleteOne({
        _id: req.params.id
    }, function (err) {
        if (err) console.log(err);
        else res.send('ok');
    });
});

module.exports = router;