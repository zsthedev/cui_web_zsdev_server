import app from "./app.js";
import { connectDB } from "./config/database.js";
import {v2 as cloudinary} from 'cloudinary';
          

const port = process.env.PORT;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

connectDB();
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
