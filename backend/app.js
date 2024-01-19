const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sequelize = require('./utils/db')
const userRoutes = require('./routes/users')
const messageRoutes = require('./routes/messages')
const groupRoutes = require('./routes/group')
const memberRoutes = require('./routes/members')
const User = require('./models/users')
const Message = require('./models/messages')
const Group = require('./models/group')
const Member = require('./models/members')
const cors = require('cors')
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true

}))
app.use(bodyParser.json());
app.use('/user', userRoutes)
app.use('/message', messageRoutes)
app.use('/group', groupRoutes)
app.use('/member' , memberRoutes)
User.hasMany(Message)
Message.belongsTo(User)
User.belongsToMany(Group , {through : Member})
Group.belongsToMany( User, {through : Member})
Group.hasMany(Message)
Member.belongsTo(Group)
Group.hasMany(Member, { foreignKey: 'groupId' });
Member.belongsTo(Group, { foreignKey: 'groupId' });
User.hasMany(Member, { foreignKey: 'userId' });

sequelize
.sync()
//.sync({force: true})

.then(res =>{
    app.listen(3000)
})
.catch(err => console.log(err))
