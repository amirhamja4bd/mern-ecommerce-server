const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } =require("../helpers/authHelper");
const Order = require("../models/orderModel");
require("dotenv").config;


exports.register = async (req, res )=> {
    try {
    // 1. destructure name, email, password from req.body
    const {name , email, password} = req.body;

    // 2. all fields require validation
    if(!name.trim()){
        return res.json({error: "Name is Required"})
    }
    if(!email){
        return res.json({error: "Email is Required"})
    }
    if(!password || password.length < 6){
        return res.json({error: "Password must be at least 6 characters"});
    }

    // 3. check if email is taken
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.json({error: "Email already taken"});
    }

    // 4. hash password
    const hashedPassword = await hashPassword(password);

    // 5. register user
    const user = await new User({ name, email, password: hashedPassword}).save();

    // 6. create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn: "7d"});

    // 7. send response
    res.json({
        user:{
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address
        }, token
    })
    }catch(error){
        console.log(error);
    }
};

//Login
exports.login = async (req, res ) =>{
    try{
    // 1. destructure name, email, password from req.body
    const { name, email, password } = req.body;
    // 2. all fields require validation
    if(!email){
        return res.json({ error:"Email is taken"})
    }
    if(!password || password.length <6){
        return res.json({error:"Password must be at least 6 characters "})
    }
    // 3. check if email is taken
    const user = await User.findOne({email});
    if(!user){
        return res.json({error:"User Not Found"})
    }
    // 4. compare password
    const match =await comparePassword(password, user.password);
    if(!match){
        return res.json({error:"Wrong password"})
    }
    // 5. create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", } );
    // 7. send response
    res.json({
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
        },
        token
    });
    }
    catch(error){
        console.log(error);
    }
};

// Test purpose
exports.secret = async (req, res) => {
    res.json({ currentUser: req.user});
};

// Profile UUpdate
exports.updateProfile = async (req, res) => {
    try{
        const { name, password, address } = req.body;
        const user = await User.findById(req.user._id);
        // check password length
        if (password && password.length < 6){
            return res.json({ error:"Password is required and must be at least 6 characters", });
        }
        // hash the password
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updated = await User.findByIdAndUpdate(req.user._id, 
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                address: address || user.address,
            }, {new: true}
            );

            updated.password = undefined;
            res.json(updated);
    }
    catch(error){
        console.log(error);
    }
}

// GetOrder
exports.getOrders = async (req, res) => {
    try {
      const orders = await Order.find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (err) {
      console.log(err);
    }
  };
  
  // All Order
  exports.allOrders = async (req, res) => {
    try {
      const orders = await Order.find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (err) {
      console.log(err);
    }
  };
  