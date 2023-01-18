const express = require('express');
const router = express.Router();

// Controllers 
const { register } = require("../controllers/userController");

// Router 
router.post('/register', register)



module.exports = router;
