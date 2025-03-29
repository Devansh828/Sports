// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
        user: 'goyaldevansh828@gmail.com',
        pass: 'hmwf cnww tbqu ughg'
    }
});

const sendEmail = (to) => {
    const mailOptions = {
        from: 'goyaldevansh828@gmail.com',
        to: to,
        subject: "Sports",
        text: "Thanks for joining us! You have to remember your password"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = sendEmail;
