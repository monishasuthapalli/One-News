const express=require('express');
const router=express.Router();
const app = express();
const passport=require('../config/passport');
app.use(express.urlencoded({ extended: true }))
const userController=require('../controllers/user_controller');
router.get('/home', userController.home);
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUp);
router.post('/create', userController.createUser);
router.get('/sign-out', userController.destroySession);
router.get('/update', userController.update);
router.post('/update-user', userController.updateUser);
router.get('/delete', userController.deleteUser);
router.get('/chart', userController.chart);
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), userController.createSession);
router.get('*', userController.pageNotFound);
module.exports=router;