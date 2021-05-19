const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/hostalUser');
const Student = require('../models/student');
const RoomSlot = require('../models/roomSlot');
const Bed = require('../models/bed');
const Almirah = require('../models/almirah');
const Table = require('../models/table');
const Chair = require('../models/chair');
const helpersController = require('../controllers/helpers');

router.post('/signin', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.find({ email: req.body.email})
            .exec()
            .then(user => {
                if (user.length < 1) {
                    Student.find({ email: req.body.email, roll: req.body.password })
                        .exec()
                        .then(student => {
                            if (student && student.length > 0) {
                                const OTP = helpersController.generate_OTP(6);
                                let expiry = new Date();
                                expiry.setMinutes(expiry.getMinutes() + 10);
                                helpersController.send_otp_verification_code(req.body.email, OTP);
                                Student.updateOne({ email: req.body.email }, { verification_code: OTP, verification_expiry: expiry }, function (err, result) {
                                    if (err) {
                                        res.status(500).json({
                                            err: err
                                        });
                                    }
                                    else {
                                        res.status(201).json({
                                            msg: 'Check your email for OTP.'
                                        })
                                    }
                                });
                            } else {
                                res.status(400).json({
                                    err: "User not registered"
                                })
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                err: err
                            });
                        });
                }
                else {
                    const OTP = helpersController.generate_OTP(6);
                    let expiry = new Date();
                    expiry.setMinutes(expiry.getMinutes() + 10);
                    helpersController.send_otp_verification_code(req.body.email, OTP);
                    User.updateOne({ email: req.body.email }, { verification_code: OTP, verification_expiry: expiry }, function (err, result) {
                        if (err) {
                            res.status(500).json({
                                err: err
                            });
                        }
                        else {
                            res.status(201).json({
                                msg: 'Check your email for OTP.'
                            })
                        }
                    });
                }
            })
            .catch(err => {
                res.status(401).json({
                    err: "Un Authorised"
                })
            })
    }
    else {
        res.status(400).json({
            err: "Insufficient Data"
        })
    }

});



router.post('/verify/otp', (req, res, next) => {
    if (req.body.email && req.body.otp) {
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length == 1) {
                    const OTP = req.body.otp;
                    User.find({ email: req.body.email, verification_code: req.body.otp })
                        .exec()
                        .then(user => {
                            if (user.length == 1) {
                                let expiry_date = new Date(user[0].verification_expiry).getTime();
                                if (expiry_date >= new Date().getTime()) {
                                    User.updateOne({ email: req.body.email }, { isVerified: true, verification_code: null, verification_expiry: null }, function (err, result) {
                                        if (err) {
                                            res.status(500).json({
                                                err: err
                                            });
                                        }
                                        else {
                                            const token = jwt.sign({
                                                id: user[0]._id,
                                                email: user[0].email,
                                                userType: user[0].type
                                            },
                                                process.env.JWT_KEY,
                                                {
                                                    expiresIn: "30d"
                                                })
                                            res.status(201).json({
                                                msg: 'Authorised',
                                                userName: user[0].fullName,
                                                userEmail: user[0].email,
                                                userType: user[0].type,
                                                token: token,
                                                expiresIn: 30 * 24 * 60 * 60,
                                            })
                                        }
                                    });
                                }
                                else {
                                    res.status(422).json({
                                        err: "OTP Expired"
                                    })
                                }
                            }
                            else {
                                res.status(422).json({
                                    err: "Incorrect OTP"
                                })
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                err: err
                            })
                        })
                }
                else {
                    Student.find({ email: req.body.email, verification_code: req.body.otp })
                        .exec()
                        .then(student => {
                            if (student.length == 1) {
                                let expiry_date = new Date(student[0].verification_expiry).getTime();
                                if (expiry_date >= new Date().getTime()) {
                                    Student.updateOne({ email: req.body.email }, { verification_code: null, verification_expiry: null }, function (err, result) {
                                        if (err) {
                                            res.status(500).json({
                                                err: err
                                            });
                                        }
                                        else {
                                            const token = jwt.sign({
                                                id: student[0]._id,
                                                email: student[0].email,
                                                userType: 'Student'
                                            },
                                                process.env.JWT_KEY,
                                                {
                                                    expiresIn: "30d"
                                                })
                                            if (student[0].roomSlot) {
                                                RoomSlot.find({ _id: student[0].roomSlot })
                                                    .exec()
                                                    .then(async roomSlot => {
                                                        let almirah = await Almirah.find({ _id: roomSlot[0].almirah });
                                                        let bed = await Bed.find({ _id: roomSlot[0].bed });
                                                        let chair = await Chair.find({ _id: roomSlot[0].chair });
                                                        let table = await Table.find({ _id: roomSlot[0].table });
                                                        let x = {
                                                            ...student[0]._doc, 
                                                            userHostel: roomSlot[0].hostel, 
                                                            userRoom: roomSlot[0].room,
                                                            hostelName: roomSlot[0].hostelName,
                                                            roomName: roomSlot[0].roomName,
                                                            almirahNumber: almirah[0].number,
                                                            almirahKey: almirah[0].key,
                                                            bedNumber: bed[0].number,
                                                            chairNumber: chair[0].number,
                                                            tableNumber: table[0].number,
                                                            tableKey: table[0].key
                                                        }
                                                        res.status(200).json({
                                                            msg: "Authorised",
                                                            userName: student[0].name,
                                                            userEmail: student[0].email,
                                                            userType: 'Student',
                                                            token: token,
                                                            student: x,
                                                            expiresIn: 30 * 24 * 60 * 60,
                                                        })
                                                    })
                                            } else {
                                                Student.find({ email: student[0].email })
                                                    .exec()
                                                    .then(async student => {
                                                        res.status(200).json({
                                                            msg: "Authorised",
                                                            userName: student[0].name,
                                                            userEmail: student[0].email,
                                                            userType: 'Student',
                                                            token: token,
                                                            student: student[0],
                                                            expiresIn: 30 * 24 * 60 * 60,
                                                        })
                                                    })
                                            }
                                        }
                                    });
                                }
                                else {
                                    res.status(422).json({
                                        err: "OTP Expired"
                                    })
                                }
                            }
                            else {
                                res.status(422).json({
                                    err: "Incorrect OTP"
                                })
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                err: err
                            })
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                })
            })
    }
    else {
        res.status(400).json({
            err: "Insufficient Data"
        })
    }

})



router.post('/resetPassword', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length == 1) {
                    let expiry = new Date();
                    expiry.setMinutes(expiry.getMinutes() + 10);
                    const OTP = helpersController.generate_OTP(6);
                    helpersController.send_reset_verification_code(req.body.email, OTP)
                    bcrypt.hash(req.body.password, 7, (err, hash) => {
                        if (err) {
                            res.status(500).json({
                                err: err
                            })
                        }
                        else {
                            User.updateOne({ email: req.body.email }, { temp_password: hash, verification_code: OTP, verification_expiry: expiry }, function (err, result) {
                                if (err) {
                                    res.status(500).json({
                                        err: err
                                    });
                                }
                                else {

                                    res.status(201).json({
                                        msg: 'Enter OTP'
                                    })
                                }
                            });
                        }
                    })

                }
            })
            .catch(err => {
                res.status(500).json({
                    err: "err"
                })
            })
    }
    else {
        res.status(422).json({
            err: "Insufficient Data"
        })
    }

})
router.post('/resetPassword/verify', (req, res, next) => {
    if (req.body.email && req.body.otp) {
        User.find({ email: req.body.email, verification_code: req.body.otp })
            .exec()
            .then(user => {
                if (user.length == 1) {
                    const expiry_date = new Date(user[0].verification_expiry).getTime();
                    if (expiry_date >= new Date().getTime()) {
                        User.updateOne({ email: req.body.email }, { password: user[0].temp_password, temp_password: null, verification_code: null, verification_expiry: null }, function (err, result) {
                            if (err) {
                                res.status(500).json({
                                    err: err
                                });
                            }
                            else {

                                res.status(201).json({
                                    msg: 'Password successfully changed'
                                })
                            }
                        });
                    }
                }
                else {
                    res.status(500).json({
                        err: "Un Authorised"
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                })
            })
    }
    else {
        res.status(422).json({
            err: "Insufficient Data"
        })
    }
})

module.exports = router