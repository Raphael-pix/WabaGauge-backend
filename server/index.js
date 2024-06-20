const express = require('express')
const cors = require('cors');
const userRouter = require('./routes/user-routes');
const managerRouter = require('./routes/manager-routes');


require('./db')

const app = express()
app.use(express.json());
app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/manager',managerRouter)


app.use('/',(req,res)=>{
    res.send('Hello world')
})

app.listen(5000,()=>{
    console.log('listening at port 5000')
})