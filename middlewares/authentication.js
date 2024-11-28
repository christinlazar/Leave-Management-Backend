const JWT = require('../utils/jwt')
const authenticationMiddleware = async (req,res,next)=>{
    try {
        console.log("Inauthentication")
        const accessToken = req.cookies.accessToken
        console.log("access",accessToken)
        const isVerified = await JWT.verifyJWT(accessToken)
        console.log("isVerifued",isVerified)
        if(isVerified){
            req.userId = isVerified.id
            next()
        }else{
            return res.status(401).json({success:false,accessToken:false})
        }
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = authenticationMiddleware