const express = require('express');
const http = require('http')
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./utils/database');
const path = require('path')
const fs = require('fs')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cron = require('node-cron')
const { Server } = require('socket.io')

//router
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group')

//models
const User = require('./models/user');
const Group = require('./models/group');
const Chat = require('./models/chat');
const UserGroup = require('./models/userGroup');
const ArchiveChat = require('./models/archiveChat');

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
});


app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

io.on('connection', socket => {
    socket.on('user-message', message => {
        io.emit('message', message)
    })

})

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);






app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression())
app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(authRouter);
app.use(chatRouter);
app.use(groupRouter);



// models relations
User.belongsToMany(Group, { through: UserGroup });
User.hasMany(Chat);
Group.belongsToMany(User, { through: UserGroup });
Group.hasMany(Chat);
Chat.belongsTo(User);
Chat.belongsTo(Group);
ArchiveChat.belongsTo(User);
ArchiveChat.belongsTo(Group);


const PORT = process.env.PORT || 3000;



sequelize
    .sync({ alter: true })
    // .sync({ force: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    ).catch(err => {
        console.log(err);
    });

cron.schedule('0 0 * * *', async () => {
    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const chats = await Chat.findAll({ where: { createdAt: { [sequelize.Op.lte]: oneDayAgo } } });
        chats.forEach(async chat => {
            await ArchiveChat.create({ message_text: chat.message_text, name: chat.name, UserId: chat.UserId, GroupId: chat.GroupId });
            await Chat.destroy({ where: { id: chat.id } });
        });
    } catch (error) {
        console.log(error);
    }
},
    {
        scheduled: true,
        timezone: "Asia/Kolkata",
    }

);






