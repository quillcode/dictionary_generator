const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const eSession = require('easy-session');
const rbac_options  = {
    blogger: { // Role name
        can: [ // list of allowed operations
            'account',
            'post:add',
            {
                name: 'post:save',
                when: async (params) => params.userId === params.ownerId
            },
            'user:create',
            {
                name: 'user:*',
                when: async (params) => params.id === params.userId
            }
        ]
    },
    lexicographer: {
        can: ['post:save', 'post:delete', 'account:*'],
        // inherits: ['blogger']
    },
    admin: {
        can: ['rule the server'],
        inherits: ['lexicographer']
    }
}

app.use(fileUpload());

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));

// Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Express Session
app.use(session({
    secret: 'every day',
    resave: false,
    saveUninitialized: true
}));
app.use(eSession.main(session, {rbac: rbac_options}));


// routes

app.use('/static', express.static(path.join(__dirname, '../view/pages/assets'), {
    etag: false // don't cache files
}));
const View = require('../view/View.js');
app.use('/', View);

const dictionary = require('../routes/api/dictionary');
app.use('/api/dictionary', dictionary);

const users = require('../routes/api/users');
app.use('/api/users', users);

const blog = require('../routes/api/blog');
app.use('/api/blog', blog);


const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`SERVER STARTED ON PORT: ${port}`);
});