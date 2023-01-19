const express = require('express');
const router = express.Router();

// Controllers 
const { register, login, updateProfile, secret, getOrders, allOrders } = require("../controllers/userController");
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

// testing purposes
router.get('/secret', requireSignin, isAdmin, secret);

// orders
router.get("/orders", requireSignin, getOrders);
router.get("/all-orders", requireSignin, isAdmin, allOrders);


module.exports = router;
