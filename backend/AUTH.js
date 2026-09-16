const express=require("express")
// const cors=require("cors")
// app.use(cors())
// const mongoose=require("mongoose")
// const router=express.Router()


// const connectdb=async()=>{
//     try {
//         await mongoose.connect("mongodb://Database:Database123@ac-3zlwmit-shard-00-00.mq3g4jf.mongodb.net:27017,ac-3zlwmit-shard-00-01.mq3g4jf.mongodb.net:27017,ac-3zlwmit-shard-00-02.mq3g4jf.mongodb.net:27017/?ssl=true&replicaSet=atlas-b4fj1j-shard-0&authSource=admin&appName=Databasefirst")
//         console.log("DB Connected")
//     } catch (error) {
//         console.log("Not connected",error)
//     }
// }

const Usermodel=require('./user')
const bcrypt=require("bcrypt");
const user = require("./user");

const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newdate=new Date();
        const hashed = await bcrypt.hash(password, 10);

        const newuser = new Usermodel({
            username,
            password: hashed,
            createdAt:newdate
        });

        await newuser.save();

        res.status(201).send("User registered");

    } catch (err) {
        console.log(err);
        res.status(500).send("Signup error");
    }
};

const login=async(req,res)=>{
    const {username,password}=req.body;
    const u=await Usermodel.findOne({username})
    if(!u){
        return res.status(404).send("NO USER")
    }

    const isuser=await bcrypt.compare(password,u.password);

    if(!isuser){
        return res.status(401).send("wrong password")
    }
//    islogin=true
     res.json(u)
     
     localStorage.setItem("userid", u._id);
    // res.status(200).send("Login successful")
}
module.exports={signup,login}