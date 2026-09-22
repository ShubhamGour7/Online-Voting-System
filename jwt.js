import jwt from "jsonwebtoken";

const jwtAuthMiddleware = (req, res , next) => {    // it is used as middleware to verify the JWT token is matched or not 

    //Extract the jwt token from the request headers
    const authHeader =  req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error: "Unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({error : "Unauthorized"});
    }

    try {
        //verify JWT token 
    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    // Attach user information to the request object 
    req.user = decoded;
    next();
    } catch (error) {
        console.log(error);
        res.status(401).json({error: "Invalid token"});
    }
}

// Function to generate the jwt token
const generateToken = (userData) => {
    // Generate a new jwt token using user data as in payload it contains some sort of user data
    return jwt.sign(userData, process.env.JWT_SECRET , {expiresIn: 3000});
}

export {jwtAuthMiddleware, generateToken};