let userPreference = require('../models/user_preference');
let sourceObject = require('../models/source');

module.exports.preferencePage = function (req, res) {
    return res.render('preference');
}

module.exports.savePreferences = async function (req, res) {
    try {
        await userPreference.createUserPreferences(req.body.preference, req.body.username);
        req.flash('success', 'Account Created. Please Sign in');
        return res.redirect('/users/sign-in');
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.updatePage = async function (req, res) {
    try {
        let user = {};
        user.username = res.locals.user.username;
        let sourceIds = await userPreference.getSourceIds(res.locals.user.username);
        let selectedSources = await sourceObject.getAllSources(sourceIds);
        let sources = await sourceObject.getAll();
        let data = {};
        data.sources = sources;
        data.selectedSources = selectedSources;
        return res.render('preferences-update', { data: data, user: user });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.updatePreferences = async function (req, res) {
    try {
        if(typeof req.body.preference == 'string')
            await userPreference.updatePreferences([parseInt(req.body.preference)], req.body.username);
        else
            await userPreference.updatePreferences(req.body.preference, req.body.username);
        return res.redirect('/users/home');
    }
    catch (err) {
        console.log(err);
    }
}