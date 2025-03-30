const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const app = express();

// router.use(methodOverride('_method'));

const connectionController = require('../controllers/ConnectionController');
const { isLoggedIn, isAuthor, isNotAuthor } = require('../middlewares/auth');
const { validateId, validateConnection, validateResult, validateRSVP } = require('../middlewares/validator');

router.get('/', connectionController.connections);
router.get('/newConnection', isLoggedIn,connectionController.newConnection);
router.get('/connections', connectionController.connections);
router.get('/:id', validateId, connectionController.connection);
router.put('/:id',validateId, isLoggedIn, isAuthor, validateConnection, validateResult,connectionController.updateConnection);
router.get('/:id/edit', isLoggedIn, isAuthor,connectionController.editConnection);
router.post('/', isLoggedIn, validateConnection, validateResult, connectionController.addConnection);
router.delete("/:id/delete", validateId, isLoggedIn, isAuthor,connectionController.deleteConnection);
router.post('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, validateRSVP, validateResult,connectionController.updateRsvp);




module.exports = router;