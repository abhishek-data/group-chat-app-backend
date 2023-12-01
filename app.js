const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./utils/database');

//router
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group')

//models
const User = require('./models/user');
const Group = require('./models/group');
const Chat = require('./models/chat');
const UserGroup = require('./models/userGroup');

const app = express();



app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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


const PORT = process.env.PORT || 3000;



sequelize
    .sync({alter: true})
    // .sync({ force: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    ).catch(err => {
        console.log(err);
    });






