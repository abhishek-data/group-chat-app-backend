const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./utils/database');
const authRouter = require('./routes/auth');
const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authRouter);


const PORT = process.env.PORT || 3000;



sequelize
    .sync()
    // .sync({ force: true})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    ).catch(err => {
        console.log(err);
    });






