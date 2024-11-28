const express = require('express')
const connectDB = require('./utils/databaseConfig')
const router = require('./routes/routes')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
connectDB
require('dotenv').config()
connectDB()
app.use(cors({
    origin:["http://localhost:3000"],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
    optionsSuccessStatus:200}))
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/',router)
app.listen(process.env.PORT,()=>{
    console.log(`Server started running on port ${process.env.PORT}`)
})