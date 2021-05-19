const { request } = require('express');
const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const Student = require('../models/student');
const Complaint = require('../models/complaint');
const checkAuth = require('../middleware/checkAuth');


router.get('/', (req, res, next) => {
    if (req.query.resolved) {
        Complaint.find({ resolved: 1 })
            .exec()
            .then(async complaint => {
                let x = [];
                for (let i = 0; i < complaint.length; i++) {
                    let room = await Room.find({ _id: complaint[i].room });
                    let student = await Student.find({ _id: complaint[i].student });
                    let data = {
                        ...complaint[i]._doc,
                        hostelName: room[0].hostelName,
                        roomName: room[0].name,
                        studentName: student[0].name,
                        studentRoll: student[0].roll
                    }
                    x.push(data);
                }
                res.status(200).json(x)
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    } else {
        Complaint.find({ resolved: 0 })
            .exec()
            .then(async complaint => {
                let x = [];
                for (let i = 0; i < complaint.length; i++) {
                    let room = await Room.find({ _id: complaint[i].room });
                    let student = await Student.find({ _id: complaint[i].student });
                    let data = {
                        ...complaint[i]._doc,
                        hostelName: room[0].hostelName,
                        roomName: room[0].name,
                        studentName: student[0].name,
                        studentRoll: student[0].roll
                    }
                    x.push(data);
                }
                res.status(200).json(x)
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                });
            });
    }
})


router.get('/student', (req, res, next) => {
    if (req.query.sid) {
        if (req.query.resolved) {
            Complaint.find({ student: req.query.sid, resolved: 1 })
                .exec()
                .then(async complaint => {
                    let x = [];
                    for (let i = 0; i < complaint.length; i++) {
                        let room = await Room.find({ _id: complaint[i].room });
                        let student = await Student.find({ _id: complaint[i].student });
                        let data = {
                            ...complaint[i]._doc,
                            hostelName: room[0].hostelName,
                            roomName: room[0].name,
                            studentName: student[0].name,
                            studentRoll: student[0].roll
                        }
                        x.push(data);
                    }
                    res.status(200).json(x)
                })
                .catch(err => {
                    res.status(500).json({
                        err: err
                    });
                });
        } else {
            Complaint.find({ student: req.query.sid, resolved: 0 })
                .exec()
                .then(async complaint => {
                    let x = [];
                    for (let i = 0; i < complaint.length; i++) {
                        let room = await Room.find({ _id: complaint[i].room });
                        let student = await Student.find({ _id: complaint[i].student });
                        let data = {
                            ...complaint[i]._doc,
                            hostelName: room[0].hostelName,
                            roomName: room[0].name,
                            studentName: student[0].name,
                            studentRoll: student[0].roll
                        }
                        x.push(data);
                    }
                    res.status(200).json(x)
                })
                .catch(err => {
                    res.status(500).json({
                        err: err
                    });
                });
        }
    } else {
        res.status(400).json({
            err: 'Incomplete Data'
        })
    }
})

router.post('/create', (req, res, next) => {
    if (req.body.hostel && req.body.room && req.body.student && req.body.message) {
        const newComplaint = new Complaint({
            hostel: req.body.hostel,
            room: req.body.room,
            student: req.body.student,
            message: req.body.message,
        })
        newComplaint.save()
            .then(result => {
                Room.find({ _id: req.body.room })
                    .exec()
                    .then(room => {
                        Room.updateOne({ _id: req.body.room }, { complaints: room[0].complaints + 1 }, function (err, result) { });
                        res.status(201).json({
                            msg: "Complaint Lodged Successfully",
                        })
                    })
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                })
            })
    } else {
        res.status(400).json({
            err: 'Incomplete Data'
        })
    }
})

router.post('/resolve', checkAuth, (req, res, next) => {
    if (req.body.id, req.body.room) {
        Complaint.find({ _id: req.body.id })
            .exec()
            .then(complaint => {
                Complaint.updateOne({ _id: complaint[0]._id }, { resolved: 1 }, function (err, result) { });
                Room.find({ _id: req.body.room })
                    .exec()
                    .then(room => {
                        Room.updateOne({ _id: room[0]._id }, { complaints: room[0].complaints - 1 }, function (err, result) { });
                        res.status(201).json({
                            msg: 'Complaint Resolved Successfully'
                        })
                    })
            })
    }
})

module.exports = router

