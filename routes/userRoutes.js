const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserRole,
} = require("../controllers/userController");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router
  .route("/role")
  .patch(authenticateUser, authorizePermissions("admin"), updateUserRole);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
