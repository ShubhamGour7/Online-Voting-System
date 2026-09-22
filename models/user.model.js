import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name : {
         type :  String,
         required : true,
         unique : true,
         lowercase :  true,
         trim : true,
         index : true
    },
    age :{
        type : Number,
        required : true
    },
    email :{
        type : String
    },
    mobile :{
        type : String
    },
    address : {
        type : String,
        required : true
    },

    aadharCardNumber: {
        type :  Number,
        required : true,
        unique : true,
    },
    password :{
        type : String,
        required : [true , "Password is require"],
        trim : true,
    },
    role :{
        type : String,
        enum : ['voter', 'admin'],
        default : 'voter'
    },
    isVoted :{
        type : Boolean,
        default: false

    }
    
}
,{timestamps : true})



userSchema.pre('save', async function() {
   const user = this;
   
   //Hash the password only if it has been modified (or is new) 
   if(!user.isModified('password')) return ;
try {
   //hash password generation
   const salt = await bcrypt.genSalt(10); // 10 because it is ideal and above it will result in delay and take time 

   //hash password 
   const hashedPassword = await bcrypt.hash(user.password, salt);

   //Override the plain password with the hashed one 
   user.password = hashedPassword;  //save the hashed password 
} catch (error) {
   throw error;
}
})

userSchema.methods.comparePassword = async  function(candidatePassword)  {
   try {
      // use bcrypt to compare the user provided the passoword with the data stored in the db 
      // or compare the provided pass with the hashed password
      const isMatch = await bcrypt.compare(candidatePassword , this.password);
      // compare() automatically extracts the salt from  the storedHashedPassword and uses it to hash the entered password.It then compares the resulting hash with the stored hash. It they match , it indicates that the entered password is correct 

      return isMatch;
   } catch (error) {
      throw error;
   }
}

export const user = mongoose.model("users", userSchema)