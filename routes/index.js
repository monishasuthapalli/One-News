const express=require('express');
const router=express.Router();
const app = express();
app.use(express.urlencoded({ extended: true }))
const userController=require('../controllers/user_controller');
router.get('/',userController.signUp);
router.use('/users',require('./user'));
router.use('/preferences', require('./preference'));
router.use('/bookmark', require('./bookmark'));
module.exports=router;