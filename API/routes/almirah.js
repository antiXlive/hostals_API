const express = require('express');
const router = express.Router();

const Almirah = require('../models/almirah');
const RoomSlot = require('../models/roomSlot');
const checkAuth = require('../middleware/checkAuth');

router.get('/', async (req, res, next) => {
    const x = await Almirah.find({ slot: '' });
    const x1 = await Almirah.find()
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
    Almirah.find({ slot: '' })
        .exec()
        .then(almirah => {
            res.status(200).json(almirah)
        })
        .catch(err => {
            res.status(500).json({
                err: err
            });
        });
})


router.post('/create', checkAuth, (req, res, next) => {
    if (req.body.number && req.body.key) {
        Almirah.find({ number: req.body.number, key: req.body.key })
            .exec()
            .then(almirah => {
                if (almirah.length == 1) {
                    res.status(409).json({
                        err: "Almirah Already Exist"
                    })
                } else {
                    const newAlmirah = new Almirah({
                        number: req.body.number,
                        key: req.body.key,
                    })
                    newAlmirah.save()
                        .then(result => {
                            res.status(201).json({
                                msg: "Almirah Created Successfully",
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



router.delete('/', (req, res, next) => {
    if (req.body.id) {
        Almirah.findByIdAndRemove(req.body.id)
            .exec(function (err) {
                if (err) {
                    res.status(500).json({
                        err: err
                    })
                } else {
                    res.status(201).json({
                        msg: 'Almirah Deleted Successfully'
                    })
                }
            })
    }
})

module.exports = router