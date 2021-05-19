const express = require('express');
const router = express.Router();

const Chair = require('../models/chair');
const RoomSlot = require('../models/roomSlot');
const checkAuth = require('../middleware/checkAuth');


router.get('/', async (req, res, next) => {
    const x = await Chair.find({ slot: '' });
    const x1 = await Chair.find()
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
    Chair.find({ slot: '' })
        .exec()
        .then(chair => {
            res.status(200).json(chair)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})



router.post('/create', checkAuth, (req, res, next) => {
    if (req.body.number) {
        Chair.find({ number: req.body.number })
            .exec()
            .then(chair => {
                if (chair.length == 1) {
                    res.status(409).json({
                        err: "Chair Already Exist"
                    })
                } else {
                    const newChair = new Chair({
                        number: req.body.number,
                    })
                    newChair.save()
                        .then(result => {
                            res.status(201).json({
                                msg: "Chair Created Successfully",
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
        Chair.findByIdAndRemove(req.body.id)
            .exec(function (err) {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    res.status(201).json({
                        msg: 'Chair Deleted Successfully'
                    })
                }
            })
    }
})


module.exports = router