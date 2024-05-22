const JWT_SECRET = require('../config')
const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    const auth = req.headers.authorization
    if(!auth || !auth.startsWith('Bearer ')){
        res.status(403).send({})
    }

    const token = auth.split(' ')[1]
    try{
        const verifiedData = jwt.verify(token , JWT_SECRET)
        
        req.userId = verifiedData.userId;
        next();
    }
    catch(err){
        res.status(403).send({message : 'invalid authorization header 2'})

    }

}


module.exports={
    authMiddleware
}