import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const generateAccessandRefreshToken = async(userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
  
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})
  
      return{ accessToken , refreshToken }
  
    } catch (error) {
      return res 
      .status(500)
      .json({meaasge: "Something went wrong while generating refresh and access token "});
      
    }
}

const registerUser = async (req, res) => {
    const { fullname, username, email, password } = req.body;

  console.log("name", fullname);
  console.log("username", username); 
  console.log("email", email);
  console.log(password);

  const imageFile = req.files["image"] ? req.files["image"][0] : null;
  let uploadResponse;
  if (imageFile) {
    try {
      uploadResponse = await uploadOnCloudinary(imageFile.path);
      fs.unlinkSync(imageFile.path);
    } catch (error) {
      return res.status(500).json({ message: "Image upload to Cloudinary failed." });
    }
  }


  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
   console.log(existedUser)
   if (existedUser) {
      return res.status(400).json({
        status: 400,
        message: "User already exists with this email or username",
      });
    }

    console.log("there")
  const user = await User.create({
    fullname,
    //image: uploadResponse?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log(createdUser)

  if (!createdUser) {
      return res
         .status(500)
         .json({ message: "User registration failed. Please try again." });
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
};

const loginUser = async (req, res) => {
    const{email , username , password} = req.body
  console.log(req.body);
  if (!username && !email ){
    return res
    .status(400)
    .json({message: "username or email is required for login"});
  }


  const user = await User.findOne({
    $or: [{username} , {email}]
  })

  if(!user) {
    return res
    .status(404)
    .json({message: "User does not exist "});
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if(!isPasswordValid) {
    return res
    .status(401)
    .json({message: "The password is wrong "});
  }

  const {accessToken , refreshToken } = await generateAccessandRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id)
  .select("-password -refreshToken")

  const options = {
    httpOnly: true, 
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken , options)
  .cookie("refreshToken", refreshToken , options)
  .json(new ApiResponse(
    200, {
      user: loggedInUser , accessToken , refreshToken
    },
    "User logged In Successfully"
  ))


};

const logoutUser = async(req, res ,next)=> {
    try {
      const {userId} = req.body;
      await User.findByIdAndUpdate(userId||
        req.user._id,
        {
          $set: {
            refreshToken: undefined
          }
        },
        {
          new: true
        }
      )
    
      const options = {
        httpOnly: true, 
        secure: true
      }
    
      return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json("User logged out");
    
    
    } catch (error) {
      next(error);
      
    }
  }
  
  export { registerUser ,loginUser, logoutUser
};
