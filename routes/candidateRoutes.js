import express from "express";
const router = express.Router();  //express.Router() creates a mini Express application specifically for handling routes.
import mongoose from "mongoose";
// router = group/container for related routes   
// post route to add a person
import {user} from "../models/user.model.js";
import {candidate} from "../models/candidate.model.js";
import {jwtAuthMiddleware, generateToken} from "./../jwt.js";


const checkAdminRole = async(userId) => {
     try {
        const userData = await user.findById(userId);
        if( userData.role==='admin'){
            return true;
        }
     } catch (error) {
        return false;
     }
}

// post route to create a candidate
router.post('/' ,jwtAuthMiddleware, async(req, res) => {
   try{ 
    if(!(await checkAdminRole(req.user.id))){    // check if a user have a admin role or not to give access to alter the candidate data
        return res.status(403).json({message : "user does not have admin role"})
    }
    const data = req.body // Assuming the req body contains the candidate data
    

    // console.log("REQ BODY:", req.body);
    // console.log("ADDRESS:", req.body.address);
    // Create a new Candidate document using the Mongoose model
    const newCandidate = new candidate(data);

    //save the new person
   const response = await newCandidate.save();
   console.log("data saved");
   res.status(200).json({response : response});
}catch(err){
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
}

})


router.get('/pro' , async (req ,res) => {
    try {
        const data = await candidate.find();

        console.log("Data is fetched Successfully!!")
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})


// Update the existing document by using unique identiifier as id
//// update the existing elector
router.put('/:candidateId',jwtAuthMiddleware, async(req ,res) => {
    try {
    if(!(await checkAdminRole(req.user.id))){    // check if a user have a admin role or not to give access to alter the candidate data
        return res.status(403).json({message : "user does not have admin role"})
    }
        const candidateId = req.params.candidateId; // Extract the id from the url
        const updateCandidateData = req.body;

        //Find the candidate whose _id equals candidateId, update it with the data from the request body, validate it, and return the updated candidate.
        const response = await candidate.findByIdAndUpdate(candidateId, updateCandidateData, {
            new : true ,// Extract the updated document 
            runValidators: true, // Run mongoose validation 
        })
        
        if(!response){
            return res.status(404).json({error : "Candidate not found"})
        }
        console.log("Candidate Data Updated Successfully");
        res.status(200).json(response);
    } catch (error) {
                console.log(error);
               res.status(500).json({
            error : "Internal Server Error"
        })
    }
})

// Delete the existing document 
router.delete('/:candidateId' ,jwtAuthMiddleware, async (req,res) => {
try {
    if(!(await checkAdminRole(req.user.id))){    // check if a user have a admin role or not to give access to alter the candidate data
        return res.status(403).json({message : "user does not have admin role"})
    }
        const candidateId = req.params.candidateId; // Extract the Candidate's id fromthe URL paramneter
        
        // Assuming you have the candidate model
        const response = await candidate.findByIdAndDelete(candidateId);
        if(!response){
            return res.status(401).json({error : "Invalid Candidate"});
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

//let's start voting 
router.post('/vote/:candidateId', jwtAuthMiddleware, async(req,res) => {
    //no admin can vote
    // useer can only vote once


    try {
       // Get candidate ID from URL
       const candidateId = req.params.candidateId;
       // Get logged-in user's ID from JWT
       const userId = req.user.id;  // from jwt middleware 
        //find the candidate document with the specified candidateId
        const candidateData = await candidate.findById(candidateId);
        if(!candidateData){
            res.status(404).json({message : "Candidate not found"});
        }

        const User =  await user.findById(userId);
        if(!User){
            res.status(404).json({message : "Candidate not found"});
        }
        if(User.isVoted){
            res.status(400).json({message : "You have already voted"});
        }
        
        // Admin cannot vote
        if(User.role === "admin"){
           return  res.status(403).json({message : "Admin is not allowed"}) ;
        }

        // Update the Candidate Document to record the vote
        candidateData.votes.push({user : userId})
        candidateData.voteCount++;
        await candidateData.save();

        //update the user document
        // Mark user as voted
        User.isVoted = true;
        await User.save(); 

        res.status(200).json({message : "Vote record successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error :"Internal server Error" });
    }
})

// vote count 
router.get('/vote/count' , async(req,res) => {
    try {
        // find the candidates and sort them by voteCount in descendig order
        const Candidate = await candidate.find().sort({voteCount: "desc"});

        //Map the candidates to only return their name and voteCount
        const voteRecord = Candidate.map((data) => {
            return {
                party : data.party , 
                count : data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error :"Internal server Error" });
    }
})

router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const Candidates = await candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(Candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;