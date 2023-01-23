const app = require("./app");
const { connectDatabase } = require("./config/database");
const cloudinary = require("cloudinary")

connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


PORT = process.env.PORT || 9002
app.listen(PORT, ()=>{
    console.log(`server is running on port: ${process.env.PORT}`);
})