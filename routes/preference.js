const express=require('express');
const router=express.Router();
const app = express();
app.use(express.urlencoded({ extended: true }))
const preferenceController=require('../controllers/preference_controller.js');
router.get('/preference', preferenceController.preferencePage);
router.post('/preference', preferenceController.savePreferences);
router.get('/update', preferenceController.updatePage);
router.post('/update-preference', preferenceController.updatePreferences);
//router.post('/createPreferences', )
module.exports=router;