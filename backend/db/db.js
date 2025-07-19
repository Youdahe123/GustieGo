import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { dirname } from 'path'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({path:path.join(__dirname,'.env')})

const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL)
.then(async () =>{
    console.log("DB CONNECTED!")
}).catch((err) => {
    console.log(`DB NOT CONNECTED ERR : err`)
})