const express = require('express');
const router = express.Router();

// Controllers 
const { register, login, updateProfile, secret } = require("../controllers/userController");
const { requireSignin, isAdmin } = require('../middlewares/authMiddleware');

// Router 
router.post('/register', register)
router.post('/login', login)
router.get('/auth-check', requireSignin, (req, res)=>{
    res.json({ok: true});
} );
router.get('/admin-check', requireSignin, isAdmin, (req, res)=>{
    res.json({ok: true});
} );
router.put('/profile', requireSignin, updateProfile );
router.get('/secret', requireSignin, isAdmin, secret);




module.exports = router;
