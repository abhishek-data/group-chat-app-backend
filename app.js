const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./utils/database');
const authRouter = require('./routes/auth');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRouter);


const PORT = process.env.PORT || 3000;



sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    ).catch(err => {
        console.log(err);
    });






