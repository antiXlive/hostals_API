const express = require('express');
const router = express.Router();

const Bed = require('../models/bed');
const checkAuth = require('../middleware/checkAuth');
const RoomSlot = require('../models/roomSlot');


router.get('/', async (req, res, next) => {
    const x = await Bed.find({ slot: '' });
    const x1 = await Bed.find()
    const promises = x1.map(async item => {
        if (item.slot) {
            const response = await RoomSlot.find({ _id: item.slot })
            return {
                ...item._doc,
                hostelName: response[0] ? response[0].hostelName : null,
                roomName: response[0] ? response[0].roomName : null
            }
        }
    })
    let results = await Promise.all(promises)
    results = [...results, ...x];
    results = results.filter(function (element) {
        return element !== undefined;
    });
    res.status(200).json(results);
})


router.get('/unalloted', (req, res, next) => {
    Bed.find({ slot: '' })
        .exec()
        .then(bed => {
            res.status(200).json(bed)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})



router.post('/create', checkAuth, (req, res, next) => {
    if (req.body.number) {
        Bed.find({ number: req.body.number })
            .exec()
            .then(bed => {
                if (bed.length == 1) {
                    res.status(409).json({
                        err: "Bed Already Exist"
                    })
                } else {
                    const newBed = new Bed({
                        number: req.body.number,
                    })
                    newBed.save()
                        .then(result => {
                            res.status(201).json({
                                msg: "Bed Created Successfully",
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
        Bed.findByIdAndRemove(req.body.id)
            .exec(function (err) {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    res.status(201).json({
                        msg: 'Bed Deleted Successfully'
                    })
                }
            })
    }
})


module.exports = router