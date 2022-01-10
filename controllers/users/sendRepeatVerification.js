const {User} = require("../../models/");
const {sendEmail} = require("../../helpers");
const {NotFound} = require("http-errors");

async function sendRepeatVerification(req, res) {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw new NotFound("User with passed email not found");
    }
    if (user.verify === true) {
        res.status(400).json({
            message: "Verification has already been passed"
        });
    }

    const mailToUser = {
        to: email,
        subject: "Repeated verification request",
        html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Link for the repeated verification</a>`
    };

    await sendEmail(mailToUser);
    res.status(200).json({
        message: "Verification email sent"
    });
}

module.exports = sendRepeatVerification;