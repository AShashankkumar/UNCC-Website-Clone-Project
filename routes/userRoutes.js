const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { validateSignup, validateResult, validateLogin } = require('../middlewares/validator');

console.log(
    "in userRoutes.js"
)
router.get('/', isGuest, userController.index);
router.get('/new',isGuest, userController.Signup);
router.get('/login',isGuest, userController.login);

//create new user
router.post("/", isGuest, validateSignup, validateResult, userController.create);

router.post("/login",loginLimiter, isGuest, validateLogin, validateResult ,userController.validateUser);


router.get("/profile", isLoggedIn, userController.profile)

//logout 
router.get("/logout", isLoggedIn,userController.logout);



module.exports = router;