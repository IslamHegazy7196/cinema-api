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
  getAllModerators,
} = require("../controllers/userController");

router
  .route("/moderators")
  .get(authenticateUser, authorizePermissions("admin"), getAllModerators);
router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/me").get(authenticateUser, showCurrentUser);
router
  .route("/role")
  .patch(authenticateUser, authorizePermissions("admin"), updateUserRole);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
