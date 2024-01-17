const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sequelize = require('./utils/db')
const signupRoutes = require('./routes/signup')
const cors = require('cors')
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true

}))
app.use(bodyParser.json());

app.use('/signup', signupRoutes)
sequelize
.sync()
//.sync({force: true})

.then(res =>{
    app.listen(3000)
})
.catch(err => console.log(err))
