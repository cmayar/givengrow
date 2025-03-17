import express from "express";
import router from "express";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ title: "Express" });
});

module.exports = router;
