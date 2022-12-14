const User = require("../models/user");
const Comment = require("../models/comments");
const Favortie = require("../models/favorites");
const History = require("../models/histories");

const bcrypt = require("bcrypt");

class UserController {
  async getAll(req, res) {
    try {
      const users = await User.find({}).select("-password");
      res.status(200).json({
        success: true,
        data: users,
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
      const user = await User.findOne({ email: req.params.email }).select(
        "-password"
      );
      if (user) {
        res.status(200).json({
          success: true,
          data: user,
        });
      } else {
        res.status(200).json({
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

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        message: "Thay đổi tên thành công",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async editUser(req, res) {
    try {
      await User.findOneAndUpdate(
        { email: req.params.user_email },
        {
          name: req.body.name,
          avatar: req.body.avatar,
          isAdmin: req.body.isAdmin,
        }
      );

      res.status(200).json({
        success: true,
        message: "Sửa người dùng thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      if (req.params.id) {
        await User.deleteOne({ _id: req.params.id });
        await Comment.deleteMany({ userId: req.params.id });
        await Favortie.deleteMany({ userId: req.params.id });
        await History.deleteMany({ userId: req.params.id });

        res.status(200).json({
          success: true,
          message: "Xoá người dùng thành công",
        });
      } else if (req.body.email) {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const validiti = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (validiti) {
            await user.deleteOne();
            await Comment.deleteMany({ userId: user._id });
            await Favortie.deleteMany({ userId: user._id });
            await History.deleteMany({ userId: user._id });

            res.status(200).json({
              success: true,
              message: "Đã xoá tài khoản mời bạn quay trang đăng nhập",
            });
          } else {
            res.status(200).json({
              success: false,
              message: "Mật khẩu không chính xác",
            });
          }
        }
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

  async changePassword(req, res) {
    try {
      const { email, newPassword, oldPassword, id } = req.body;
      if (id && newPassword) {
        const user = await User.findById(id);
        if (user) {
          const salt = await bcrypt.genSalt(10);
          const hashNewPassword = await bcrypt.hash(newPassword, salt);
          await user.updateOne({ password: hashNewPassword });
          res.status(200).json({
            success: true,
            message: "Đặt lại mật khẩu thành công",
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Không tìm thấy tài khoản",
          });
        }
      } else if (email && oldPassword && newPassword) {
        const user = await User.findOne({ email: email });
        if (user) {
          const validiti = await bcrypt.compare(oldPassword, user.password);
          if (validiti) {
            const salt = await bcrypt.genSalt(10);
            const hashNewPassword = await bcrypt.hash(newPassword, salt);
            await user.updateOne({ password: hashNewPassword });

            res.status(200).json({
              success: true,
              message: "Thay đổi mật khẩu thành công",
            });
          } else {
            res.status(200).json({
              success: false,
              message: "Mật khẩu cũ không chính xác",
            });
          }
        } else {
          res.status(200).json({
            success: false,
            message: "Sai tên tài khoản hoặc mật khẩu",
          });
        }
      } else {
        res.status(200).json({
          success: false,
          message: "Thiếu thông tin email hặc mật khẩu",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // async getFavoritesMovie(req, res) {
  //   try {
  //     const user = await User.findOne({ email: req.params.email }).select(
  //       "-password"
  //     );
  //     res.status(200).json({
  //       success: true,
  //       data: user.favorites,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  // async addFavourite(req, res) {
  //   try {
  //     const user = await User.findOne({ email: req.query.email });
  //     if (user) {
  //       const movieFavorites = user.favorites;

  //       if (!movieFavorites.includes(req.body.movieId)) {
  //         movieFavorites.unshift(req.body.movieId);

  //         await user.updateOne({ favorites: movieFavorites });

  //         res.status(200).json({
  //           success: true,
  //           message: "Thêm vào yêu thich thành công",
  //         });
  //       } else {
  //         const newFavorites = movieFavorites.filter(
  //           (id) => req.body.movieId != id
  //         );
  //         await user.updateOne({ favorites: newFavorites });

  //         res.status(200).json({
  //           success: true,
  //           message: "Xoá phim yêu thich thành công",
  //         });
  //       }
  //     } else {
  //       res.status(404).json({
  //         success: false,
  //         message: "Không tìm thấy trang hoặc yêu cầu",
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  // async addHistory(req, res) {
  //   try {
  //     const user = await User.findOne({ email: req.query.email });
  //     if (user) {
  //       const histories = user.histories;

  //       if (!histories.includes(req.body.movieId)) {
  //         histories.unshift(req.body.movieId);

  //         await user.updateOne({ histories });
  //       } else {
  //         const newHistories = histories.filter((id) => req.body.movieId != id);
  //         newHistories.unshift(req.body.movieId);

  //         await user.updateOne({ histories: newHistories });
  //       }

  //       res.status(200).json({
  //         success: true,
  //         message: "Thêm vào lịch sử thành công",
  //       });
  //     } else {
  //       res.status(404).json({
  //         success: false,
  //         message: "Không tìm thấy trang hoặc yêu cầu",
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  // async countUserByMonth(req, res) {
  //   var date = new Date();
  //   var firstDateOfCurrentMonth = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     1
  //   );
  //   var endDateOfCurrentMonth = new Date(
  //     date.getFullYear(),
  //     date.getMonth() + 1,
  //     0
  //   );

  //   try {
  //     const user = await User.countDocuments({
  //       createdAt: {
  //         $gte: firstDateOfCurrentMonth,
  //         $lt: endDateOfCurrentMonth,
  //       },
  //     });
  //     res.status(200).json({
  //       success: true,
  //       data: user,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // }

  async countEachMonth(req, res) {
    var date = new Date();
    let users = [];
    try {
      for (let i = 1; i <= 12; i++) {
        let firstDateOfCurrentMonth = new Date(date.getFullYear(), i - 1, 1);
        let endDateOfCurrentMonth = new Date(date.getFullYear(), i, 0);
        const user = await User.countDocuments({
          createdAt: {
            $gte: firstDateOfCurrentMonth,
            $lt: endDateOfCurrentMonth,
          },
        });

        users.push({ Tháng: "Tháng " + i, Số_Lượng: user });
      }
      res.status(200).json({
        success: true,
        total: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
