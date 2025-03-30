const path = require('path');
const { User } = require('../model/user');
const { model } = require('../model/connection');
const {rsvp} = require('../model/rsvp');


exports.index = (req, res) => {
    res.render('user/new');
}

exports.Signup = (req, res) => {
    console.log('in signup');
    const title = "Signup";
    res.render('user/new', { title });
}

exports.login = (req, res) => {
    const title = "Login";
    res.render('user/login', { title });
}

exports.create = (req, res, next) => {
    let user = new User(req.body);
    console.log(user);
    user
      .save()
      .then(() => res.redirect("/users/login"))
      .catch((err) => {
        //   if(err.name==='validationError'){
        //       req.flash('error', err.message);
        //       return res.redirect('/users/new');
        //   }
          if(err.code === 11000){
              req.flash('error', 'Email already exists');
              return res.redirect('/users/new');
          }
        next(err);
      });
  }

  exports.validateUser =  (req, res, next) => {
    //authenticate user
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
            console.log(user);
          user.comparePassword(password).then((result) => {
            if (result) {
                req.session.user = user._id;
                req.session.username = user.firstName + " " + user.lastName;
                req.flash('success', 'You are now logged in');
                
              res.redirect("/users/profile");
            } else{
                req.flash('error', 'Wrong password');
                res.redirect("/users/login");
                console.log("wrong password");
            }
          });
        } else {
            req.flash('error', 'Wrong email');
            console.log("wrong email");
            res.redirect("/users/login");}
      })
      .catch((err) => {
        next(err);
      });
  }

  exports.profile = (req, res) => {
    let id= req.session.user;
    const title = "Profile";
    Promise.all([
        User.findById(id),
        model.find({hostName: id}),
        rsvp.find({user: id}).populate('connection','title topic')
    ])
    .then((results)=>{
        const [user, connections, rsvps] = results;

        res.render("./user/profile",{ title, connections, rsvps, user});

    })
    .catch((err)=>{
        next(err);
    })

}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      } else {
        res.redirect("/users/login");
      }
    });
  }