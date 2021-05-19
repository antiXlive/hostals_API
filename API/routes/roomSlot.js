const express = require('express');
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



router.get('/', (req, res, next) => {
    RoomSlot.find()
        .exec()
        .then(roomSlot => {
            res.status(200).json(roomSlot)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})



router.get('/room', async (req, res, next) => {
    if (req.query.rid) {
        RoomSlot.find({ room: req.query.rid })
            .exec()
            .then(async roomSlot => {
                let x = [];
                for (let i = 0; i < roomSlot.length; i++) {
                    let almirahNumber = await Almirah.find({ _id: roomSlot[i].almirah });
                    let bedNumber = await Bed.find({ _id: roomSlot[i].bed });
                    let chairNumber = await Chair.find({ _id: roomSlot[i].chair });
                    let tableNumber = await Table.find({ _id: roomSlot[i].table });
                    let student = roomSlot[i].student.length > 1 ? await Student.find({ _id: roomSlot[i].student }) : [{ name: '', roll: '' }];
                    let data = {
                        studentName: student[0].name,
                        studentRoll: student[0].roll,
                        almirahNumber: almirahNumber[0].number,
                        almirahKey: almirahNumber[0].key,
                        bedNumber: bedNumber[0].number,
                        chairNumber: chairNumber[0].number,
                        tableNumber: tableNumber[0].number,
                        tableKey: tableNumber[0].key
                    }
                    x.push({ ...roomSlot[i]._doc, ...data });
                }
                res.status(200).json(x)
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    } else {
        res.status(400).json({
            err: 'Incomplete Data'
        })
    }
})

router.post('/allot', checkAuth, (req, res, next) => {
    if (req.body.id && req.body.sid) {
        RoomSlot.find({ student: req.body.sid })
            .exec()
            .then(roomSlot => {
                if (roomSlot.length > 0) {
                    res.status(409).json({
                        err: "RoomSlot Already Alloted"
                    })
                } else {
                    RoomSlot.find({ _id: req.body.id })
                        .exec()
                        .then(roomSlot => {
                            Room.find({ _id: roomSlot[0].room })
                                .exec()
                                .then(room => {
                                    Room.updateOne({ _id: room[0]._id }, { students: room[0].students + 1 }, function (err, result) { })
                                })
                            Hostel.find({ _id: roomSlot[0].hostel })
                                .exec()
                                .then(hostel => {
                                    Hostel.updateOne({ _id: hostel[0]._id }, { students: hostel[0].students + 1 }, function (err, result) { })
                                })
                            RoomSlot.updateOne({ _id: req.body.id }, { student: req.body.sid }, function (err, result) { })
                            Student.updateOne({ _id: req.body.sid }, { roomSlot: req.body.id }, function (err, result) { })
                            res.status(201).json({
                                msg: 'Room Slot Alloted Successfully'
                            })
                        })
                }
            })
    } else {
        res.status(400).json({
            err: 'Incomplete Data'
        })
    }
})
router.post('/retain', checkAuth, (req, res, next) => {
    if (req.body.id && req.body.sid) {
        RoomSlot.find({ student: req.body.sid })
            .exec()
            .then(roomSlot => {
                if (roomSlot.length < 1) {
                    res.status(409).json({
                        err: "RoomSlot Already Retained"
                    })
                } else {
                    RoomSlot.find({ _id: req.body.id })
                        .exec()
                        .then(roomSlot => {
                            Room.find({ _id: roomSlot[0].room })
                                .exec()
                                .then(room => {
                                    Room.updateOne({ _id: room[0]._id }, { students: room[0].students - 1 }, function (err, result) { })
                                })
                            Hostel.find({ _id: roomSlot[0].hostel })
                                .exec()
                                .then(hostel => {
                                    Hostel.updateOne({ _id: hostel[0]._id }, { students: hostel[0].students - 1 }, function (err, result) { })
                                })
                            RoomSlot.updateOne({ _id: req.body.id }, { student: '' }, function (err, result) { })
                            Student.updateOne({ _id: roomSlot[0].student }, { roomSlot: '' }, function (err, result) {
                                res.status(200).json({
                                    msg: 'Room Slot Retained Successfully'
                                })
                            })
                        })
                }
            })
    } else {
        res.status(400).json({
            err: 'Incomplete Data'
        })
    }
})

router.post('/create', checkAuth, (req, res, next) => {
    if (req.body.number && req.body.hostelName && req.body.hostel && req.body.roomName && req.body.room && req.body.almirah && req.body.bed && req.body.chair && req.body.table) {
        RoomSlot.find({ room: req.body.room, almirah: req.body.almirah, bed: req.body.bed, chair: req.body.chair, table: req.body.table })
            .exec()
            .then(roomSlot => {
                if (roomSlot.length == 1) {
                    res.status(409).json({
                        err: "RoomSlot Already Exist"
                    })
                } else {
                    const newRoomSlot = new RoomSlot({
                        number: req.body.number,
                        hostelName: req.body.hostelName,
                        roomName: req.body.roomName,
                        hostel: req.body.hostel,
                        room: req.body.room,
                        almirah: req.body.almirah,
                        bed: req.body.bed,
                        chair: req.body.chair,
                        table: req.body.table,
                    })
                    newRoomSlot.save()
                        .then(result => {
                            Room.find({ _id: req.body.room })
                                .exec()
                                .then(room => {
                                    Room.updateOne({ _id: room[0]._id }, { slots: room[0].slots + 1 }, function (err, result) { });
                                })
                            Bed.find({ _id: req.body.bed })
                                .exec()
                                .then(bed => {
                                    Bed.updateOne({ _id: bed[0]._id }, { slot: result._id }, function (err, result) { });
                                })
                            Almirah.find({ _id: req.body.almirah })
                                .exec()
                                .then(almirah => {
                                    Almirah.updateOne({ _id: almirah[0]._id }, { slot: result._id }, function (err, result) { });
                                })
                            Table.find({ _id: req.body.table })
                                .exec()
                                .then(table => {
                                    Table.updateOne({ _id: table[0]._id }, { slot: result._id }, function (err, result) { });
                                })
                            Chair.find({ _id: req.body.chair })
                                .exec()
                                .then(chair => {
                                    Chair.updateOne({ _id: chair[0]._id }, { slot: result._id }, function (err, result) { });
                                })
                            res.status(201).json({
                                msg: "Room Slot Created Successfully",
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                err: err
                            })
                        })
                }
            })
    } else {
        res.status(400).json({
            err: "Incomplete Data"
        })
    }
})

router.delete('/delete', checkAuth, (req, res, next) => {
    if (req.body.id && req.body.hid) {
        RoomSlot.findByIdAndRemove(req.body.id)
            .exec(function (err) {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    Room.find({ hostel: req.body.hid })
                        .exec()
                        .then(room => {
                            Hostel.updateOne({ _id: req.body.hid }, { rooms: room.length }, function (err, result) { });
                            Room.updateOne({ _id: room[0]._id }, { slots: room[0].slots - 1 }, function (err, result) { });
                        })
                    Bed.find({ slot: req.body.id })
                        .exec()
                        .then(bed => {
                            if (bed[0])
                                Bed.updateOne({ _id: bed[0].id }, { slot: '' }, function (err, result) { });
                        })
                    Almirah.find({ slot: req.body.id })
                        .exec()
                        .then(almirah => {
                            if (almirah[0])
                                Almirah.updateOne({ _id: almirah[0].id }, { slot: '' }, function (err, result) { });
                        })
                    Table.find({ slot: req.body.id })
                        .exec()
                        .then(table => {
                            if (table[0])
                                Table.updateOne({ _id: table[0].id }, { slot: '' }, function (err, result) { });
                        })
                    Chair.find({ slot: req.body.id })
                        .exec()
                        .then(chair => {
                            if (chair[0])
                                Chair.updateOne({ _id: chair[0].id }, { slot: '' }, function (err, result) { });
                        })
                    res.status(201).json({
                        msg: 'Room Deleted Successfully'
                    })
                }
            })
    }
})

module.exports = router

