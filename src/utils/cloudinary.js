import {v2 as cloudinary} from "cloudinary" 
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary

       const response= await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
       console.log("file is uploaded on cloudinary", response.url);
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        console.log("Error details:", error);

        // Attempt to delete the file in case of error
        if(localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (fsError) {
                console.error("Failed to delete local file after upload error:", fsError.message);
            }
        }   
        return null; // Return null to indicate failure
    }
}

export {uploadOnCloudinary}