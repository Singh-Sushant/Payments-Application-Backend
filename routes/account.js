const express = require('express');
const { authMiddleware } = require('./middleware');
const router = express.Router();
const mongoose = require('mongoose')
const {Account} = require('../db')

router.get('/balance', authMiddleware , async (req ,res)=>{
    const account = await Account.findOne({
        userId : req.userId
    })
    
    res.json({
        balance : account.balance
    })
})

router.post('/transfer' , authMiddleware , async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const{amount , to}= req.body

    //Fetch current account 
    const account = await Account.findOne({
        userId : req.userId
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction()

        return res.json({
            message : "insufficient balance"
        })
    }

    //fetch account to transfer money 
    const toAccount = await Account.findOne({
        userId : to
    }).session(session)

    if(!toAccount){
        await session.abortTransaction();
        res.status(400).json({
            message : "Invalid Account"
        })
    }

    // Transfer Money
    await Account.updateOne({userId : req.userId} ,
        {
            $inc : {
                balance : -amount
            }
        }
    ).session(session)

    await Account.updateOne({userId : to } , {
        $inc :{
            balance : amount
        }
    }).session(session)

    await session.commitTransaction();
    res.json({
        message : "Transaction Successfull"
    })

})


module.exports = router