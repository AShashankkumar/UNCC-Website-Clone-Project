const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const methodOverride= require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require("./model/user");
const connectionRoutes = require('./routes/connectionRoutes');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/mainRoutes');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

app.use(bodyParser.urlencoded({ extended: true }));
global.partialPaths = {
    header: path.join(__dirname, 'views', 'partials', 'header'),
    footer: path.join(__dirname, 'views', 'partials', 'footer'),
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const PORT = 8084;
//connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/NBAD")
.then(()=>{
    //start the server
    app.listen(PORT, ()=>{
        console.log('Server is running on port', PORT);
    });
})
.catch(err=>console.log(err.message));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(morgan('combined'));

//create session
app.use(session({
  secret: 'nbadprojectsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 60 * 60 * 1000
  },
  store: new MongoStore({ mongoUrl: 'mongodb://127.0.0.1:27017/NBAD' })
}));

app.use(flash());
//create middleware
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.user = req.session.user||null;
  res.locals.username = req.session.username||null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
})

app.use('/', mainRoutes);

app.use('/connections', connectionRoutes);

app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error("The server cannot locate " + req.url);
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    if (!err.status) {
      err.status = 500;
      err.message = "Internal Server Error";
    }
    res.status(err.status);
    res.render("home/error", { error: err, title: "error page" });
  });
  
