const express = require("express");
const router = express.Router();
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  getSummary,
  getCategorySummary,
  getRecent,
} = require("../controllers/recordController");


const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Apply authentication to all routes
router.use(verifyToken);

//role-based control
// Admin only
router.post("/", checkRole(["admin"]), createRecord);
router.put("/:id", checkRole(["admin"]), updateRecord);
router.delete("/:id", checkRole(["admin"]), deleteRecord);

// All users can view
router.get("/", checkRole(["viewer", "analyst", "admin"]), getRecords);

// Dashboard (analyst + admin)
router.get("/summary", checkRole(["analyst", "admin"]), getSummary);
router.get("/category-summary", checkRole(["analyst", "admin"]), getCategorySummary);
router.get("/recent", checkRole(["analyst", "admin"]), getRecent);

module.exports = router;



