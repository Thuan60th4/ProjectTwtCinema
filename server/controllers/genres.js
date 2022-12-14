const Genres = require("../models/genres");
const Movie = require("../models/movie");

class GenresController {
  async getAll(req, res) {
    try {
      if (req.query.limit) {
        const limit = req.query.limit;
        const currPage = req.query.page ? req.query.page : 1;
        const genres = await Genres.find({})
          .skip(limit * currPage - limit)
          .limit(limit);

        const countDocument = await Genres.countDocuments();

        res.status(200).json({
          success: true,
          data: genres,
          pages: Math.ceil(countDocument / limit),
        });
      } else {
        const genres = await Genres.find({});
        res.status(200).json({
          success: true,
          data: genres,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMulti(req, res) {
    try {
      const movie = await Movie.findOne({ slug: req.params.slug });
      const genres = await Genres.find({ id: { $in: movie.genres } });
      res.status(200).json({
        success: true,
        data: genres,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDetail(req, res) {
    try {
      const genres = await Genres.findById(req.params.id);
      if (genres) {
        res.status(200).json({
          success: true,
          data: genres,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Không tìm thấy trang hoặc yêu cầu",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newGenres = new Genres(req.body);
      await newGenres.save();
      res.status(200).json({
        success: true,
        message: "Thêm thể loại thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const genres = await Genres.findById(req.params.id);
      if (genres) {
        await genres.updateOne(req.body);
        res.status(200).json({
          success: true,
          message: "Sửa thể loại thành công",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Không tìm thấy trang hoặc yêu cầu",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const genres = await Genres.findById(req.params.id);
      if (genres) {
        await genres.deleteOne({ _id: req.params.id });
        res.status(200).json({
          success: true,
          message: "Xoá thể loại thành công",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Không tìm thấy trang hoặc yêu cầu",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new GenresController();
