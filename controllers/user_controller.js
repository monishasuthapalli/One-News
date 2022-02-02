const axios = require('axios');
let userObject = require('../models/user');
let sourceObject = require('../models/source');
let userPreferenceObject = require('../models/user_preference');
let bookMarkObject = require('../models/bookmark');
let helper = require('../utilities/helper');
const config = require('../config.js');
var passwordValidator = require('password-validator');
//render the sign Up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'Signed In');
        return res.status(200).redirect('/users/home');
    }
    return res.status(200).render('sign_up');
}

//render sign-in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        req.flash('success', 'Signed In');
        return res.status(200).redirect('/users/home');
    }
    return res.status(200).render('sign_in');
}

module.exports.home = async function (req, res) {
    if (req.isAuthenticated()) {
        let user = {};
        let data = [];
        try {
            user.username = res.locals.user.username;
            let sourceIds = await userPreferenceObject.getSourceIds(res.locals.user.username);
            if (sourceIds.length == 0) {
                let response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&pageSize=100&apiKey=' + config.apiKey);
                data = response.data.articles;
                return res.render('home', { data: data });
            }
            else {
                let sources = await sourceObject.getAllSources(sourceIds);
                res.locals.user.sources = sources;
                let url = 'https://newsapi.org/v2/top-headlines?sources=';
                for (let i = 0; i < sources.length; i++) {
                    if (i == 0)
                        url = url + sources[i];
                    else
                        url = url + ',' + sources[i];
                }
                let response = await axios.get(url + '&apiKey=' + config.apiKey);
                data = response.data.articles;
                return res.render('home', { data: data, user: user, chartData: "No Data" });
            }
        }
        catch (error) {
            console.log(error);
            return res.render('home', { data: "NoData" });
        }
    }
    req.flash('error', 'Please SignIn/SignUp');
    return res.redirect('/users/sign-in');
}

function isValidPassword(req, password, confirm_password) {
    if (password != confirm_password) {
        req.flash('error', 'Passwords do not match');
        return false;
    }
    var schema = new passwordValidator();
    schema
        .is().min(6)                                    // Minimum length 6
        .is().max(30)                                   // Maximum length 30
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(1)                                // Must have at least 1 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['password', '123456', 'abcdef', 'qwerty', '111111', 'qwerty123', '12345678', '1234567890', '1q2w3e', '123456789']); // Blacklist these values
    if (!schema.validate(password)) {
        req.flash('error', 'Password too small');
        return false;
    }
    return true;
}

module.exports.createUser = async function (req, res) {
    try {
        if (!isValidPassword(req, req.body.password, req.body.confirm_password))
            return res.redirect('/users/sign-up');

        if (await userObject.isUserPresent(req.body.username)) {
            req.flash('error', 'User already present');
            return res.status(200).redirect('/users/sign-in');
        }
        else {
            let user = await userObject.createUser(req.body.username, req.body.email, req.body.password);
            req.flash('success', 'Successfully signed Up');
            let sources = await sourceObject.getAll();
            let data = {};
            data.sources = sources;
            return res.render('preference', { data: data, user: user });
        }
    }
    catch (err) {
        console.log("Error in creating user" + err.message);
    }
}

module.exports.createSession = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            req.flash('success', 'Logged In');
            return res.redirect('/users/home');
        }
        res.status(200).redirect('/users/sign-up')
    }
    catch (err) {
        console.log('Error logging in user' + err.message);
    }
}

module.exports.update = async function (req, res) {
    if (req.isAuthenticated()) {
        return res.render('update');
    }
    return res.redirect('/users/sign-in')
}

module.exports.chart = async function (req, res) {
    if (req.isAuthenticated()) {
        let chartData = await userPreferenceObject.chartData();
        let weatherData = await helper.getWeatherData();
        res.locals.user.chartData = chartData;
        res.locals.user.weatherData = weatherData;
        return res.render('chart');
    }
    return res.redirect('/users/sign-in')
}

module.exports.updateUser = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            if (!isValidPassword(req, req.body.password, req.body.confirm_password))
                return res.redirect('/users/update');
            await userObject.updateUser(req.body.username, req.body.email, req.body.password);
            res.locals.user.email = req.body.email;
            req.flash('success', 'Details updated');
            res.redirect('/users/home');
        }
        else
            return res.redirect('/users/sign-in');
    }
    catch (err) {
        console.log('Error updating email' + err.message);
    }
}

module.exports.deleteUser = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            req.logout();
            await userObject.deleteUser(res.locals.user.username);
            await userPreferenceObject.deletePreferences(res.locals.user.username);
            await bookMarkObject.deleteBookMarks(res.locals.user.username);
            req.flash('error', 'Sorry to see you go');
            return res.redirect('/users/sign-up');
        }
    }
    catch (err) {
        console.log('Error deleting in user' + err.message);
    }
}

module.exports.pageNotFound = function (req, res) {
    if (req.isAuthenticated)
        res.redirect('/users/home');
    else
        res.redirect('users/sign-in')
}

//destroys the session when user clicks logout
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('error', 'Logged out');
    return res.redirect('/users/sign-in');
}