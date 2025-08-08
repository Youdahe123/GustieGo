import express from 'express'
import router from './routes/user.js';
import Shiftrouter from './routes/shift.js';
import infoRouter from './routes/info.js';
import analyticsRouter from './routes/analytics.js';
import User from './models/auth.js';
import cors from 'cors'
import path from 'path'
import './db/db.js'
import './middleware/hourRecur.js'
import './middleware/weekUpdate.js'
const app = express();
app.use(cors())
app.use(express.json())
app.use('/users',router)
app.use('/shift',Shiftrouter)
app.use('/info',infoRouter)
app.use('/analytics',analyticsRouter)
const PORT = 3000;
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the GustieGo API 🧑‍🍳",
        version : '1.0.0',
        documentation : '/info/docs',
        about : '/info/about'
    
    })

});


app.listen(
    PORT,
    () => console.log(`Server is running on PORT:${PORT}!`)
);