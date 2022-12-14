const History = require("../models/histories");
class HistoryController {
  async addHistortiesMovie(req, res) {
    try {
      const histories = await History.findOne({
        userId: req.body.userId,
        movieId: req.body.movieId,
      });
      if (histories) {
        await histories.updateOne({ createdAt: new Date(0) });
        res.status(200).json({
          success: true,
          message: "Đã xem phim lại gần đây",
        });
      } else {
        const historiesMovie = new History(req.body);
        await historiesMovie.save();
        res.status(200).json({
          success: true,
          message: "Đã xem phim gần đây thành công",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUserMovieHistories(req, res) {
    try {
      const movies = await History.find({ userId: req.params.id })
        .select("movieId")
        .sort({ updatedAt: -1 })
        .populate("movieId");
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

module.exports = new HistoryController();
