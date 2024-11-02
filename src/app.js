import connectDB from "./db/index.js"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"

import cookieParser from "cookie-parser"
const app= express()

dotenv.config({
    path:"../.env"
})

app.use(cors({
    origin: process.env.CORS_ORIGIN , 
    credentials: true
}))
app.use(express.json ({}));
app.use(express.urlencoded ({extended: true}));
app.use(express.static("public"));
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'

// routes declaration 

app.use("/api/v1/users" , userRouter)

// route which is created by the above line is 
// http://localhost:9324/api/v1/users/
// iske aage jo chahe vo likha jayega like / register /login by routes only 
// ye /users jo h vo prefix ban gaya h aage jo bhi hoga vo routes me jaake call hoga 











export  { app }