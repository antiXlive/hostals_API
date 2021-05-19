const express = require('express');
const router = express.Router();
const Hostel = require('../models/hostel');
const Room = require('../models/room');
const checkAuth = require('../middleware/checkAuth');



router.get('/', (req, res, next) => {
    Room.find()
        .exec()
        .then(room => {
            res.status(200).json(room)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})

router.get('/hostel', (req, res, next) => {
    if (req.query.hostel) {
        Room.find({ hostel: req.query.hostel })
            .exec()
            .then(room => {
                res.status(200).json(room)
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

router.post('/create', checkAuth, (req, res, next) => {
    if (req.body.name && req.body.hostelName && req.body.hostel) {
        Room.find({ name: req.body.name, hostel: req.body.hostel })
            .exec()
            .then(room => {
                if (room.length == 1) {
                    res.status(409).send({
                        err: 'Room Already Exist'
                    });
                } else {
                    const newRoom = new Room({
                        name: req.body.name,
                        hostelName: req.body.hostelName,
                        hostel: req.body.hostel,
                    })
                    newRoom.save()
                        .then(result => {
                            Room.find({ hostel: req.body.hostel })
                                .exec()
                                .then(room => {
                                    Hostel.updateOne({ _id: req.body.hostel }, { rooms: room.length }, function (err, result) { });
                                    res.status(201).json({
                                        msg: "Room Created Successfully",
                                    })
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
    if (req.body.id && req.body.hid) {
        Room.findByIdAndRemove(req.body.id)
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
                        })
                    res.status(201).json({
                        msg: 'Room Deleted Successfully'
                    })
                }
            })
    }
})

module.exports = router

