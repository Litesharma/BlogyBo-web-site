const { Router } = require("express");
const {
    upload,handleBlogUserGetRoute,handleBlogPostRoute, handleBlogGetRoute, handleGetLoginRoute, handleLogoutCookie, handleHomePage, handlePostSignupRoute, handleGetSignupRoute, handlePostLoginRoute
    }
    = require("../controllers/user");
const router = Router();



router.get('/signup', handleGetSignupRoute);
router.post('/signup', handlePostSignupRoute);
router.get('/login', handleGetLoginRoute);
router.post('/login', handlePostLoginRoute);
router.get('/', handleHomePage);
router.get('/logout', handleLogoutCookie);

//blog routes
router.get('/blog', handleBlogGetRoute);
router.post('/blog',upload.single("coverImgUrl"),handleBlogPostRoute);
router.get('/:id', handleBlogUserGetRoute);


module.exports = router;
