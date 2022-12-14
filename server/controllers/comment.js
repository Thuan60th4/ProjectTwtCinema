const { findByIdAndUpdate } = require("../models/comments");
const Comment = require("../models/comments");
// const User = require("../models/user");

class CommentController {
  async getCommentByid(req, res) {
    try {
      const comment = await Comment.find({ movieId: req.params.id })
        .populate({
          path: "userId",
          select: ["name", "email", "avatar"],
        })
        .sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCountComments(req, res) {
    try {
      const counts = await Comment.countDocuments({ movieId: req.params.id });
      res.status(200).json({
        success: true,
        counts: counts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async postComment(req, res) {
    try {
      // const user = User.findOne({ _id: req.body.userId });
        const comment = new Comment(req.body);
        await comment.save();
        res.status(200).json({
          success: true,
          message: "Bình luận thành công",
        });
      
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateComment(req, res) {
    try {
      await Comment.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteComment(req, res) {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Đã xoá thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async TotalCommentByMonth(req, res) {
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
      const comment = await Comment.countDocuments({
        createdAt: {
          $gte: firstDateOfCurrentMonth,
          $lt: endDateOfCurrentMonth,
        },
      });
      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async commentByMonth(req, res) {
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
      const comment = await Comment.find({
        createdAt: {
          $gte: firstDateOfCurrentMonth,
          $lt: endDateOfCurrentMonth,
        },
      })
        .populate({
          path: "userId",
          select: ["name", "email", "avatar"],
        })
        .sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CommentController();
