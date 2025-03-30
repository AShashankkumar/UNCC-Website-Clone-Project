const {body, validationResult} = require('express-validator');
const moment = require('moment');
exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignup = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email address must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 long').isLength({min: 8, max: 64})
]

exports.validateLogin = [
    body('email', 'Email address must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 long').isLength({min: 8, max: 64})
]

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    return next();
}

exports.validateConnection = [
    body('title', 'name cannot be empty').notEmpty().trim().escape(),
    body('topic', 'topic cannot be empty').notEmpty().trim().escape(),
    body('details', 'details cannot be empty').notEmpty().trim().escape(),
    body('location', 'where cannot be empty').notEmpty().trim().escape(),
    body('date', 'date cannot be empty | must be a valid date | must be after today').notEmpty().trim().escape(),
    body('date').custom((value)=>{
        console.log(value);
        const inputDate = new Date(value);
        console.log(inputDate);
        if(moment(inputDate, moment.ISO_8601, true).isValid())
        return true;
    }).withMessage('Date must be in a valid format')
        
      .custom((value) => {
       const inputData = moment(value, 'YYYY-MM-DD', true);

        console.log(inputData);
        console.log(moment());
        return inputData.isValid() && inputData.isAfter(moment(), 'day');
    }).withMessage('Date must be after today'),
    body('startTime', 'start must be a valid time').matches(/^(\d{2}):(\d{2})$/),
    body('endTime', 'end must be a valid time')
      .matches(/^(\d{2}):(\d{2})$/)
      .custom((value, { req }) => {
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        return startTime && endTime && startTime < endTime;
      })
      .withMessage('end time must come after start time'),
    body('image', 'image cannot be empty').notEmpty().trim()
]

exports.validateRSVP = [
    body('rsvp', 'rsvp cannot be empty. please use either yes, no or maybe').notEmpty().trim().escape().toLowerCase().isIn(['yes', 'no', 'maybe'])
]