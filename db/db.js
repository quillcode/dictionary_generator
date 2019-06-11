const mongoose = require('mongoose');
const dbpath = 'mongodb://localhost/amarpl';
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(dbpath);
const db = mongoose.connection;

// check connection
db.once('open', ()=>{
    console.log('MongoDB: Connected to: ', dbpath);
});

//check for errors
db.on('error', (error)=>{
    console.error(error);
    
})

module.exports = db;

/* 
    DBS
    word db
    users db
*/