const express = require("express");
const app = express();
const mainRouter = require('./routes/index.js')
const cors = require('cors')
require('dotenv').config();

const PORT= process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/v1' , mainRouter)



app.listen(PORT , ()=>{
    console.log("server running on port 4000");
})

