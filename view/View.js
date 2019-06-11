const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // send index page
    res.status(200).sendFile('pages/index.html', {
        root: __dirname
    });
});

router.get('/blog', (req, res) => {
    // send trending words
    res.status(200).sendFile('pages/blog/blog.html', {
        root: __dirname
    });
});

router.get('/blog/v/:id', (req, res) => {
    // send trending words
    res.status(200).sendFile('pages/blog/postview.html', {
        root: __dirname
    });
});




router.get('/about', (req, res) => {
    // send trending words
    res.status(200).sendFile('pages/about.html', {
        root: __dirname
    });
});


router.get('/login', (req, res) => {
    // if already logged in redirect to user main page
    if (req.session.isLoggedIn()) return res.redirect(`/${req.session.getRole()}`);
    else {
        res.setHeader("Cache-Control", "max-age=0,must-revalidate");
        res.status(200).sendFile('pages/login.html', {
            root: __dirname
        });
    }

});

// IMAGE ROUTES
// blog hero image
router.get('/img/bhero', (req, res) => {
    // if already logged in redirect to user main page
    res.json({path:"hero"});

});


// PROTECTED PATHS ====================================

router.get('/admin', (req, res) => {

    // if logged in as admin
    sendIfLoggedIn(req, res, 'pages/admin.html', 'admin');

});

router.get('/lexicographer', (req, res) => {
    // send trending words
    sendIfLoggedIn(req, res, 'pages/lexicographer.html' , 'lexicographer');
});

router.get('/blogger', (req, res) => {
    // send trending words
    sendIfLoggedIn(req, res, 'pages/blog/blogger.html', 'blogger');
});

function sendIfLoggedIn(req, res, page, role) {

    res.setHeader("Cache-Control", "max-age=0,must-revalidate");

    // check if the user is logged in , if not redirect to login page 
    if (req.session.isLoggedIn()) {

        // if role is set make sure, the user have the previlidge
        // console.log(role);
        if (role && req.session.getRole() !== role.toLowerCase() && req.session.getRole() !== 'admin') {
            console.log('Un Authorized Page Access: ' + page + ' accessd by ' +  role)
            res.redirect('/' + req.session.getRole());
        }
        else
        res.status(200).sendFile(page, {
            root: __dirname
        });
    } else res.redirect('/login');
}

module.exports = router;