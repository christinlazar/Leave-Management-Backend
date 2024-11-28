const jwt = require('jsonwebtoken')


const createJwt = async (userID) =>{
    try {
        const jwtKey = process.env.JWT_SECRET_KEY
        if(jwtKey){
            const token = jwt.sign({id:userID},jwtKey,{expiresIn:'7d'})
            return token
        }
    } catch (error) {
        return null
    }
}

const verifyJWT = async (token) =>{
    try {
        const jwtKey = process.env.JWT_SECRET_KEY
        const decode = jwt.verify(token,jwtKey)
        return decode
    } catch (error) {
        return null
    }
}

module.exports = {createJwt,verifyJWT}