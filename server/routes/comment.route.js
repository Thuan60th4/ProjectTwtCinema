const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");

router.get("/get-comment/:id", commentController.getCommentByid);

router.get("/get-count-comment/:id", commentController.getCountComments);

router.get("/get-count-comment-month", commentController.TotalCommentByMonth);

router.get("/get-comment-month", commentController.commentByMonth);

router.post("/post-comment", commentController.postComment);

router.put("/update-comment/:id", commentController.updateComment);

router.delete("/delete-comment/:id", commentController.deleteComment);



module.exports = router;
