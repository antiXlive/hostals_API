const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const checkAPIKey = require('./API/middleware/checkAPIKey');

const WelcomeRoute = require('./API/routes/welcome');
const PingRoute = require('./API/routes/ping');
const AuthRoute = require('./API/routes/auth');
const HostelRoute = require('./API/routes/hostel');
const StudentRoute = require('./API/routes/student');
const RoomRoute = require('./API/routes/room');
const AlmirahRoute = require('./API/routes/almirah');
const BedRoute = require('./API/routes/bed');
const TableRoute = require('./API/routes/table');
const ChairRoute = require('./API/routes/chair');
const ComplaintRoute = require('./API/routes/complaint');
const RoomSlotRoute = require('./API/routes/roomSlot');
const SmartyRoute = require('./API/routes/smarty');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://piyush107:'
    + process.env.MONGO_PASSWORD
    + '@hostals.tgpl7.mongodb.net/hostals_Database?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
);
mongoose.connection.on("open", () => {
    console.log('\n-----------------------------------');
    console.log("\tMONGO DB CONNECTED")
    console.log('-----------------------------------\n');
})

app.use('/', WelcomeRoute)
app.use('/ping', PingRoute);
app.use('/auth', checkAPIKey, AuthRoute);
app.use('/student', checkAPIKey, StudentRoute);
app.use('/hostel', checkAPIKey, HostelRoute);
app.use('/room', checkAPIKey, RoomRoute);
app.use('/almirah', checkAPIKey, AlmirahRoute);
app.use('/bed', checkAPIKey, BedRoute);
app.use('/table', checkAPIKey, TableRoute);
app.use('/chair', checkAPIKey, ChairRoute);
app.use('/roomSlot', checkAPIKey, RoomSlotRoute);
app.use('/complaints', checkAPIKey, ComplaintRoute);
app.use('/smarty', checkAPIKey, SmartyRoute);


module.exports = app;