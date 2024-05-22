const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config();

const URL = process.env.URL ; 


mongoose.connect(URL)


const UserSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
        
    },
    password :{
        type : String,
        required : true
        
    },
    firstName: {
        type : String,
        required : true
        
    },
    lastName: {
        type : String,
        required : true
        
    },

})



const AccountSchema = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const User = mongoose.model("User",UserSchema)
const Account = mongoose.model("Account" , AccountSchema)





module.exports={
    User , 
    Account
}