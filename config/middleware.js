
//adding flash to locals for ejs use
module.exports.setFlash = function (req, res, next) {
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}