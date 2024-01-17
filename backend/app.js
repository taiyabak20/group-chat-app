const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sequelize = require('./utils/db')
const userRoutes = require('./routes/users')
const messageRoutes = require('./routes/messages')
const User = require('./models/users')
const Message = require('./models/messages')
const cors = require('cors')
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true

}))
app.use(bodyParser.json());
app.use('/user', userRoutes)
app.use('/message', messageRoutes)
User.hasMany(Message)
Message.belongsTo(User)

sequelize
.sync()
//.sync({force: true})

.then(res =>{
    app.listen(3000)
})
.catch(err => console.log(err))
