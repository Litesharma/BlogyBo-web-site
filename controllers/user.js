const UserInDatabase = require('../models/user');
const { createTokenForUser } = require("../services/authentication");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const blog = require("../models/blog");

var user; 

// Function to handle GET request to signup page
function handleGetSignupRoute(req, res) {
    return res.render("signup");
}

// Function to handle GET request to login page
function handleGetLoginRoute(req, res) {
    return res.render("login");
}

// Function to handle POST request to signup a new user
async function handlePostSignupRoute(req, res) {
    const { fullName, email, password } = req.body;

    try {
        await UserInDatabase.create({
            fullName,
            email,
            password,
        });
        return res.redirect("login");
    } catch (error) {
        console.error('Error during user signup:', error);
        return res.status(500).send('Error creating user');
    }
}

// Function to handle POST request to login a user
async function handlePostLoginRoute(req, res) {
    const { email, password } = req.body;
    try {
        // Validate user credentials
        const isPasswordMatch = await UserInDatabase.matchPassword(email, password);
        if (isPasswordMatch) {
            const token = createTokenForUser(email);
            user = await UserInDatabase.user(email); 
            return res.cookie("token", token).redirect('/');
        } else {
            return res.render('login', {
                error: "Invalid email or password"
            });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).render('login', {
            error: 'An error occurred while logging in'
        });
    }
}

// Function to handle rendering the home page
async function handleHomePage(req, res) {
    if (user) {
        try {
            const allBlogs = await blog.find({createdBy:user._id}).lean(); 
            return res.render("home", {
                user: user,
                blogs: allBlogs,
            });
        } catch (error) {
            console.error('Error fetching blogs:', error);
            return res.status(500).send('Error fetching blogs');
        }
    } else {
        return res.clearCookie("token").render("cover");
    }
}

// Function to handle logging out and clearing the token cookie
async function handleLogoutCookie(req, res) {
    return res.clearCookie("token").render("cover");
}

// Ensure the uploads directory exists
const uploadDir = path.resolve('./public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

// Multer middleware for file uploads
const upload = multer({ storage: storage });
// Function to handle GET request for viewing a specific blog
async function handleBlogUserGetRoute(req, res) {
    try {
        const userBlog = await blog.findById(req.params.id);

        return res.render('blogView', {
            user: user,
            blog: userBlog,
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return res.status(500).send('Internal Server Error');
    }
}


// Function to handle rendering the page for creating a new blog post
async function handleBlogGetRoute(req, res) {
    return res.render("blog", {
        user: user,
    });
}

// Function to handle POST request for creating a new blog post
async function handleBlogPostRoute(req, res) {
    const { title, body } = req.body;

    try {
        // Assuming createdBy field is set to the current user's ID
        await blog.create({
            title,
            body,
            coverImgUrl: `/uploads/${req.file.filename}`,
            createdBy: user._id,
        });
        return res.redirect('/');
    } catch (error) {
        console.error("Error creating blog post:", error);
        return res.status(500).send("An error occurred while creating the blog post.");
    }
}

module.exports = {
    handleGetSignupRoute,
    handleGetLoginRoute,
    handlePostSignupRoute,
    handlePostLoginRoute,
    handleHomePage,
    handleLogoutCookie,
    handleBlogGetRoute,
    handleBlogPostRoute,
    handleBlogUserGetRoute,
    upload,
};
