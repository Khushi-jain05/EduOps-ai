const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createTemplate,
  getTemplates,
  updateTemplate,
  toggleTemplate,
  deleteTemplate,
} = require("../controllers/whatsapp.controller");

router.post("/", auth, createTemplate);
router.get("/", auth, getTemplates);
router.put("/:id", auth, updateTemplate);
router.patch("/:id/toggle", auth, toggleTemplate);
router.delete("/:id", auth, deleteTemplate);

module.exports = router;
