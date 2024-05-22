const express = require('express')
const router = express.Router();
const z = require('zod')
const {User} = require("../db")
const {Account} = require('../db')
const jwt = require('jsonwebtoken');
const JWT_SECRET  = require('../config');
const { authMiddleware } = require('./middleware');
router.use(express.json())



// SIGN UP

const userSignup = z.object({
    username : z.string(),
    password : z.string().min(6),
    firstName : z.string(),
    lastName : z.string()
})

router.post('/signup' , async (req,res)=>{

    const body = req.body
    const {success} = userSignup.safeParse(body)
    if(!success){
        return res.json({
            message : "Incorrect inputs"
        })
    }
    
    
    const user = await User.findOne({
        username : body.username
    })

    
    if(user){
         return res.json({
            message : "Email already taken / Incorrect inputs"
        })
    }
    
    const dbUser = await User.create(body);

    const userId = dbUser._id;

    // Create an account for the user 

    await Account.create({
        userId : userId,
        balance : 1+ Math.random() * 1000
    })


    const token = jwt.sign({
        userId : dbUser._id
    },JWT_SECRET)

    res.json({
        message : "User created sucessfully",
        token : token
    })

})


// SIGN IN

const zodSignin = z.object({
    username : z.string(),
    password : z.string()
})

router.post('/signin' , async(req,res)=>{
    const {success} = zodSignin.safeParse({
        username : req.body.username,
        password : req.body.password
    })
    
    if(!success){
        return res.json({
            message : "Incorrect Username / Password"
        })
    }


    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })
    if(user){

        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET)
        
        return res.json({
            in : true,
            token : token
        })
    }
    else{
        return res.json({
            in : false
        })
    }

})



// UPDATE USER INFO 

const updateInfo = z.object({
    password : z.string().optional(),
    firstName : z.string().optional() , 
    lastName : z.string().optional()
})

router.put('/', authMiddleware , async (req,res)=>{
    const {success} = updateInfo.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message : "Error while updating info"
        })
    }

    await User.updateOne({
        id : req.userId
    })
    res.json({
        message: "updated successfully"
    })
})


// SEARCH USERS TO SEND MONEY  

router.get('/bulk' , async(req,res)=>{
    const filter = req.query.filter || "" ;

    const users = await User.find({
        $or :[{
            firstName : {
                $regex : filter
            }
        },{
            lastName : {
                $regex : filter
            }
        }]
    })

    res.json({
        user : users.map((user=>({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        })))
    })
})




module.exports = router
