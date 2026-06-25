const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/auth.middleware");

const {
    getSubjects
}=require("../controllers/subject.controller");

router.get(
    "/",
    authMiddleware,
    getSubjects
);

module.exports=router;