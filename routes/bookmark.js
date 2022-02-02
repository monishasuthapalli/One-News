const express=require('express');
const router=express.Router();
const app = express();
app.use(express.urlencoded({ extended: true }))
const bookmarkController=require('../controllers/bookmark_controller.js');
router.get('/bookmarks', bookmarkController.bookmarksPage);
router.post('/add-bookmark', bookmarkController.addBookmark);
router.post('/remove-bookmark', bookmarkController.deleteBookMark);
module.exports=router;