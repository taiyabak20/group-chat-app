const express = require('express')
const app = express()

const path = require('path');
const parentDirectory = path.join(__dirname, '..','frontend');
app.use(express.static(parentDirectory));
console.log(parentDirectory)

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
    cors: ['http://localhost:5500']
});

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
const ArchivedChat = require('./models/ArchivedChat')
const cronJob = require('./utils/cron')
const cors = require('cors')
cronJob.start()

app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://127.0.0.1:5500'],
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
User.hasMany(ArchivedChat)
ArchivedChat.belongsTo(User)
User.belongsToMany(Group , {through : Member})
Group.belongsToMany( User, {through : Member})
Group.hasMany(Message)
Member.belongsTo(Group)
Group.hasMany(Member, { foreignKey: 'groupId' });
Member.belongsTo(Group, { foreignKey: 'groupId' });
User.hasMany(Member, { foreignKey: 'userId' });

sequelize
// .sync({force : true})
.sync()
.then(()=>{
    const connection = (socket)=>{

      socket.on('set custom id', (customId) => {
        console.log(`User connected with custom ID: ${customId}`);
        socket.customId = customId;
        io.emit('user connected', customId);
    });


    socket.on('chat-message', (msg) => {
      io.emit('chat-message', { customId: socket.customId, msg });
  });



    socket.on('disconnect', () => {
      console.log('User disconnected');
      io.emit('user disconnected');
  });
     
    }
    io.on('connection' , connection)
    httpServer.listen(3000)
}).catch(e => {
    console.log(e)
})