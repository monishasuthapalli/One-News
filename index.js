const express = require('express');
//const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const store = require('better-express-store');
const passport = require('./config/passport');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const app = express();
const config = require('./config.js');
const createTables = require('./config/sqllite3').createTables;
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./assets'));
//layouts setup
app.use(expressLayouts);
createTables();
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setting view engine 
app.set('view engine', 'ejs');
app.set('views', './views');

// When setting up express session
app.use(session({
    secret: 'Team 1 Assignment 2',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    // change dbPath to the path to your database file
    store: store({ dbPath: './db/'+ config.dbFileName})
}));

app.use(passport.initialize());
app.use(passport.session());

//if the user is already authenticated, sets the user in locals
app.use(passport.setAuthenticatedUser);

//using flash messages
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes/index.js'));
app.listen(config.PORT, function (err) {
    if (err) {
        console.log("error in runnning the server", err);
        return;
    }

    console.log("Express Server is running on port", config.PORT);
})

module.exports = app;