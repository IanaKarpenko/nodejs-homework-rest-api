const express = require('express')
const {validation, controlslWrapper, auth} = require("../../middlewares");
const {userRegisterJoiSchema, userLoginJoiSchema, userSubscriptionJoiSchema} = require("../../models/user");
const {auth: controls, users: userControls} = require("../../controllers");

const router = express.Router();

router.post("/signup", validation(userRegisterJoiSchema), controlslWrapper(controls.register));

router.post("/login", validation(userLoginJoiSchema), controlslWrapper(controls.login));

router.post("/logout", auth, controlslWrapper(controls.logout));

router.get("/current", auth, controlslWrapper(userControls.getCurrentUser));

router.patch("/", auth, validation(userSubscriptionJoiSchema), controlslWrapper(userControls.changeSubscription));

module.exports = router