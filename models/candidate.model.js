import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    name : {
         type :  String,
         required : true,
         unique : true,
         lowercase :  true,
         trim : true,
         index : true
    },
    party:{
        type : String,
        required: true
    },
    age :{
        type : Number,
        required : true
    },
    votes:[    // to store only user's id and votedAt(time,date). these are the users who vote to that  party 
        {
          user: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required :true
          },
          votedAt: {
            type : Date,
            default : Date.now()
          }
        }
    ],
    voteCount : {
        type : Number,
        default : 0
    }


    
},{timestamps : true})

export const candidate = mongoose.model("candidates", candidateSchema)