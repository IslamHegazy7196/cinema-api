const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createMovie,
  getAllMovies,
  getSingleMovie,
  updateMovie,
  deleteMovie,
  uploadImage,
} = require("../controllers/moviesController");

router
  .route("/")
  .get(getAllMovies)
  .post(
    authenticateUser,
    authorizePermissions("admin", "moderator"),
    createMovie
  );
router
  .route("/uploadImage")
  .post(
    [authenticateUser, authorizePermissions("admin", "moderator")],
    uploadImage
  );
router
  .route("/:id")
  .get(getSingleMovie)
  .patch(
    authenticateUser,
    authorizePermissions("admin", "moderator"),
    updateMovie
  )
  .delete(
    authenticateUser,
    authorizePermissions("admin", "moderator"),
    deleteMovie
  );

module.exports = router;
