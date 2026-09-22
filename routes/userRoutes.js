import express from "express";
const router = express.Router();  //express.Router() creates a mini Express application specifically for handling routes.
import mongoose from "mongoose";
// router = group/container for related routes   
// post route to add a person
import {user} from "../models/user.model.js";
import {jwtAuthMiddleware, generateToken} from "./../jwt.js";

router.post('/signup' , async(req, res) => {
try{ const data = req.body ;// Assuming the req body contains the person data
    
     // Check whether an admin already exists
    // First user = admin
    // All following users = voter
    const existingAdmin = await user.findOne({role : 'admin'});
    if(!existingAdmin){
        data.role = "admin";
    }else{
        data.role = 'voter';
    }
    // console.log("REQ BODY:", req.body);
    // console.log("ADDRESS:", req.body.address);
    // Create a new person document using the Mongoose model
    const newUser = new user(data);

    //save the new person
   const response = await newUser.save();
   console.log("data saved");

   const payload = {
    id : response.id
   };

   console.log(JSON.stringify(payload));

   const token = generateToken(payload); // JWT payload must be an object
   console.log("Token" , token);

   res.status(200).json({response : response , token : token});
}catch(err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
}

})
 
// login route 
router.post('/login', async(req, res) => {
    try {
        //Extract aadharCardNumber and password from the req body
        const {aadharCardNumber, password} = req.body;

        //find user by username
        const userData = await user.findOne({aadharCardNumber : aadharCardNumber});

        //if the user and password does not match then written error 
        if(!userData || !(await userData.comparePassword(password))){
            return res.status(401).json({error : "Invalid username and password"})
        };

        //generate token   //When you generated the token during signup/login, you put the user's ID inside the payload:
        const payload = {
          id : userData.id 
        };

        const token = generateToken(payload);

        //return token as response 
        res.json({token});
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal Server Error"});
    }
})


// Profile route  (protected route)   profile route to retrieve user information
router.get('/profile',jwtAuthMiddleware, async(req ,res) => {
    try {
        // const userData = req.user;
        // console.log("userData: ", userData );
          
        const userId = req.user.id;  //Take the user's ID from the decoded JWT and store it in userId.
        const userData = await user.findById(userId).select("-password"); //Don't include the password field in the returned document.

        // console.log("Decoded user:", req.user);
        // console.log("User ID:", userId);
        // console.log("User data:", userData);

        if(!userData){
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({user : userData});
    } catch (error) {
         console.log(error);
         res.status(500).json({error : "Internal Server Error"});
    }
})

// Update the existing document by using unique identiifier as id
router.put('/profile/password', jwtAuthMiddleware, async(req ,res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const{currentPassword , newPassword} = req.body; // Extract the currentPassword and newPassword from req.body

        // find the user by the userId 
        const userData = await user.findById(userId);
        
        // if password does not match then throw error 
        if(!(await userData.comparePassword(currentPassword))){
            return res.status(401).json({error : "Invalid username and password"})
        };
        
        // else update user new password
        userData.password = newPassword;
        await userData.save();

        console.log("Password Update Successfully");
        res.status(200).json({message : "Password Updated"});
    } catch (error) {
                console.log(error);
               res.status(500).json({
            error : "Internal Server Error"
        })
    }
})

// Delete the existing document 
router.delete('/:id' , async (req,res) => {
    try {
        const UserId = req.params.id; // Extract the User's id fromthe URL paramneter
        
        // Assuming you have the person model
        const response = await user.findByIdAndDelete(personId);
        if(!response){
            return res.status(401).json({error : "Invalid person"});
        }
        console.log("data deleted");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : "Internal Server Error"
        })
    }
})


export default router;