const path = require('path');
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


exports.generate_OTP = (length) => {
    const collection = "0123456789";
    let otp = '';
    for (let i = 1; i <= length; i++) {
        otp += collection[Math.floor(Math.random() * (collection.length))];
    }
    return otp;
}


exports.verifyEmail = (email) => {
    const normalEmailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const iiitmEmailValidator = /@iiitmanipur.ac.in\s*$/
    if (normalEmailValidator.test(String(email).toLowerCase())) {
        if (iiitmEmailValidator.test(String(email).toLowerCase())) {
            return "faculty";
        }
        else {
            return "normal";
        }
    }
    return false;
}


exports.send_otp_verification_code = async (email, otp) => {
    var appDir = path.dirname(require.main.filename);
    ejs.renderFile(appDir + "/API/templates/otp.ejs", { otp: otp }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            const oauth2Client = new OAuth2(
                process.env.CLIENT_ID,
                process.env.CLIENT_SECRET,
                "https://developers.google.com/oauthplayground"
            );
            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN
            });
            const createTransporter = async () => {
                const oauth2Client = new OAuth2(
                    process.env.CLIENT_ID,
                    process.env.CLIENT_SECRET,
                    "https://developers.google.com/oauthplayground"
                );

                oauth2Client.setCredentials({
                    refresh_token: process.env.REFRESH_TOKEN
                });

                const accessToken = await new Promise((resolve, reject) => {
                    oauth2Client.getAccessToken((err, token) => {
                        if (err) {
                            reject();
                        }
                        resolve(token);
                    });
                });

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: process.env.EMAIL,
                        accessToken,
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN
                    }
                });

                return transporter;
            };


            const sendEmail = async (emailOptions) => {
                let emailTransporter = await createTransporter();
                await emailTransporter.sendMail(emailOptions);
            };
            sendEmail({
                from: '"Antix Builds" <antixbuilds@gmail.com>',
                to: email,
                subject: "Welcome to Hostals",
                html: data,
            });
        }
    });
}
exports.send_reset_verification_code = async (email, otp) => {
    var appDir = path.dirname(require.main.filename);
    ejs.renderFile(appDir + "/API/templates/signup.ejs", { otp: otp }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASS
                },
            });
            const info = {
                from: '"Antix Builds" <antixbuilds@gmail.com>',
                to: email,
                subject: "Reset Your Password | Markem",
                html: data,
            };

            transporter.sendMail(info, function (err, info) {
                if (err) {
                } else {
                    console.log("SENT");
                }
            });
        }
    });
}


