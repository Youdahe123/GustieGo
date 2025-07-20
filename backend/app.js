import express from 'express'
import router from './routes/user.js';
import User from './models/auth.js';
import cors from 'cors'
import path from 'path'
import './db/db.js'
const app = express();
app.use(cors())
app.use(express.json())
app.use('/users',router)
const PORT = 3000;
app.get('/', (req, res) => {
    res.send('GustieGo API');
});
app.get('/',async (req,res)=> {
    try{
        const user = await User.find();
        res.json(user)
    }catch(err){console.log(err)}
})


app.listen(
    PORT,
    () => console.log(`Server is running on PORT:${PORT}!`)
);