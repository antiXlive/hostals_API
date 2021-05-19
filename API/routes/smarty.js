const express = require('express');
const request = require('request');
const router = express.Router();
const Hostel = require('../models/hostel');
const RoomSlot = require('../models/roomSlot');
const Room = require('../models/room');
const Bed = require('../models/bed');
const Almirah = require('../models/almirah');
const Table = require('../models/table');
const Chair = require('../models/chair');
const Student = require('../models/student');
const checkAuth = require('../middleware/checkAuth');


// router.post('/autoAllot', checkAuth, (req, res, next) => {
router.post('/createRoomSlot', async(req, res, next) => {
    if (req.body.hids) {
        const MAX_SLOT=3;
        let hostels = req.body.hids;
        hostels=hostels.split(',');
        const Almirahs = await Almirah.find({ slot: '' })
        const Beds = await Bed.find({ slot: '' })
        const Chairs = await Chair.find({ slot: '' })
        const Tables = await Table.find({ slot: '' })
        let count=Almirahs.length;
        count=10;
        hostels.map((hostel=>{
            Room.find({hostel:hostel})
            .exec()
            .then(room=>{
                for(let i=0;i<room.length;i++){
                    if(count){
                        console.log('ROOM  --->  ',room[i]);
                        // for(let i=0)
                        console.log('COUNT --->  ',count);
                        count--;        
                    }
                }
            })
        }))



        // RoomSlot.find({ student: req.body.sid })
        //     .exec()
        //     .then(roomSlot => {
        //         if (roomSlot.length > 0) {
        //             res.status(409).json({
        //                 err: "RoomSlot Already Alloted"
        //             })
        //         } else {
        //             RoomSlot.find({ _id: req.body.id })
        //                 .exec()
        //                 .then(roomSlot => {
        //                     Room.find({ _id: roomSlot[0].room })
        //                         .exec()
        //                         .then(room => {
        //                             Room.updateOne({ _id: room[0]._id }, { students: room[0].students + 1 }, function (err, result) { })
        //                         })
        //                     Hostel.find({ _id: roomSlot[0].hostel })
        //                         .exec()
        //                         .then(hostel => {
        //                             Hostel.updateOne({ _id: hostel[0]._id }, { students: hostel[0].students + 1 }, function (err, result) { })
        //                         })
        //                     RoomSlot.updateOne({ _id: req.body.id }, { student: req.body.sid }, function (err, result) { })
        //                     Student.updateOne({ _id: req.body.sid }, { roomSlot: req.body.id }, function (err, result) { })
        //                     res.status(201).json({
        //                         msg: 'Room Slot Alloted Successfully'
        //                     })
        //                 })
        //         }
        //     })
        res.status(200).json('ok')
    } else {
        res.status(400).json({
            err: 'Incomplete Data'
        })
    }
})

module.exports = router

