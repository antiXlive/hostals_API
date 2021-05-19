const express = require('express');
const router = express.Router();

const Student = require('../models/student');
const RoomSlot = require('../models/roomSlot');
const Bed = require('../models/bed');
const Almirah = require('../models/almirah');
const Table = require('../models/table');
const Chair = require('../models/chair');
const checkAuth = require('../middleware/checkAuth');


router.get('/', (req, res, next) => {
    if (req.query.id) {
        Student.find({ _id: req.query.id })
            .exec()
            .then(async student => {
                if (student[0].roomSlot && student[0].roomSlot.length > 1) {
                    let roomSlot = await RoomSlot.find({ _id: student[0].roomSlot });
                    let almirah = await Almirah.find({ _id: roomSlot[0].almirah });
                    let bed = await Bed.find({ _id: roomSlot[0].bed });
                    let chair = await Chair.find({ _id: roomSlot[0].chair });
                    let table = await Table.find({ _id: roomSlot[0].table });
                    let data = {
                        ...student[0]._doc,
                        userHostel:roomSlot[0].hostel,
                        userRoom:roomSlot[0].room,
                        hostelName: roomSlot[0].hostelName,
                        roomName: roomSlot[0].roomName,
                        almirahNumber: almirah[0].number,
                        almirahKey: almirah[0].key,
                        bedNumber: bed[0].number,
                        chairNumber: chair[0].number,
                        tableNumber: table[0].number,
                        tableKey: table[0].key
                    }
                    res.status(200).json(data);
                } else {
                    res.status(200).json(student[0])
                }
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    } else {
        Student.find()
            .exec()
            .then(student => {
                res.status(200).json(student)
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    }
})
router.get('/unalloted', (req, res, next) => {
    Student.find({ roomSlot: '' })
        .exec()
        .then(student => {
            res.status(200).json(student)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})
router.get('/room', (req, res, next) => {
    if (req.query.room) {
        Student.find({ room: req.query.room })
            .exec()
            .then(student => {
                res.status(200).json(student)
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    } else {
        res.status(500).json({
            err: 'Incomplete Data'
        })
    }

})


router.post('/create', checkAuth, (req, res, next) => {
    if (req.body.name && req.body.email && req.body.roll && req.body.department && req.body.batch && req.body.degree && req.body.gender && req.body.contact) {
        Student.find({ email: req.body.email, roll: req.body.roll })
            .exec()
            .then(student => {
                if (student.length == 1) {
                    res.status(409).json({
                        err: "Student Already Exist"
                    })
                } else {
                    const newStudent = new Student({
                        name: req.body.name,
                        email: req.body.email,
                        roll: req.body.roll,
                        department: req.body.department,
                        batch: req.body.batch,
                        degree: req.body.degree,
                        contact: req.body.contact,
                        gender: req.body.gender,
                    })
                    newStudent.save()
                        .then(result => {
                            res.status(201).json({
                                msg: "Student Created Successfully",
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

router.delete('/', checkAuth, (req, res, next) => {
    if (req.body.id) {
        Student.findByIdAndRemove(req.body.id)
            .exec(function (err) {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    res.status(201).json({
                        msg: 'Student Deleted Successfully'
                    })
                }
            })
    }
})


module.exports = router