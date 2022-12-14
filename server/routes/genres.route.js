const express = require("express");
const router = express.Router();

const genresController = require("../controllers/genres");

router.get("/get-all-genres", genresController.getAll);

router.get("/get-multi/:slug", genresController.getMulti);

router.get("/get-detail/:id", genresController.getDetail);

router.post("/create", genresController.create);

router.put("/update/:id", genresController.update); 

router.delete("/delete/:id", genresController.delete);

module.exports = router;
