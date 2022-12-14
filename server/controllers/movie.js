const Movie = require("../models/movie");
const Comment = require("../models/comments");
const Favortie = require("../models/favorites");
const History = require("../models/histories");

class MovieController {
  async create(req, res) {
    try {
      req.body.genres = req.body.genres.map((genre) => genre.toString());
      const movie = new Movie(req.body);
      await movie.save();
      res.status(200).json({
        success: true,
        message: "Thêm phim thành công",
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const movie = await Movie.findById(req.params.id);
      if (movie) {
        await movie.updateOne(req.body);
        res.status(200).json({
          success: true,
          message: "Cập nhật phim thành công",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Không tìm thấy trang hoặc yêu cầu!",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateViewed(req, res) {
    try {
      const movie = await Movie.updateOne(
        { slug: req.params.slug },
        { $inc: { viewed: 1 } }
      );
      res.status(200).json({
        success: true,
        message: "Đã xem",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getTotalViewed(req, res) {
    try {
      let totalView = 0;
      const movies = await Movie.find();
      movies.forEach(function (movie) {
        totalView += movie.viewed;
      });
      res.status(200).json({
        success: true,
        count: totalView,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await Movie.deleteOne({ _id: req.params.id });
      await Comment.deleteMany({ movieId: req.params.id });
      await Favortie.deleteMany({ movieId: req.params.id });
      await History.deleteMany({ movieId: req.params.id });

      res.status(200).json({
        success: true,
        message: "Xoá phim thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      let data;
      let countDocument;
      const limit = 10;
      const currPage = req.query.page ? req.query.page : 1;
      const category = req.query.category;
      const { keyword } = req.query;
      if (keyword) {
        const movies = await Movie.find({
          name: { $regex: keyword, $options: "$i" },
        })
          //{ $text: { $search: keyword } } cách tìm theo cả từ
          .skip(limit * currPage - limit)
          .limit(limit);
        countDocument = await Movie.countDocuments({
          name: { $regex: keyword, $options: "$i" },
        });
        res.status(200).json({
          success: true,
          data: movies,
          pages: Math.ceil(countDocument / limit),
        });
      }
      // else if (field && value) {
      //   const movies = await Movie.find({})
      //     .sort({ [field]: value })
      //     .skip(limit * currPage - limit)
      //     .limit(limit);
      //   data = movies;

      //   countDocument = await Movie.countDocuments();
      //   res.status(200).json({
      //     success: true,
      //     data,
      //     pages: Math.ceil(countDocument / limit),
      //   });
      // }
      else {
        let countDocument;
        if (category == "all") {
          countDocument = await Movie.countDocuments();
          const movies = await Movie.find({})
            .sort({ releaseDate: -1 })
            .skip(limit * currPage - limit)
            .limit(limit);
          data = movies;
        } else {
          countDocument = await Movie.countDocuments({ category });
          const movies = await Movie.find({ category })
            .sort({ releaseDate: -1 })
            .skip(limit * currPage - limit)
            .limit(limit);
          data = movies;
        }

        res.status(200).json({
          success: true,
          data,
          pages: Math.ceil(countDocument / limit),
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getDetail(req, res) {
    try {
      const movie = await Movie.findOne({ slug: req.params.slug });
      if (movie) {
        res.status(200).json({
          success: true,
          data: movie,
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

  async getByCategory(req, res) {
    try {
      let data;
      let countDocuments;
      const limit = 20;
      const currPage = req.query.page ? req.query.page : 1;
      const { category, type } = req.params;

      if (category) {
        if (type === "top_rated") {
          const movies = await Movie.find({
            category,
            ibmPoints: { $gte: "6.5" },
          })
            .sort({ ibmPoints: -1 })
            .skip(limit * currPage - limit)
            .limit(limit);
          data = movies;
          countDocuments = await Movie.countDocuments({
            category,
            ibmPoints: { $gte: "6.5" },
          });
        } else if (type === "popular") {
          const movies = await Movie.find({ category, viewed: { $gte: 10 } })
            .sort({ viewed: -1 })
            .skip(limit * currPage - limit)
            .limit(limit);
          data = movies;
          countDocuments = await Movie.countDocuments({
            category,
            viewed: { $gte: 10 },
          });
        } else if (type === "upcoming") {
          var date = new Date();
          const movies = await Movie.find({
            category,
            releaseDate: {
              $gte: `${date.getFullYear()}-${date.getMonth() - 1}-1`,
            },
          })
            .sort({ releaseDate: -1 })
            .skip(limit * currPage - limit)
            .limit(limit);
          data = movies;
          countDocuments = await Movie.countDocuments({
            category,
            releaseDate: {
              $gte: `${date.getFullYear()}-${date.getMonth() - 1}-1`,
            },
          });
        }
      }

      res.status(200).json({
        success: true,
        data,
        pages: Math.ceil(countDocuments / limit),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getGenresById(req, res) {
    try {
      const movies = await Movie.find({
        $or: [{ genres: Number(req.params.id) }, { genres: req.params.id }],
      }).sort({ ibmPoints: -1 });
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

  // async getUserFavorites(req, res) {
  //   try {
  //     const user = await User.findOne({ email: req.query.email });
  //     if (user) {
  //       const movies = await Movie.find({ _id: { $in: user.favorites } });
  //       res.status(200).json({
  //         success: true,
  //         data: movies,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  // async getUserHistory(req, res) {
  //   try {
  //     const user = await User.findOne({ email: req.query.email });
  //     if (user) {
  //       const movies = await Movie.find({ _id: { $in: user.histories } });
  //       res.status(200).json({
  //         success: true,
  //         data: movies,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  // async addComment(req, res) {
  //   try {
  //     const movie = await Movie.findById(req.params.id);
  //     if (movie) {
  //       const movieComments = movie.comments;
  //       movieComments.push(req.body);

  //       await movie.updateOne({ comments: movieComments });
  //       res.status(200).json({
  //         success: true,
  //         message: "Đăng bình luận thành công",
  //       });
  //     } else {
  //       res.status(404).json({
  //         success: false,
  //         message: "Không tìm thấy trang hoặc yêu cầu!",
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  // async deleteComment(req, res) {
  //   try {
  //     const movie = await Movie.findById(req.params.id);
  //     if (movie) {
  //       const movieComments = movie.comments.filter(
  //         (comment) => comment.id !== req.body.id
  //       );

  //       await movie.updateOne({ comments: movieComments });
  //       res.status(200).json({
  //         success: true,
  //         message: "Xoá bình luận thành công",
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  async getSimilar(req, res) {
    try {
      const movie = await Movie.findOne({ slug: req.params.slug });
      const similarMovie = await Movie.find({
        category: movie.category,
        genres: { $in: movie.genres },
      });

      const data = similarMovie.filter(
        (similar) => similar.slug !== req.params.slug
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMovieByMonth(req, res) {
    var date = new Date();
    var firstDateOfCurrentMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
    var endDateOfCurrentMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );

    try {
      const movie = await Movie.find({
        createdAt: {
          $gte: firstDateOfCurrentMonth,
          $lt: endDateOfCurrentMonth,
        },
      });
      res.status(200).json({
        success: true,
        data: movie,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async countMovieByMonth(req, res) {
    var date = new Date();
    var firstDateOfCurrentMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
    var endDateOfCurrentMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );

    try {
      const movie = await Movie.countDocuments({
        createdAt: {
          $gte: firstDateOfCurrentMonth,
          $lt: endDateOfCurrentMonth,
        },
      });
      res.status(200).json({
        success: true,
        data: movie,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new MovieController();
