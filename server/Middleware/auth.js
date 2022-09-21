import jwt from "jsonwebtoken";

const auth = async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const googleId = req.headers.googleid;

        let isCustom = token.length < 200;
        
        let decodedData;
        if(token && isCustom){
           decodedData = jwt.verify(token,process.env.JWT_SECRET)
           req.userId = decodedData?.id;
        }

        if(token && !isCustom){
            req.userId = googleId;
        }
        

        next()

    }catch(error){
        console.log(error)
    }
    
}

export default auth;