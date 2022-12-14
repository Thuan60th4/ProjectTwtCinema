const Favorite = require("../models/favorites");
class FavoriteController {
  async getListFavoritesMovie(req, res) {
    try {
      const favorites = await Favorite.find({ userId: req.params.id });
      const listFavoriteMovie = favorites.map((favorite) => favorite.movieId);
      res.status(200).json({
        success: true,
        data: listFavoriteMovie,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addFavouritesMovie(req, res) {
    try {
      const favorites = await Favorite.findOne({
        userId: req.body.userId,
        movieId: req.body.movieId,
      });
      if (favorites) {
        // await favorites.updateOne({ createdAt: new Date(0) });
        await favorites.deleteOne();
        res.status(200).json({
          success: true,
          message: "Đã bỏ yêu thích phim",
        });
      } else {
        const favoritesMovie = new Favorite(req.body);
        await favoritesMovie.save();
        res.status(200).json({
          success: true,
          message: "Đã thêm phim yêu thích thành công",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUserMovieFavorites(req, res) {
    try {
      const movies = await Favorite.find({ userId: req.params.id })
        .select("movieId")
        .sort({ createdAt: -1 })
        .populate("movieId")
      res.status(200).json({
        success: true,
        data: movies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new FavoriteController();
