const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const uuid = require("uuid");
const { sendEmail } = require("../../helpers");

const { User } = require("../../models/");

async function register(req, res) {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new Conflict(`Email in use`)
    }
    const avatarURL = gravatar.url(email);
    const verifyToken = uuid.v4();
    const newUser = new User({ email, subscription, avatarURL, verificationToken: verifyToken });
    newUser.setPassword(password);
    await newUser.save();

    const mailToUser = {
        to: email,
        subject: "Register confirmation",
        html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verifyToken}">Confirm email</a>`
    };

    await sendEmail(mailToUser);

    res.status(201).json({
        status: "success",
        code: 201,
        data: {
            user: {
                email,
                subscription: subscription || newUser.subscription,
                avatarURL,
                verifyToken
            }
        }
    });
}

module.exports = register;