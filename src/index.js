import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path:'./env'
})


app.get('/', (req, res) => {
    res.status(200).send('Server is running ')
  })

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is listening at port:${process.env.PORT}`);
    }) 
})
.catch((err) => {
    console.log("MONGODB connection failed !!!!" , err);

})