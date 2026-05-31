const express = require("express");
const {
  changeRole,
  changeStatus,
  enquiries,
  overview,
  users,
} = require("./admin.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

router.get("/overview", overview);
router.get("/users", users);
router.patch("/users/:userId/role", changeRole);
router.patch("/users/:userId/status", changeStatus);
router.get("/enquiries", enquiries);

module.exports = router;
