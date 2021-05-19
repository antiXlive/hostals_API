const express = require('express');
const router = express.Router();

const Hostel = require('../models/hostel');
const Room = require('../models/room');
const checkAuth = require('../middleware/checkAuth');

router.get('/', (req, res, next) => {
    Hostel.find()
        .exec()
        .then(hostel => {
            res.status(200).json(hostel)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})




router.post('/create', checkAuth, checkAuth, (req, res, next) => {
    if (req.body.name, req.body.category) {
        Hostel.find({ name: req.body.name })
            .exec()
            .then(hostel => {
                if (hostel.length == 1) {
                    res.status(409).json({
                        err: "Hostel with same name already exist"
                    })
                } else {
                    const newHostel = new Hostel({
                        name: req.body.name,
                        category: req.body.category,
                    })
                    newHostel.save()
                        .then(result => {
                            res.status(201).json({
                                msg: "Hostel Created Successfully",
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
            err: 'Incomplete Data'
        })
    }
})


router.delete('/', checkAuth, checkAuth, (req, res, next) => {
    if (req.body.id) {
        Hostel.findByIdAndRemove(req.body.id)
            .exec(function (err) {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    Room.find({ hostel: req.body.id })
                        .exec()
                        .then(room => {
                            for (let i = 0; i < room.length; i++) {
                                Room.findByIdAndRemove(room[i]._id)
                                    .exec(function (err) { })
                            }
                        })
                    res.status(201).json({
                        msg: 'Hostel Deleted Successfully'
                    })
                }
            })
    } else {
        res.status(500).json({
            err: 'Incomplete Data'
        })
    }
})

module.exports = router

