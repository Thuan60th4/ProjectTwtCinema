const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const favoriteController = require("../controllers/favorite");
const historyController = require("../controllers/history");

router.get("/get-all-user", userController.getAll);

router.get("/get-detail/:email", userController.getDetail);

router.get("/get-user-all-year", userController.countEachMonth);

router.put("/edit-user/:user_email", userController.editUser);

router.put("/update-user/:email", userController.updateUser);

router.put("/change-password", userController.changePassword);

// router.get("/get-favorites-movie/:email", userController.getFavoritesMovie);

// router.post("/add-favourite", userController.addFavourite);

// router.post("/history", userController.addHistory);

router.delete("/delete/:id", userController.deleteUser);

router.put("/delete-user-client", userController.deleteUser);


router.get(
  "/get-favorites-movie/:id",
  favoriteController.getListFavoritesMovie
);

router.get("/user-favorites/:id", favoriteController.getUserMovieFavorites);

router.post("/add-favourite", favoriteController.addFavouritesMovie);

router.get("/user-history/:id", historyController.getUserMovieHistories);

router.post("/add-history", historyController.addHistortiesMovie);


module.exports = router;
