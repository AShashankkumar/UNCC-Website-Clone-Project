const path = require('path');

exports.index = (req, res) => {
    const title = "HOME"
    res.render('home/index', {title}); 
};

exports.about = (req, res) => {
    const title = "ABOUT"
    res.render('home/about', {title}); 
};

exports.contact = (req, res) => {
    const title = "CONTACT"
    res.render('home/contact', {title}); 
};

exports.error = (req, res) => {
    const title = "ERROR"
    res.render('home/error', {title}); 
};