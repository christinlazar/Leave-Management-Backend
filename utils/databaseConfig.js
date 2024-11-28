const mongoose = require('mongoose')
const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
            console.log(`Database connected sucessfully`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB