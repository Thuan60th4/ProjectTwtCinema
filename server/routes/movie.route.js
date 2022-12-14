const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movie");

router.get("/get-all", movieController.getAll);

router.get("/get-detail/:slug", movieController.getDetail);

router.get("/get-count-movie-month", movieController.countMovieByMonth);

router.get("/get-movie-month", movieController.getMovieByMonth);

router.get("/get-total-view", movieController.getTotalViewed);

router.post("/create", movieController.create);

router.put("/update/:id", movieController.update);

router.put("/update-viewed/:slug", movieController.updateViewed);

router.delete("/delete/:id", movieController.delete);

// router.get("/user-favorites", movieController.getUserFavorites);

// router.get("/user-history", movieController.getUserHistory);

router.get("/similar-movies/:slug", movieController.getSimilar);

router.get("/get-by-genres/:id", movieController.getGenresById);

router.get("/:category/:type", movieController.getByCategory);

module.exports = router;
