const Movies = require("../models/Movies");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const path = require("path");

const createMovie = async (req, res) => {
  req.body.user = req.user.userId;
  const movie = await Movies.create({
    ...req.body,
    releaseDate: new Date(req.body.releaseDate),
  });
  res.status(StatusCodes.CREATED).send({ movie });
};

const getAllMovies = async (req, res) => {
  const { search, sortBy, sortOrder, page, startDate, endDate } = req.query;

  const sort = {};
  let filter = {
    skip: 0,
    limit: 5,
  };
  const $text = {};
  if (search) filter.search = search;
  if (sortBy) {
    sort[sortBy || "createdAt"] = sortOrder === "asc" ? -1 : 1;
  }
  if (page) filter.skip = (+page - 1) * filter.limit;

  if (startDate || endDate) {
    filter = {
      ...filter,
      releaseDate: {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) }),
      },
    };
  }
  let movies = [];
  if (search) {
    $text.$search = search;

    movies = await Movies.find({ $text }, { score: { $meta: "textScore" } })
      .skip(filter.skip)
      .limit(filter.limit)
      .sort({ score: { $meta: "textScore" } });
  } else {
    movies = await Movies.find({
      ...(filter.releaseDate && { releaseDate: filter.releaseDate }),
    })
      .skip(filter.skip)
      .limit(filter.limit)
      .sort(sort);
  }

  res.status(StatusCodes.OK).json({ movies, count: movies.length });
};

const getSingleMovie = async (req, res) => {
  const { id: movieId } = req.params;
  const movie = await Movies.findOne({ _id: movieId });
  if (!movie) {
    throw new customError.NotFoundError(`there is no movie with id:${movieId}`);
  }
  res.status(StatusCodes.OK).json({ movie });
};

const updateMovie = async (req, res) => {
  const { id: movieId } = req.params;
  const movie = await Movies.findOneAndUpdate({ _id: movieId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!movie) {
    throw new CustomError.NotFoundError(`No movie with id : ${movieId}`);
  }
  res.status(StatusCodes.OK).json({ movie });
};

const deleteMovie = async (req, res) => {
  const { id: movieId } = req.params;

  const movie = await Movies.findOne({ _id: movieId });

  if (!movie) {
    throw new CustomError.NotFoundError(`No movie with id : ${movieId}`);
  }

  await movie.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Movie removed." });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError("no file uploaded");
  }
  const movieImage = req.files.image;
  if (!movieImage.mimetype.startsWith("image")) {
    throw new customError.BadRequestError("please upload image");
  }
  const maxSize = 1024 * 1024;
  if (movieImage.size > maxSize) {
    throw new customError.BadRequestError("please upload smaller than 1 MB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${movieImage.name}`
  );
  await movieImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${movieImage.name}` } });
};

module.exports = {
  createMovie,
  getAllMovies,
  getSingleMovie,
  updateMovie,
  deleteMovie,
  uploadImage,
};
